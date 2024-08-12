import { database } from "../config/mongodb";

export interface planType {
    name : string;
    plan : Array<Plan>
}

export interface Plan {
    task: string;
    subtasks: string[];
    status : false
}

class Studyplan {
    static collection() {
        return database.collection("studyplans");
    }
    static createPlan(userId: string, subjectId: string, planOutput: planType) {
        return this.collection().insertOne({
            subjectId: subjectId,
            plan_contents: planOutput.plan,
            userId: userId,
        });
    }
}
export default Studyplan;
