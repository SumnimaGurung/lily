import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(
      `SELECT order_id, customer_name, email, total_amount, payment_method, payment_status, created_at
       FROM orders
       ORDER BY order_id DESC`
    );

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to load payments" },
      { status: 500 }
    );
  }
}