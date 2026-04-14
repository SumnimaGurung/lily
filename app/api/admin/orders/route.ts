import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const likeSearch = `%${search}%`;

    const [rows]: any = await db.query(
      `SELECT 
        order_id,
        customer_name,
        email,
        total_amount,
        order_status,
        payment_status,
        payment_method,
        created_at
       FROM orders
       WHERE customer_name LIKE ?
          OR email LIKE ?
          OR order_id LIKE ?
       ORDER BY order_id DESC`,
      [likeSearch, likeSearch, likeSearch]
    );

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error loading purchases" }, { status: 500 });
  }
}