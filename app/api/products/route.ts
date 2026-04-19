import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM product WHERE product_status = 'active' ORDER BY product_id DESC"
    );

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error loading products" },
      { status: 500 }
    );
  }
}