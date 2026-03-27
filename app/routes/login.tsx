import { Form, redirect, useActionData } from "react-router";
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

  return redirect("/home", {
    headers: {
      "Set-Cookie": `userId=${data.user._id}; Path=/; HttpOnly; SameSite=Lax`,
    },
  });
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-copy">
          <p className="auth-eyebrow">Book Space Account</p>
          <h1 className="auth-title">Log in to your reading space</h1>
          <p className="auth-text">
            Continue where you left off, access your saved books, and keep your
            reviews connected to your profile.
          </p>
        </div>

        <section className="auth-card">
          <h2 className="auth-card-title">Welcome back</h2>
          <p className="auth-card-text">
            Enter your email and password to continue.
          </p>

          {actionData?.error ? (
            <p className="auth-error">{actionData.error}</p>
          ) : null}

          <Form method="post" className="auth-form">
            <label className="auth-field">
              <span>Email</span>
              <input type="email" name="email" placeholder="Email" required />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </label>

            <button type="submit" className="auth-submit">
              Log in
            </button>
          </Form>
        </section>
      </section>
    </main>
  );
}
