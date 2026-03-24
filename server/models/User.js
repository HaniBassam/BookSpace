import mongoose from "mongoose";

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
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
