import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashed, phone, "customer"]
    );

    return Response.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}