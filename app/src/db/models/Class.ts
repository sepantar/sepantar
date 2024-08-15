import { ObjectId } from "mongodb";
import { database } from "../config/mongodb";

class Class {
  static collection() {
    return database.collection("classes");
  }
  static async getClassStudents(classId: string) {
    let students = await database
      .collection("users")
      .find({ classId: new ObjectId(String(classId)), role: "student" })
      .toArray();
    return students;
  }
}
export default Class;
