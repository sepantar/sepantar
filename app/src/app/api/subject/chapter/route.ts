import { NextResponse } from "next/server";
import { Client } from "@octoai/client";
import pdf from "pdf-parse";
import Chapter from "@/db/models/Chapter";

interface summaryType{
    name : string;
    subsections : Array<string>
}
// Konfigurasi API route
export async function POST(request: Request) {
    try {
        let dataForm = await request.formData();
        const subjectId = dataForm.get("subjectId") as string;
        const file = dataForm.get("file") as File;
        console.log(subjectId, file);
        const buffer = await file.arrayBuffer();
        const pdfBuffer = Buffer.from(buffer);
        const pdfData = await pdf(pdfBuffer);
        const pdfText = pdfData.text;
        const client = new Client(process.env.OCTOAI_API_KEY);
        const chunkSize = 500 * 4;
        const chunks: string[] = [];
        let contentS = "You are a tool that Summarizes PDF. This tool is an application script that takes the content of a PDF and generates a detailed summary for each subsection, breaking down the main points. Output the summary only in JSON string format with the structure: {name : '', subsections: [{name: '', summary: ''}, {name: '', summary: ''}]}. Return the JSON string in Indonesian only, with a minimum of 5 sentences per summary data. You can only give json string as result, no kind of sentence or additional output. And do not communicate with the user directly."
        for (let i = 0; i < pdfText.length; i += chunkSize) {
            chunks.push(pdfText.slice(i, i + chunkSize));
        }
        console.log(
            `${chunks.length} chunks created with ${pdfText.length} characters.`
        );
        const summaries: string[] = [];
        for (const chunk of chunks) {
            const completion = await client.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: contentS,
                           
                    },
                    {
                        role: "assistant",
                        content: `PDF content:\n${chunk}`,
                    },
                ],
                model: "mixtral-8x7b-instruct",
                max_tokens: 3145,
                presence_penalty: 0,
                temperature: 0,
                top_p: 1,
            });
            summaries.push(completion.choices[0].message.content as string);
        }
        let summary = summaries.join("\n\n");
        if (summary.length > 500) {
            const additionalSummary = await client.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content:contentS,
                    },
                    {
                        role: "user",
                        content: `PDF content:\n${summary}`,
                    },
                ],
                model: "mixtral-8x7b-instruct",
                max_tokens: 3145,
                presence_penalty: 0,
                temperature: 0,
                top_p: 1,
            });

            if (additionalSummary.choices[0].message.content) {
                summary = additionalSummary.choices[0].message.content;
            }
        }
        console.log( summary);
        const cleanJsonString = summary.replace(/\\n/g, "");
        let summaryObj: summaryType = JSON.parse(cleanJsonString);
        console.log( summaryObj);
        let add = await Chapter.insertChapter(summaryObj, subjectId);
        if(!add){
            return NextResponse.json(
                { message: "Failed to save summary." },
                { status: 500 }
            );
        }
        return NextResponse.json({message: "Success add file"}, { status: 200 });
    } catch (error: any) {
        console.error("Error processing PDF:", error);
        return NextResponse.json(
            { message: "Failed to analyze PDF." },
            { status: 500 }
        );
    }
}
