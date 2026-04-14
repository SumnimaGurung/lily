import { db } from "@/lib/db";

export async function GET() {
  try {
    const [[orders]]: any = await db.query(
      "SELECT COUNT(*) as totalOrders FROM orders"
    );

    const [[users]]: any = await db.query(
      "SELECT COUNT(*) as totalUsers FROM users"
    );

    const [[sales]]: any = await db.query(
      "SELECT SUM(total_amount) as totalSales FROM orders"
    );

    const [statusData]: any = await db.query(
      "SELECT order_status, COUNT(*) as count FROM orders GROUP BY order_status"
    );

    return Response.json({
      totalOrders: orders.totalOrders,
      totalUsers: users.totalUsers,
      totalSales: sales.totalSales || 0,
      statusData,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}