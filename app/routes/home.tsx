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

export default function Home() {
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
        <p>Your books will appear here.</p>
      </section>
    </main>
  );
}