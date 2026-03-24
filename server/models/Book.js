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
            type: String,
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
            min : 1,
        },
        publishedYear: {
            type: Number,
        },
        language: {
            type: String,
            default: "English"
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review"
            },
        ],
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;