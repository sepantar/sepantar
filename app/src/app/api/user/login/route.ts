import { comparePassword } from "@/db/helpers/bcrypt";
import { signToken } from "@/db/helpers/jwt";
import User from "@/db/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body: { email: string; password: string } = await request.json();
  if (!body.email || !body.password) {
    return NextResponse.json(
      {
        message: "Email is required",
      },
      {
        status: 400,
      }
    );
  }
  let findUser = await User.getUserByEmail(body.email);
  if (!findUser) {
    return NextResponse.json(
      {
        message: "Invalid Email / Password",
      },
      {
        status: 400,
      }
    );
  }
  let compare = comparePassword(body.password, findUser.password);
  if (!compare) {
    return NextResponse.json(
      {
        message: "Invalid Email / Password",
      },
      {
        status: 400,
      }
    );
  }
  let access_token = signToken({
    _id: findUser._id.toString(),
    role: findUser.role,
    email: findUser.email,
    username: findUser.username,
  });
  cookies().set("Authorization", `Bearer ${access_token}`);
  return NextResponse.json({ access_token: access_token, role: findUser.role });
}
