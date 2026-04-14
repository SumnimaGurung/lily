import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const { order_id, payment_status } = await req.json();

    await db.query(
      `UPDATE orders SET payment_status = ? WHERE order_id = ?`,
      [payment_status, order_id]
    );

    return Response.json({ message: "Payment updated" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to update payment" },
      { status: 500 }
    );
  }
}