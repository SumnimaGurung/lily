import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get("data");

    if (!data) {
      return NextResponse.redirect(`${baseUrl}/checkout?payment=invalid`);
    }

    const decoded = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );

    const transaction_uuid = decoded.transaction_uuid;
    const total_amount = decoded.total_amount;
    const product_code = decoded.product_code;
    const status = decoded.status;
    const transaction_code = decoded.transaction_code || null;

    console.log("decoded eSewa data:", decoded);

    if (!transaction_uuid || !total_amount || !product_code) {
      return NextResponse.redirect(`${baseUrl}/checkout?payment=invalid`);
    }

    if (status !== "COMPLETE") {
      return NextResponse.redirect(`${baseUrl}/checkout?payment=failed`);
    }

    const statusCheckBase =
      process.env.ESEWA_STATUS_CHECK_URL ||
      "https://rc.esewa.com.np/api/epay/transaction/status/";

    const statusCheckUrl =
      `${statusCheckBase}?product_code=${encodeURIComponent(product_code)}` +
      `&total_amount=${encodeURIComponent(total_amount)}` +
      `&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;

    console.log("statusCheckUrl:", statusCheckUrl);

    const verifyRes = await fetch(statusCheckUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!verifyRes.ok) {
      return NextResponse.redirect(`${baseUrl}/checkout?payment=verify_failed`);
    }

    const verifyData = await verifyRes.json();
    console.log("verifyData:", verifyData);

    if (verifyData.status !== "COMPLETE") {
      return NextResponse.redirect(`${baseUrl}/checkout?payment=verify_failed`);
    }

    await db.query(
      `
      UPDATE orders
      SET payment_status = ?, order_status = ?, transaction_code = ?
      WHERE transaction_uuid = ?
      `,
      [
        "paid",
        "confirmed",
        transaction_code || verifyData.ref_id || verifyData.transaction_code || null,
        transaction_uuid,
      ]
    );

    return NextResponse.redirect(`${baseUrl}/payment-success?method=esewa`);
  } catch (error) {
    console.error("eSewa success error:", error);
    return NextResponse.redirect(`${baseUrl}/checkout?payment=error`);
  }
}