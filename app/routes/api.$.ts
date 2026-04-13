import type { Route } from "./+types/api.$";

const BACKEND_URL = process.env.API_PROXY_URL || "http://127.0.0.1:5001";

function buildBackendUrl(path: string, search: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(`${normalizedPath}${search}`, BACKEND_URL);
}

async function proxyRequest(request: Request, path: string) {
  const targetUrl = buildBackendUrl(path, new URL(request.url).search);
  const headers = new Headers(request.headers);

  headers.delete("host");
  headers.delete("content-length");

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(targetUrl, init);
  const responseHeaders = new Headers();

  response.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();

    if (
      lowerKey === "content-length" ||
      lowerKey === "connection" ||
      lowerKey === "transfer-encoding"
    ) {
      return;
    }

    responseHeaders.set(key, value);
  });

  const setCookie = response.headers.get("set-cookie");

  if (setCookie) {
    responseHeaders.set("set-cookie", setCookie);
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export async function loader({ request, params }: Route.LoaderArgs) {
  return proxyRequest(request, params["*"] || "");
}

export async function action({ request, params }: Route.ActionArgs) {
  return proxyRequest(request, params["*"] || "");
}
