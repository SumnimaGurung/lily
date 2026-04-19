import { db } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();

    await db.query(
      "DELETE FROM product WHERE product_id = ?",
      [productId]
    );

    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return Response.json(
      { message: "Error deleting product" },
      { status: 500 }
    );
  }
}