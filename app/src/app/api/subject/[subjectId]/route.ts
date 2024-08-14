import Subject from "@/db/models/Subject";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { subjectId: string } }
) {
  try {
    console.log(params.subjectId);
    let data = await Subject.getDetailSubject(params.subjectId);
    return NextResponse.json(data[0], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
