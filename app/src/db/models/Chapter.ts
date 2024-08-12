import { ObjectId } from "mongodb";
import { database } from "../config/mongodb";

interface summaryType {
    name: string;
    subsections: Array<string>;
}

class Chapter {
    static collection() {
        return database.collection("chapters");
    }
    static insertChapter(summary: summaryType, subjectId: string) {
        console.log(summary, subjectId);
        return this.collection().insertOne({
            name: summary.name,
            material: summary.subsections,
            subjectId: new ObjectId(String(subjectId)),
        });
    }
}

export default Chapter;
