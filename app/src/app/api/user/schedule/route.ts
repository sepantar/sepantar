import Schedule from "@/db/models/Schedule";
import User from "@/db/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  //baru bisa untuk student, untuk teacher blm bener isi data nya
  const { searchParams } = new URL(request.url);
  const current = searchParams.get("current");
  const userId = request.headers.get("x-id");
  const userRole = request.headers.get("x-role");
  console.log(current, "<<<<<");

  console.log(userId, userRole, "<<<<<");
  let schedule;
  if (userRole === "student") {
    schedule = await Schedule.getScheduleByStudentId(
      userId as string,
      current as string
    );
  } else {
    schedule = await Schedule.getScheduleByTeacherId(
      userId as string,
      current as string
    );
  }

  return NextResponse.json(schedule, {
    status: 200,
  });
}
