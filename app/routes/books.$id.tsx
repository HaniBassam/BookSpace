import { Link } from "react-router";
import type { Route } from "./+types/books.$id";

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(`http://localhost:5001/books/${params.id}`);
  const book = await response.json();

  const booksResponse = await fetch("http://localhost:5001/books");
  const books = await booksResponse.json();

  const similarBooks = books
    .filter(
      (item: any) =>
        item._id !== book._id &&
        (item.author === book.author ||
          item.genre?.some((genre: string) => book.genre?.includes(genre)))
    )
    .slice(0, 4);

  return { book, similarBooks };
}

export default function BookDetail({ loaderData }: Route.ComponentProps) {
  const { book, similarBooks } = loaderData;

  return (
    <main className="book-detail-page">
      <section className="book-detail">
        <Link to="/" className="back-link">
           ← Back to Books
        </Link>

        <div className="book-detail-layout">
          <img src={book.coverImageUrl} alt={book.title} width="200" />

          <div className="book-detail-content">
            <p className="detail-label">Book details</p>
            <h1 className="book-detail-title">{book.title}</h1>
            <p className="book-detail-author">by {book.author}</p>

            <p className="book-detail-rating">
            Rating: {book.averageRating?.toFixed(1)}
            </p>

            <p className="book-detail-year">Published: {book.publishedYear}</p>
            <p className="book-detail-description">{book.description}</p>
          </div>
        </div>

        <section className="similar-books">
          <h2>Similar Books</h2>
          <div className="book-grid">
            {similarBooks.map((item: any) => (
              <Link key={item._id} to={`/books/${item._id}`}>
                <article className="book-card">
                  <img
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="book-cover"
                  />
                  <div className="book-content">
                    <h3 className="book-title">{item.title}</h3>
                    <p className="book-author">{item.author}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
