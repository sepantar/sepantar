import Attendance from "@/db/models/Attendance";
import User from "@/db/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const userId = request.headers.get("x-id");
  const userRole = request.headers.get("x-role");

  if (userRole !== "teacher") {
    let data = await Attendance.getUserAttendance(userId as string);
    console.log(userId, "<<<<<");

    console.log(data);

    return NextResponse.json(data, {
      status: 200,
    });
  } else {
    let data = await Attendance.getTeacherAttendance(userId as string);
    console.log(data);
    let perClass = [];
    data.forEach((element) => {});

    return NextResponse.json(data, {
      status: 200,
    });
  }
}

export async function PATCH(request: Request) {
  // await Attendance.insertAttendance();
  return NextResponse.json(
    { message: "lmao" },
    {
      status: 200,
    }
  );
}
