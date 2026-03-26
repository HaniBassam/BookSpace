import type { Route } from "./+types/books.$id";

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(`http://localhost:5001/books/${params.id}`);
  const book = await response.json();

  return { book };
}

export default function BookDetail({ loaderData }: Route.ComponentProps) {
  const { book } = loaderData;

  return (
    <main>
      <section>
        <img src={book.coverImageUrl} alt={book.title} width="200" />
        <h1>{book.title}</h1>
        <p>{book.author}</p>
        <p>Rating: {book.averageRating?.toFixed(1)}</p>
        <p>{book.description}</p>
      </section>
    </main>
  );
}
