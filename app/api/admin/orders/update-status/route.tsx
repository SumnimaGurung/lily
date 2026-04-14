import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const { orderId, orderStatus } = await req.json();

    await db.query(
      "UPDATE orders SET order_status = ? WHERE order_id = ?",
      [orderStatus, orderId]
    );

    return Response.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to update order status" },
      { status: 500 }
    );
  }
}