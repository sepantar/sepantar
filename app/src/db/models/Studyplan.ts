import { ObjectId } from "mongodb";
import { database } from "../config/mongodb";

export interface planType {
    name: string;
    plan: Array<Plan>;
}

export interface Plan {
    task: string;
    subtasks: string[];
    status: false;
}

class Studyplan {
    static collection() {
        return database.collection("studyplans");
    }
    static createPlan(userId: string, subjectId: string, planOutput: planType) {
        return this.collection().insertOne({
            subjectId: new ObjectId(String(subjectId)),
            plan_contents: planOutput.plan,
            userId: new ObjectId(String(userId)),
        });
    }
}
export default Studyplan;
