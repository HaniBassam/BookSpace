import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
    index("routes/home.tsx"),
    route("books/:id", "routes/books.$id.tsx"),
    route("login", "routes/login.tsx"),
    route("profile", "routes/profile.tsx"),
] satisfies RouteConfig;
