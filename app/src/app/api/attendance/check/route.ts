import Attendance from "@/db/models/Attendance";
import Schedule from "@/db/models/Schedule";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const userId = request.headers.get("x-id");
  let schedule = await Schedule.getScheduleByTeacherId(
    userId as string,
    "true"
  );
  if (schedule.length < 1) {
    return NextResponse.json(
      { message: "No active schedule at this time" },
      {
        status: 404,
      }
    );
  }
  //   console.log(schedule[0]);

  let attendance: any | [] = await Attendance.findAttendance(
    schedule[0]._id as string,
    schedule[0].classId as string
  );
  if (attendance !== "ready") {
    await Attendance.generateAttendance(schedule[0]._id as string, attendance);
  }

  //   console.log(userId, "<<<<<");

  return NextResponse.json(schedule[0], {
    status: 200,
  });
}
