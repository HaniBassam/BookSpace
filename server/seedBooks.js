import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Book from "./models/Book.js";
import books from "./books.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

async function seedBooks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Book.deleteMany({});

    const validBooks = books.filter((book) => book.pageCount);

    const formattedBooks = validBooks.map((book) => ({
      title: book.title,
      author: book.author.join(", "),
      genre: book.genres || [],
      description: book.description || "",
      coverImageUrl: book.coverImage?.url || "",
      pageCount: book.pageCount,
      publishedYear: book.releaseYear,
      averageRating: book.rating,
      ratingsCount: book.ratingsCount,
      language: "English",
    }));

    await Book.insertMany(formattedBooks);

    console.log("Books seeded successfully");
    process.exit();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Seeding failed:", error.message);
    } else {
      console.error("Seeding failed:", error);
    }
    process.exit(1);
  }
}

seedBooks();
