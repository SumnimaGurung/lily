import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM product ORDER BY product_id DESC"
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

export async function POST(req: Request) {
  try {
    const { name, price, image, displayLabel, productStatus } = await req.json();

    await db.query(
      "INSERT INTO product (name, price, image, display_label, product_status) VALUES (?, ?, ?, ?, ?)",
      [name, price, image, displayLabel, productStatus]
    );

    return Response.json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error adding product" },
      { status: 500 }
    );
  }
}