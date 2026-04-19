import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(
      `SELECT * FROM product
       WHERE product_status = 'active'
       AND (display_label = 'new' OR display_label = 'restocked')
       ORDER BY product_id DESC`
    );

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error loading new products" },
      { status: 500 }
    );
  }
}