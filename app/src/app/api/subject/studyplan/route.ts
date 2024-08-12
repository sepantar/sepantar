import Studyplan from "@/db/models/Studyplan";
import { TextServiceClient } from "@google-ai/generativelanguage"; 
import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body : {subjectId : string, chapterName : string, start : number, to : number} = await request.json()
        const userId = request.headers.get("x-id") as string;
        const API_KEY = process.env.GEMINI_API_KEY as string;
        const MODEL_NAME = "models/text-bison-001";
        const client = new TextServiceClient({
            authClient: new GoogleAuth().fromAPIKey(API_KEY),
        });
        let obj = {name : "", "plan" : [{"task" : "", "subtasks" : "", "status" : false},{"task" : "", "subtasks" : "", "status" : false}]}
        const prompt: string =
            `You are a highly skilled educational planner. I will provide you with text extracted from a PDF that includes various subjects and subtopics. Your task is to generate a study plan for students, focusing on organizing the content into structured subtopics. About ${body.chapterName} and For each subtopic, create a detailed plan that includes actionable steps or tasks students can follow to effectively study the material start from ${body.start} pm to ${body.to} pm. Please ensure the output is in object string as follows ${JSON.stringify(obj)} and must without another characters or close tags. And do not communicate with the user directly.`;
        let response = await client.generateText({
            model: MODEL_NAME,
            prompt: {
                text: prompt,
            },
        });
        if (!response) {
            return NextResponse.json(
                { error: "No response from the model" },
                { status: 500 }
            );
        }
        const output = response[0]?.candidates?.[0]?.output;
        if (!output) {
            return NextResponse.json(
                { error: "No output in the response" },
                { status: 500 }
            );
        }
        let cleanJsonString = output.replace(/\\n/g, "");
        cleanJsonString = cleanJsonString.replace(/```/g, "");
        let planOutput = JSON.parse(cleanJsonString);
        let addPlan = await Studyplan.createPlan(userId, body.subjectId, planOutput);
        if(!addPlan){
            return NextResponse.json(
                { error: "Failed to add plan" },
                { status: 500 }
            );
        }
        return NextResponse.json(planOutput);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
