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

export async function PUT(request: Request) {
  try {
    const body: { password: string; phoneNumber: string } =
      await request.json();
    if (!body.password || !body.phoneNumber) {
      return NextResponse.json(
        {
          message: "password/phoneNumber is required",
        },
        {
          status: 400,
        }
      );
    }
    const userId = request.headers.get("x-id") as string;
    let data = await User.updateUserInfo(
      body.password,
      body.phoneNumber,
      userId
    );
    return NextResponse.json({message: "success update info"}, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
