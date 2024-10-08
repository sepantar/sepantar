import Attendance from "@/db/models/Attendance";
import User from "@/db/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const userId = request.headers.get("x-id");
  let data = await Attendance.getUserAttendance(userId as string);
  console.log(userId, "<<<<<");

  console.log(data);

  return NextResponse.json(data, {
    status: 200,
  });
}
