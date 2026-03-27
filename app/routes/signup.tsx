import { Form, Link, redirect, useActionData } from "react-router";
import type { Route } from "./+types/signup";
import { API_URL } from "../lib/api";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const fullName = String(formData.get("fullName") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullName, email, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    return {
      error: data?.message || "Sign up failed",
    };
  }

  return redirect("/");
}

export default function Signup() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-copy">
          <p className="auth-eyebrow">Book Space Account</p>
          <h1 className="auth-title">Create your reading space</h1>
          <p className="auth-text">
            Make an account to save books, write reviews, and keep your reading
            profile in one place.
          </p>
        </div>

        <section className="auth-card">
          <h2 className="auth-card-title">Create account</h2>
          <p className="auth-card-text">
            Enter your details to get started with Book Space.
          </p>

          {actionData?.error ? (
            <p className="auth-error">{actionData.error}</p>
          ) : null}

          <Form method="post" className="auth-form">
            <label className="auth-field">
              <span>Full name</span>
              <input
                type="text"
                name="fullName"
                placeholder="Full name"
                required
              />
            </label>

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
                minLength={8}
              />
            </label>

            <button type="submit" className="auth-submit">
              Create account
            </button>
          </Form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/" className="auth-link">
              Log in
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
