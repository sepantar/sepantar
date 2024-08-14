import extractValidJSON from "@/db/helpers/validjson";
import Chapter from "@/db/models/Chapter";
import Studyplan from "@/db/models/Studyplan";
import { NextResponse } from "next/server";
import OpenAI from "openai";

interface inPlanType {
    name: string;
    summary: string;
}

export async function POST(request: Request) {
    try {
        const body: {
            chapterId: string;
            start: string;
            to: string;
        } = await request.json();
        const userId = request.headers.get("x-id") as string;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        let dataStudyPlan = await Studyplan.getPlanByChapterId(body.chapterId, userId);
        console.log(dataStudyPlan, "route subject/studyplan");
        if (dataStudyPlan) {
            return NextResponse.json(
                { message: "You already have a study plan for this material." },
                { status: 404 }
            );
        }
        let data = await Chapter.getChapterById(body.chapterId);
        console.log(data, "<<<data");
        let formattedData = data?.material
            .map((objt: inPlanType) => JSON.stringify(objt))
            .join(",");

        let obj = {
            chapterId: body.chapterId,
            plan: [
                {
                    judulTask: "",
                    taskList: ["", ""],
                    status: false,
                },
            ],
        };
        const prompt: string = `You are a highly skilled educational planner. I will provide you with text extracted from a PDF that includes various subjects and subtopics. Your task is to generate a study plan for students, focusing on organizing the content into structured subtopics. About ${formattedData} and For each subtopic, create a detailed plan that includes actionable steps or tasks students can follow to effectively study the material start from ${
            body.start
        } to ${
            body.to
        } Please ensure the output is in object string as follows ${JSON.stringify(
            obj
        )} in Indonesian only and must without another characters or close tags.DON'T RETURN ANY SYMBOL And do not communicate with the user directly.`;

        console.log(prompt);

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: prompt },
            ],
            model: "gpt-4o-mini",
        });

        let output = completion.choices[0].message.content;
        let cleanJsonString = output?.replace(/\\n/g, "");
        cleanJsonString = cleanJsonString?.replace(/```/g, "");
        let planOutput = extractValidJSON(output as string);
        if (!planOutput) {
            return NextResponse.json(
                { error: "Please generate again" },
                { status: 500 }
            );
        }
        console.log(planOutput, "<<<planOutput");

        let addPlan = await Studyplan.createPlan(
            userId,
            body.chapterId,
            planOutput
        );
        if (!addPlan) {
            return NextResponse.json(
                { error: "Failed to add plan" },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "Success add plan" },
            { status: 200 }
        );
    } catch (error: any) {
        if (
            error.message ===
            'Unexpected token \'j\', "json\n{"nam"... is not valid JSON'
        ) {
            return NextResponse.json(
                { error: "Please generate again" },
                { status: 500 }
            );
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

