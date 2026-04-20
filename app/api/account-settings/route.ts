import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json({ message: "Email is required" }, { status: 400 });
    }

    const [users]: any = await db.query(
      "SELECT user_id, full_name, email, phone FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (users.length === 0) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const user = users[0];

    const [settingsRows]: any = await db.query(
      "SELECT * FROM account_settings WHERE user_id = ? LIMIT 1",
      [user.user_id]
    );

    const settings = settingsRows[0] || {};

    return Response.json({
      settings: {
        fullName: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        addressLine1: settings.address_line1 || "",
        addressLine2: settings.address_line2 || "",
        city: settings.city || "",
        postalCode: settings.postal_code || "",
        country: settings.country || "Nepal",
        paymentType: settings.payment_type || "eSewa",
        paymentName: settings.payment_name || "",
        paymentNumber: settings.payment_number || "",
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to load account settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
      currentPassword,
      newPassword,
      paymentType,
      paymentName,
      paymentNumber,
    } = body;

    if (!email) {
      return Response.json({ message: "Email is required" }, { status: 400 });
    }

    const [users]: any = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (users.length === 0) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const user = users[0];

    await db.query(
      "UPDATE users SET full_name = ?, phone = ? WHERE user_id = ?",
      [fullName, phone, user.user_id]
    );

    const [existingSettings]: any = await db.query(
      "SELECT setting_id FROM account_settings WHERE user_id = ? LIMIT 1",
      [user.user_id]
    );

    if (existingSettings.length > 0) {
      await db.query(
        `UPDATE account_settings 
         SET address_line1 = ?, address_line2 = ?, city = ?, postal_code = ?, country = ?, payment_type = ?, payment_name = ?, payment_number = ?
         WHERE user_id = ?`,
        [
          addressLine1,
          addressLine2,
          city,
          postalCode,
          country,
          paymentType,
          paymentName,
          paymentNumber,
          user.user_id,
        ]
      );
    } else {
      await db.query(
        `INSERT INTO account_settings 
        (user_id, address_line1, address_line2, city, postal_code, country, payment_type, payment_name, payment_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.user_id,
          addressLine1,
          addressLine2,
          city,
          postalCode,
          country,
          paymentType,
          paymentName,
          paymentNumber,
        ]
      );
    }

    if (newPassword && newPassword.trim() !== "") {
      if (!currentPassword || currentPassword.trim() === "") {
        return Response.json(
          { message: "Current password is required to change password" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return Response.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.query("UPDATE users SET password = ? WHERE user_id = ?", [
        hashedPassword,
        user.user_id,
      ]);
    }

    return Response.json({ message: "Account settings saved successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to save account settings" },
      { status: 500 }
    );
  }
}