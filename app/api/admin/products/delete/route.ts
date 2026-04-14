import { db } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();

    await db.query(
      "DELETE FROM products WHERE product_id = ?",
      [productId]
    );

    return Response.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error deleting product" }, { status: 500 });
  }
}