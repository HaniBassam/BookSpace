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

