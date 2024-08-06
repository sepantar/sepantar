import User from "@/db/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body: { name: string, username: string, email: string, password: string, role : string, phoneNumber : string } = await request.json()
        let findUser = await User.getUserByEmail(body.email)
        if (findUser) {
            return NextResponse.json(
                {
                    message: "Email must be unique"
                },
                {
                    status: 400
                }
            )
        }
        await User.createUser({ name : body.name, username : body.username, email : body.email, password : body.password,  role : body.role, phoneNumber : body.phoneNumber})
        return NextResponse.json(
            {
                message: "register success"
            },
            {
                status: 201
            }
        )
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            {
                message: "err"
            },
            {
                status: 500
            }
        )
        
    }
}