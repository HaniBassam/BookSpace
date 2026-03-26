import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Book Space" },
    {
      name: "description",
      content: "Discover books, track your reading, and save your favorites.",
    },
  ];
}

export async function loader() {
  const response = await fetch("http://localhost:5001/books");
  const books = await response.json();

  return { books };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { books } = loaderData;

  return (
    <main className="home-page">
      <section className="hero">
        <p className="header">Welcome to Book Space!</p>
        <h1 className="hero-title">Find Your Next Favorite Book</h1>
        <p className="hero-text">
          Explore books, keep track of what you read, and build your own reading
          space.
        </p>

        <h2 className="books-title">Books</h2>

        <div className="book-grid">
          {books.map((book: any) => (
            <Link key={book._id} to={`/books/${book._id}`}>
              <article className="book-card">
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  width="120"
                  className="book-cover"
                />
                <div className="book-content">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <p className="book-rating">
                    Rating: {book.averageRating?.toFixed(1)}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
