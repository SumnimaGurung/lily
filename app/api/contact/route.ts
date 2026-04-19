import { NextResponse } from "next/server";
import {db} from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, orderNumber, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    await db.query(
      "INSERT INTO contact_messages (name, email, order_number, message) VALUES (?, ?, ?, ?)",
      [name, email, orderNumber || null, message]
    );

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}