import { database } from "../config/mongodb";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Int32, ObjectId } from "mongodb";

class Schedule {
  static collection() {
    return database.collection("schedules");
  }
  static async getScheduleByTeacherId(id: string, current: string) {
    dayjs.locale("id");
    let day = dayjs().format("dddd");
    let time = dayjs().format("HH");
    console.log(day, time, "<<<<<");
    let agg;
    if (current == "true") {
      agg = [
        {
          $match: {
            teacherId: new ObjectId(String(id)),
          },
        },
        {
          $lookup: {
            from: "subjects",
            localField: "subjectId",
            foreignField: "_id",
            as: "subject",
          },
        },
        {
          $unwind: {
            path: "$subject",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            day: day.toUpperCase(),
          },
        },
        {
          $match: {
            startTime: {
              $lte: new Int32(time),
            },
            endTime: {
              $gte: new Int32(time),
            },
          },
        },
      ];
    } else {
      agg = [
        {
          $match: {
            teacherId: new ObjectId(String(id)),
          },
        },
        {
          $lookup: {
            from: "subjects",
            localField: "subjectId",
            foreignField: "_id",
            as: "subject",
          },
        },
        {
          $unwind: {
            path: "$subject",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            day: day.toUpperCase(),
          },
        },
      ];
    }

    return await database.collection("schedules").aggregate(agg).toArray();
  }
  static async getScheduleByStudentId(id: string, current: string) {
    dayjs.locale("id");
    let day = dayjs().format("dddd");
    let time = dayjs().format("HH");
    let agg;
    let userData = await database.collection("users").findOne({
      _id: new ObjectId(String(id)),
    });
    agg = [
      {
        $match: {
          classId: new ObjectId(String(userData?.classId)),
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $unwind: {
          path: "$subject",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          day: day.toUpperCase(),
        },
      },
    ];
    return await database.collection("schedules").aggregate(agg).toArray();
  }
}

export default Schedule;
