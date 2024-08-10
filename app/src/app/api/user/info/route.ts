import User from "@/db/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  //baru bisa untuk student, untuk teacher blm bener isi data nya
  const userId = request.headers.get("x-id");
  let userInfo = await User.getUserById(userId as string);
  let result;

  return NextResponse.json(
    {
      data: userInfo[0],
    },
    {
      status: 200,
    }
  );
}
