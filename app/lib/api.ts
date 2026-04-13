export function apiUrl(request: Request, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(`/api${normalizedPath}`, request.url);
}
