import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      address,
      city,
      postalCode,
      phone,
      total,
      paymentMethod,
      cartItems,
    } = await req.json();

    const paymentStatus = paymentMethod === "COD" ? "unpaid" : "pending";

    const [orderResult]: any = await db.query(
      `INSERT INTO orders 
      (user_id, address_id, total_amount, order_status, payment_status, customer_name, email, address, city, postal_code, phone, payment_method) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        null,
        null,
        total,
        "pending",
        paymentStatus,
        name,
        email,
        address,
        city,
        postalCode,
        phone,
        paymentMethod,
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await db.query(
        `INSERT INTO order_item (order_id, variant_id, product_name, quantity, price) 
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, null, item.name, item.quantity, item.price]
      );
    }

    return Response.json({ message: "Order saved successfully" });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return Response.json(
      { message: "Error saving order" },
      { status: 500 }
    );
  }
}