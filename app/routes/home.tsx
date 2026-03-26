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

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const genre = url.searchParams.get("genre") || "";

  const response = await fetch(
    `http://localhost:5001/books?search=${encodeURIComponent(search)}&genre=${encodeURIComponent(genre)}`
  );
  const books = await response.json();

  return { books, search, genre };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { books, search, genre } = loaderData;

  const popularBooks = [...books]
    .sort((a, b) => b.ratingsCount - a.ratingsCount)
    .slice(0, 10);

  const topRatedBooks = [...books]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 10);

  const newestBooks = [...books]
    .sort((a, b) => b.publishedYear - a.publishedYear)
    .slice(0, 10);


  return (
    <main className="home-page">
      <div className="hero">

        <section className="hero-intro">
          <p className="header">Welcome to Book Space!</p>
          <h1 className="hero-title">Find Your Next Favorite Book</h1>
          <p className="hero-text">
            Explore books, keep track of what you read, and build your own
            reading space.
          </p>

          <form method="get" className="search-form">
            <input
              type="text"
              name="search"
              placeholder="Search for books..."
              defaultValue={search}
              className="search-input"
            />

<select name="genre" defaultValue={genre} className="genre-select">
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Mystery">Young Adult</option>
              <option value="Romance">Romance</option>
            </select>


            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </section>

        <section>
          <div className="section-header">
            <h2 className="books-title">Popular</h2>
            <span className="scroll-hint">
              Swipe <span className="scroll-arrow">→</span>
            </span>
          </div>

          <div className="book-grid">
            {popularBooks.map((book: any) => (
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

        <section>
          <div className="section-header">
            <h2 className="books-title">Top Rated</h2>
            <span className="scroll-hint">
              Swipe <span className="scroll-arrow">→</span>
            </span>
          </div>

          <div className="book-grid">
            {topRatedBooks.map((book: any) => (
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

        <section>
          <div className="section-header">
            <h2 className="books-title">Newest</h2>
            <span className="scroll-hint">
              Swipe <span className="scroll-arrow">→</span>
            </span>
          </div>

          <div className="book-grid">
            {newestBooks.map((book: any) => (
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
      </div>
    </main>
  );
}
