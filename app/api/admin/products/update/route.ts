import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const { product_id, name, price, image, displayLabel, productStatus } =
      await req.json();

    await db.query(
      `UPDATE product
       SET name = ?, price = ?, image = ?, display_label = ?, product_status = ?
       WHERE product_id = ?`,
      [name, price, image, displayLabel, productStatus, product_id]
    );

    return Response.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error updating product" },
      { status: 500 }
    );
  }
}