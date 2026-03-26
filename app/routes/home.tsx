import type { Route } from "./+types/home";

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
    <main>
      <section>
        <p>Welcome to Book Space!</p>
        <h1>Find Your Next Favorite Book</h1>
        <p>
          Explore books, keep track of what you read, and build your own reading space.
        </p>
        <section>
          
        </section>
        <h2>Books</h2>
        <ul>
          {books.map((book: any) => (
            <li key={book._id}>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
