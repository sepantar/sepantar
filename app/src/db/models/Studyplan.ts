import { ObjectId } from "mongodb";
import { database } from "../config/mongodb";

export interface planType {
    _id?: string;
  chapterId: string;
  plan_contents: Array<Plan>;
  userId: string;
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
  static async createPlan(
    userId: string,
    subjectId: string,
    planOutput: planType
  ) {
    return await this.collection().insertOne({
      chapterId: new ObjectId(String(subjectId)),
      plan_contents: planOutput.plan_contents,
      userId: new ObjectId(String(userId)),
    });
  }
  static async getPlanByChapterId(chapterId: string, userId: string) {
    return await this.collection().findOne({
      chapterId: new ObjectId(chapterId),
      userId: new ObjectId(userId),
    });
  }
  static async deletePlanByChapterId(chapterId: string, userId: string) {
    return await this.collection().deleteOne({
      chapterId: new ObjectId(String(chapterId)),
      userId: new ObjectId(String(userId)),
    });
  }
  static async updatePlan(_id: string, data: planType){
    return await this.collection().updateOne({_id: new ObjectId(String(_id))}, {$set: {plan_contents: data.plan_contents}})
  }
}
export default Studyplan;
