import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, address, city, postalCode, phone, total, cartItems } = body;

    if (
      !name ||
      !email ||
      !address ||
      !city ||
      !postalCode ||
      !phone ||
      !total ||
      !cartItems ||
      cartItems.length === 0
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const amount = Number(total);
    const tax_amount = 0;
    const product_service_charge = 0;
    const product_delivery_charge = 0;
    const total_amount =
      amount + tax_amount + product_service_charge + product_delivery_charge;

    const transaction_uuid = `ORDER-${Date.now()}`;

    const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
    const secret = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const signature = crypto
      .createHmac("sha256", secret)
      .update(message)
      .digest("base64");

    // IMPORTANT: match your real checkout table/column names
    const [result]: any = await db.query(
      `INSERT INTO orders 
      (user_id, address_id, total_amount, order_status, payment_status, customer_name, email, address, city, postal_code, phone, payment_method, transaction_uuid) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        null,
        null,
        total_amount,
        "pending",
        "pending",
        name,
        email,
        address,
        city,
        postalCode,
        phone,
        "eSewa",
        transaction_uuid,
      ]
    );

    const orderId = result.insertId;

    // IMPORTANT: your real table is order_item, not order_items
    for (const item of cartItems) {
      await db.query(
        `INSERT INTO order_item (order_id, variant_id, product_name, quantity, price) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          null,
          item.name,
          Number(item.quantity),
          Number(item.price),
        ]
      );
    }

    const payment_url =
      process.env.ESEWA_PAYMENT_URL ||
      "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    return NextResponse.json({
      payment_url,
      formData: {
        amount: String(amount),
        tax_amount: String(tax_amount),
        total_amount: String(total_amount),
        transaction_uuid,
        product_code,
        product_service_charge: String(product_service_charge),
        product_delivery_charge: String(product_delivery_charge),
        success_url: `${baseUrl}/api/esewa/success`,
        failure_url: `${baseUrl}/checkout?payment=failed`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (error) {
    console.error("eSewa initiate error:", error);
    return NextResponse.json(
      { message: "Failed to initiate eSewa payment" },
      { status: 500 }
    );
  }
}