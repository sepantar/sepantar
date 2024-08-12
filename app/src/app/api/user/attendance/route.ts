import User from "@/db/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const userId = request.headers.get("x-id");
  let data = await User.getUserAttendance(userId as string);
  return NextResponse.json(
    {
      data: data[0],
    },
    {
      status: 200,
    }
  );
}
