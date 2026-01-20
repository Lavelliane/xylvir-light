import { Hono } from "hono";
import { handle } from "hono/vercel";
import type { AuthType } from "@/lib/auth";
import auth from "@/server/routes/auth/auth.route";

const app = new Hono<{ Variables: AuthType }>({ strict: false }).basePath("/api");

//Auth routes
app.route("/auth", auth);

export const GET = handle(app);
export const POST = handle(app);
