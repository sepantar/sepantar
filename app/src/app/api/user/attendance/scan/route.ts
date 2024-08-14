import Attendance from "@/db/models/Attendance";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const body: { scheduleId: string; userId: string } = await request.json();

  let result = await Attendance.scannedAttendance(body.userId, body.scheduleId);
  return NextResponse.json(
    { message: result },
    {
      status: 200,
    }
  );
}
