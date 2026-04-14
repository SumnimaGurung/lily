import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const likeSearch = `%${search}%`;

    const [rows]: any = await db.query(
      `SELECT user_id, full_name, email, phone, role, created_at
       FROM users
       WHERE full_name LIKE ?
          OR email LIKE ?
          OR phone LIKE ?
       ORDER BY user_id DESC`,
      [likeSearch, likeSearch, likeSearch]
    );

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to load customers" },
      { status: 500 }
    );
  }
}