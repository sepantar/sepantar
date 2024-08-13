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
    static async insertChapter(summary: summaryType, subjectId: string) {
        console.log(summary, subjectId, "<<<model");
        await this.collection().insertOne({
            name: summary.name,
            material: summary.subsections,
            subjectId: new ObjectId(String(subjectId)),
        });
        return "success add"
    }
    static async getChapterById(chapterId: string) {
        return this.collection().findOne({ _id: new ObjectId(chapterId) });
    }
}

export default Chapter;
