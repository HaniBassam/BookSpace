import { Form, Link, redirect } from "react-router";
import type { Route } from "./+types/profile";
import { API_URL } from "../lib/api";

export async function action({ request }: Route.ActionArgs) {
    const cookie = request.headers.get("cookie") || "";

    await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
            Cookie: cookie,
        },
    });

    return redirect("/", {
        headers: {
            "Set-Cookie": "userId=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
        },
    });
}

export async function loader({ request }: Route.LoaderArgs) {
    const cookie = request.headers.get("cookie") || "";

    const userResponse = await fetch(`${API_URL}/me`, {
        headers: {
            Cookie: cookie,
        },
    });

    if (!userResponse.ok) {
        return redirect("/");
    }

    const user = await userResponse.json();

    const booksResponse = await fetch(`${API_URL}/books`);
    const books = await booksResponse.json();

    const savedBookIds = (user.savedBooks || []).map((id: any) => id.toString());

    const savedBooks = books.filter((book: any) =>
        savedBookIds.includes(book._id.toString())
    );

    return { user, savedBooks };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
    const { user, savedBooks } = loaderData;

    return (
        <main className="profile-page">
            <section className="profile-section">
                <Link to="/home" className="back-link">
                Back to Home
                </Link>

                <h1 className="profile-title">My Profile</h1>
                <p className="profile-name">{user.fullName}</p>
                <p className="profile-email">{user.email}</p>

                <Form method="post" className="logout-form">
                    <button type="submit" className="logout-button">
                        Log out
                    </button>
                </Form>

                <section className="saved-books-section">
                    <h2>Saved Books</h2>

                    {savedBooks.length === 0 ? (
                        <p>You have not saved any books yet.</p>
                    ) : (
                        <div className="book-grid">
                            {savedBooks.map((book: any) => (
                                <Link key={book._id} to={`/books/${book._id}`} >
                                    <article className="book-card">
                                        <img 
                                        src={book.coverImageUrl}
                                        alt={book.title}
                                        className="book-cover"
                                        />
                                        <div className="book-content">
                                            <h3 className="book-title">{book.title}</h3>
                                            <p className="book-author">{book.author}</p>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}
