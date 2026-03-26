import { useEffect, useState } from "react";
import { Form, Link, redirect } from "react-router";
import type { Route } from "./+types/books.$id";

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(`http://localhost:5001/books/${params.id}`);
  const book = await response.json();

  const reviewsResponse = await fetch(
    `http://localhost:5001/books/${params.id}/reviews`
  );
  const reviews = await reviewsResponse.json();

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

  return { book, similarBooks, reviews };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") || "");

  await fetch(`http://localhost:5001/books/${params.id}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rating, body }),
  });

  return redirect(`/books/${params.id}`);
}

export default function BookDetail({ loaderData }: Route.ComponentProps) {
  const { book, similarBooks, reviews } = loaderData;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");

  const descriptionText = Array.isArray(book.description)
    ? book.description.join(" ")
    : book.description;
  const shortDescription =
    descriptionText.length > 320
      ? `${descriptionText.slice(0, 320).trim()}...`
      : descriptionText;
  const renderStars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

  useEffect(() => {
    setSelectedRating(5);
    setReviewBody("");
  }, [reviews.length]);

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
            <p className="book-detail-description">
              {isDescriptionExpanded ? descriptionText : shortDescription}
            </p>
            {descriptionText.length > 320 ? (
              <button
                type="button"
                className="description-toggle"
                onClick={() => setIsDescriptionExpanded((value) => !value)}
              >
                {isDescriptionExpanded ? "Show less" : "Read more"}
              </button>
            ) : null}
          </div>
        </div>

        <section className="reviews-section">
          <h2>Reviews</h2>

          <Form method="post" className="review-form">
            <fieldset className="review-field review-stars-group">
              <span>Rating</span>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`review-star-button ${
                      value <= selectedRating ? "is-active" : ""
                    }`}
                    onClick={() => setSelectedRating(value)}
                    aria-label={`Set rating to ${value} stars`}
                    aria-pressed={value === selectedRating}
                  >
                    ★
                  </button>
                ))}
              </div>
              <input type="hidden" name="rating" value={selectedRating} />
            </fieldset>

            <label className="review-field">
              <span>Your review</span>
              <textarea
                name="body"
                rows={4}
                className="review-textarea"
                placeholder="Share what you thought about this book..."
                value={reviewBody}
                onChange={(event) => setReviewBody(event.target.value)}
                required
              />
            </label>

            <button type="submit" className="review-submit">
              Add review
            </button>
          </Form>

          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review: any) => (
                <article key={review._id} className="review-card">
                  <p className="review-rating">{renderStars(review.rating)}</p>
                  <p className="review-body">{review.body}</p>
                </article>
              ))}
            </div>
          )}
        </section>

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
