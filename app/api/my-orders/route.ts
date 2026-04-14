import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const [rows]: any = await db.query(
      `SELECT order_id, total_amount, order_status, payment_status, payment_method, created_at
       FROM orders
       WHERE email = ?
       ORDER BY order_id DESC`,
      [email]
    );

    return Response.json({ orders: rows });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to load purchases" },
      { status: 500 }
    );
  }
}