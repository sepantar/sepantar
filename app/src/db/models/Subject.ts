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
        $unset: ["chapters.subjectId"],
      },
    ];
    return await this.collection().aggregate(agg).toArray();
  }
  static async getSubjectByTeacherId(teacherId: string) {
    const agg = [
      {
        $lookup: {
          as: "schedules",
          from: "schedules",
          foreignField: "subjectId",
          localField: "_id",
        },
      },
      {
        $lookup: {
          as: "teacher",
          from: "users",
          foreignField: "_id",
          localField: "schedules.teacherId",
        },
      },
      {
        $unwind: "$teacher",
      },
      {
        $match: {
          "schedules.teacherId": new ObjectId(String(teacherId)),
        },
      },
      {
        $unset: ["schedules", "teacher.password", "teacher.classId"],
      },
      {
        $sort: {
          level: 1,
        },
      },
    ];
    return await this.collection().aggregate(agg).toArray();
  }
  static async getSubjectByStudentId(studentId: string) {
    const aggUser = [
      {
        $match: {
          _id: new ObjectId(String(studentId)),
        },
      },
      {
        $lookup: {
          as: "class",
          from: "classes",
          foreignField: "_id",
          localField: "classId",
        },
      },
      {
        $unwind: {
          path: "$class",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          class: 1,
        },
      },
    ];
    let user = await database.collection("users").aggregate(aggUser).toArray();
    const agg = [
      {
        $lookup: {
          as: "schedules",
          from: "schedules",
          foreignField: "subjectId",
          localField: "_id",
        },
      },
      {
        $lookup: {
          as: "teacher",
          from: "users",
          foreignField: "_id",
          localField: "schedules.teacherId",
        },
      },
      {
        $unwind: "$teacher",
      },
      {
        $match: {
          level: user[0].class.level,
        },
      },
      {
        $unset: ["schedules", "teacher.password", "teacher.classId"],
      },
      {
        $sort: {
          level: 1,
        },
      },
    ];
    return await this.collection().aggregate(agg).toArray();
  }
}
export default Subject;
