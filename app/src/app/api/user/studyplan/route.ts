import Studyplan, { Plan } from "@/db/models/Studyplan";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId") as string;
    const userId = request.headers.get("x-id") as string;
    let data = await Studyplan.getPlanByChapterId(chapterId, userId);
    if (!data) {
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId") as string;
    const userId = request.headers.get("x-id") as string;
    console.log(chapterId, userId);

    let data = await Studyplan.getPlanByChapterId(chapterId, userId);
    await Studyplan.deletePlanByChapterId(chapterId, userId);
    if (!data) {
      return NextResponse.json(
        { message: "You don't have a study plan yet." },
        { status: 404 }

      );
    }
    return NextResponse.json(
      { message: "Study plan deleted." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

export async function PUT(request: Request) {
  try {
    const body: {
      _id: string;
      chapterId: string;
      plan_contents: Array<Plan>;
      userId: string;
    } = await request.json();
    const userId = request.headers.get("x-id") as string;
    let data = await Studyplan.updatePlan(body._id, body);
    console.log(body, userId);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

}
