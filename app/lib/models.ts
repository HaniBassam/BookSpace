import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: [String],
      default: [],
    },
    description: {
      type: [String],
      default: [],
    },
    coverImageUrl: {
      type: String,
      default: "",
    },
    pageCount: {
      type: Number,
      required: true,
      min: 1,
    },
    publishedYear: {
      type: Number,
    },
    language: {
      type: String,
      default: "English",
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    savedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    readingStats: {
      totalBooks: {
        type: Number,
        default: 0,
      },
      totalPages: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Book =
  mongoose.models.Book ?? mongoose.model("Book", bookSchema);
export const User =
  mongoose.models.User ?? mongoose.model("User", userSchema);
export const Review =
  mongoose.models.Review ?? mongoose.model("Review", reviewSchema);
