import { ObjectId } from "mongodb";
import { database } from "../config/mongodb";

export interface planType {
    chapterId: string;
    plan: Array<Plan>;
}

export interface Plan {
    judulTask: string;
    taskList: Array<string>;
    status: false;
}

class Studyplan {
    static collection() {
        return database.collection("studyplans");
    }
    static async createPlan(userId: string, subjectId: string, planOutput: planType) {
        return await this.collection().insertOne({
            chapterId: new ObjectId(String(subjectId)),
            plan_contents: planOutput.plan,
            userId: new ObjectId(String(userId)),
        });
    }
    static async getPlanByChapterId(chapterId: string, userId: string) {
        return await this.collection().find({ chapterId: new ObjectId(chapterId), userId : new ObjectId(userId) }).toArray();
    }
}
export default Studyplan;
