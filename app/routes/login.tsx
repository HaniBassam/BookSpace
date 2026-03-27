import { Form, redirect } from "react-router";
import type { Route } from "./+types/login";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const response = await fetch("http://127.0.0.1:5001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return { error: "Login failed" };
  }

  const data = await response.json();

  return redirect("/", {
    headers: {
      "Set-Cookie": `userId=${data.user._id}; Path=/; HttpOnly; SameSite=Lax`,
    },
  });
}

export default function Login() {
    return (
        <main>
            <section>
                <h1>Login</h1>

                <Form method="post">
                    <input
                        type="email" name="email" placeholder="Email" required />
                    <input
                        type="password" name="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </Form>
            </section>
        </main>
    );
}
