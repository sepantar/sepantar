import Subject from "@/db/models/Subject";
import User from "@/db/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  //baru bisa untuk student, untuk teacher blm bener isi data nya
  const userId = request.headers.get("x-id");
  const userRole = request.headers.get("x-role");
  console.log(userId, userRole, "<<<<<");
  let subjects;
  if (userRole === "student") {
    subjects = await Subject.getSubjectByStudentId(userId as string);
  } else {
    subjects = await Subject.getSubjectByTeacherId(userId as string);
  }

  return NextResponse.json(subjects, {
    status: 200,
  });
}
