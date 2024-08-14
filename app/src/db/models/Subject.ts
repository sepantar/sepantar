import { ObjectId } from "mongodb";
import { database } from "../config/mongodb";

class Subject {
    static collection() {
        return database.collection("subjects");
    }
    static async getDetailSubject(subjectId: string) {
        const agg = [
            {
                $match: {
                    _id: new ObjectId(subjectId),
                },
            },
            {
                $lookup: {
                    as: "chapters",
                    from: "chapters",
                    foreignField: "subjectId",
                    localField: "_id",
                },
            },
            {
                $unset: ["chapters._id", "chapters.subjectId"],
            },
        ];
        return await this.collection().aggregate(agg).toArray();
    }
}
export default Subject;
