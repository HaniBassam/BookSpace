import bcrypt from "bcryptjs";
import type { Route } from "./+types/api.$";
import { connectToDatabase } from "../lib/db";
import { Book, Review, User } from "../lib/models";

function parseCookies(cookieHeader: string | null) {
  return Object.fromEntries(
    (cookieHeader || "")
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const index = cookie.indexOf("=");
        const key = index >= 0 ? cookie.slice(0, index) : cookie;
        const value = index >= 0 ? cookie.slice(index + 1) : "";

        return [key, decodeURIComponent(value)];
      })
  );
}

function getUserCookie(request: Request) {
  return parseCookies(request.headers.get("cookie"))["userId"] || "";
}

function cookieOptions(value: string, maxAge?: number) {
  const parts = [
    `userId=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (typeof maxAge === "number") {
    parts.push(`Max-Age=${maxAge}`);
  }

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

async function getAuthenticatedUser(request: Request) {
  const userId = getUserCookie(request);

  if (!userId) {
    return null;
  }

  return User.findById(userId);
}

async function handleSignup(request: Request) {
  const { fullName, email, password } = (await request.json()) as {
    fullName?: string;
    email?: string;
    password?: string;
  };

  if (!fullName || !email || !password) {
    return json({ message: "Missing required fields" }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return json({ message: "User already exists" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
  });

  return json(
    {
      message: "User created successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    },
    { status: 201 }
  );
}

async function handleLogin(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return json({ message: "Missing required fields" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return json({ message: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return json({ message: "Invalid credentials" }, { status: 400 });
  }

  return json(
    {
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": cookieOptions(user._id.toString()),
      },
    }
  );
}

async function handleLogout() {
  return json(
    { message: "Logged out successfully" },
    {
      status: 200,
      headers: {
        "Set-Cookie": cookieOptions("", 0),
      },
    }
  );
}

async function handleMe(request: Request) {
  const userId = getUserCookie(request);

  if (!userId) {
    return json({ message: "Not authenticated" }, { status: 401 });
  }

  const user = await User.findById(userId);

  if (!user) {
    return json({ message: "User not found" }, { status: 404 });
  }

  return json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    savedBooks: user.savedBooks,
  });
}

async function handleBooks(request: Request, segments: string[]) {
  if (segments.length === 1) {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const genre = url.searchParams.get("genre") || "";

    let query: any = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
          { genre: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (genre) {
      query.genre = { $regex: genre, $options: "i" };
    }

    const books = await Book.find(query);
    return json(books);
  }

  const bookId = segments[1];
  const detailSegment = segments[2];

  if (!bookId) {
    return json({ message: "Book not found" }, { status: 404 });
  }

  if (!detailSegment) {
    const book = await Book.findById(bookId);

    if (!book) {
      return json({ message: "Book not found" }, { status: 404 });
    }

    return json(book);
  }

  if (detailSegment === "reviews") {
    if (request.method === "GET") {
      const reviews = await Review.find({ book: bookId });
      return json(reviews);
    }

    if (request.method === "POST") {
      const user = await getAuthenticatedUser(request);

      if (!user) {
        return json({ message: "Not authenticated" }, { status: 401 });
      }

      const { rating, body } = (await request.json()) as {
        rating?: string | number;
        body?: string;
      };

      const normalizedRating = Number(rating);

      if (!normalizedRating || !body) {
        return json({ message: "Missing required fields" }, { status: 400 });
      }

      const review = await Review.create({
        book: bookId,
        user: user._id,
        rating: normalizedRating,
        body,
      });

      await Book.findByIdAndUpdate(bookId, {
        $push: { reviews: review._id },
      });

      return json(review, { status: 201 });
    }
  }

  if (detailSegment === "save" && request.method === "POST") {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return json({ message: "Not authenticated" }, { status: 401 });
    }

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { savedBooks: bookId },
    });

    return json({ message: "Book saved successfully" });
  }

  return json({ message: "Not found" }, { status: 404 });
}

async function handleRequest(request: Request, params: Route.LoaderArgs["params"]) {
  await connectToDatabase();

  const segments = (params["*"] || "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    if (request.method === "GET") {
      return json({ message: "API is running..." });
    }

    return json({ message: "Method not allowed" }, { status: 405 });
  }

  const [firstSegment, secondSegment] = segments;

  if (firstSegment === "signup" && request.method === "POST") {
    return handleSignup(request);
  }

  if (firstSegment === "login" && request.method === "POST") {
    return handleLogin(request);
  }

  if (firstSegment === "logout" && request.method === "POST") {
    return handleLogout();
  }

  if (firstSegment === "me" && request.method === "GET") {
    return handleMe(request);
  }

  if (firstSegment === "books") {
    return handleBooks(request, segments);
  }

  if (firstSegment === "reviews" && request.method === "GET") {
    const reviews = await Review.find({});
    return json(reviews);
  }

  if (firstSegment === "users" && request.method === "GET" && secondSegment) {
    const user = await User.findById(secondSegment);

    if (!user) {
      return json({ message: "User not found" }, { status: 404 });
    }

    return json(user);
  }

  return json({ message: "Not found" }, { status: 404 });
}

export async function loader({ request, params }: Route.LoaderArgs) {
  return handleRequest(request, params);
}

export async function action({ request, params }: Route.ActionArgs) {
  return handleRequest(request, params);
}
