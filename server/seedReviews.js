import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Book from "./models/Book.js";
import User from "./models/User.js";
import Review from "./models/Review.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

async function seedReviews() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    let demoUser = await User.findOne({ email: "demo@bookspace.com" });

    if (!demoUser) {
      demoUser = await User.create({
        fullName: "Demo Reader",
        email: "demo@bookspace.com",
        passwordHash: "demo-hash",
      });
    }

    const books = await Book.find().limit(4);

    if (books.length === 0) {
      console.log("No books found. Seed books first.");
      process.exit(0);
    }

    await Review.deleteMany({});
    await Book.updateMany({}, { $set: { reviews: [] } });

    const sampleReviews = [
      {
        book: books[0]?._id,
        user: demoUser._id,
        rating: 5,
        body: "Really strong world-building and a story that kept me hooked from start to finish.",
      },
      {
        book: books[1]?._id,
        user: demoUser._id,
        rating: 4,
        body: "A moving and memorable read with characters that felt very human and believable.",
      },
      {
        book: books[2]?._id,
        user: demoUser._id,
        rating: 5,
        body: "Loved the atmosphere and pacing. It feels ambitious without becoming confusing.",
      },
    ].filter((review) => review.book);

    const createdReviews = await Review.insertMany(sampleReviews);

    for (const review of createdReviews) {
      await Book.findByIdAndUpdate(review.book, {
        $push: { reviews: review._id },
      });
    }

    console.log("Reviews seeded successfully");
    process.exit();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Seeding reviews failed:", error.message);
    } else {
      console.error("Seeding reviews failed:", error);
    }
    process.exit(1);
  }
}

seedReviews();
