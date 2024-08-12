import User from "@/db/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  //baru bisa untuk student, untuk teacher blm bener isi data nya
  const userId = request.headers.get("x-id");
  const userRole = request.headers.get("x-role");
  console.log(userId, userRole, "<<<<<");
  let userInfo;
  if (userRole === "student") {
    userInfo = await User.getUserById(userId as string);
  } else {
    userInfo = await User.getTeacherById(userId as string);
  }

  return NextResponse.json(userInfo[0], {
    status: 200,
  });
}
