import Studyplan from "@/db/models/Studyplan";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const chapterId = searchParams.get("chapterId") as string;
        const userId = request.headers.get("x-id") as string;
        let data = await Studyplan.getPlanByChapterId(chapterId, userId);
        if (data.length === 0) {
            return NextResponse.json(
                { message: "You don't have a study plan yet." },
                { status: 404 }
            );
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
