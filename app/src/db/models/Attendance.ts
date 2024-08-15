import { ObjectId } from "mongodb";
import { database } from "../config/mongodb";
import dayjs from "dayjs";
import Class from "./Class";

class Attendance {
  static collection() {
    return database.collection("attendance_records");
  }

  static async findAttendance(scheduleId: string, classId: string) {
    console.log(scheduleId, classId, "<<<<<");

    let check = await this.collection().findOne({
      scheduleId: new ObjectId(String(scheduleId)),
      date: dayjs().format("DD-MM-YYYY"),
    });
    if (!check) {
      let students = await Class.getClassStudents(classId);
      return students;
    } else {
      return "ready";
    }
  }

  static async generateAttendance(scheduleId: string, students: []) {
    console.log("Generate attendance");

    let data = students.map((student: { _id: string }) => {
      return {
        scheduleId: new ObjectId(String(scheduleId)),
        date: dayjs().format("DD-MM-YYYY"),
        userId: new ObjectId(String(student._id)),
        status: "Alpha",
      };
    });
    await this.collection().insertMany(data);
    return "success";
  }

  static async scannedAttendance(userId: string, scheduleId: string) {
    let student = await database.collection("users").findOne({
      _id: new ObjectId(String(userId)),
    });
    let check = await this.collection().findOne({
      scheduleId: new ObjectId(String(scheduleId)),
      date: dayjs().format("DD-MM-YYYY"),
      userId: new ObjectId(String(userId)),
    });
    if (check?.status == "Hadir") {
      return `${student?.name} already scanned`;
    }
    await this.collection().updateOne(
      {
        scheduleId: new ObjectId(String(scheduleId)),
        date: dayjs().format("DD-MM-YYYY"),
        userId: new ObjectId(String(userId)),
      },
      {
        $set: {
          status: "Hadir",
        },
      }
    );
    return `${student?.name} attendance recorded`;
  }
  static async insertAttendance(userId: string) {
    await this.collection().insertOne({
      scheduleId: new ObjectId("5f9d2b6c3f1d7e001f6d0c7d"),
      date: dayjs().format("DD-MM-YYYY"),
      userId: new ObjectId(String(userId)),
      status: "Alpha",
    });
    return;
  }

  static async getUserAttendance(id: string) {
    // console.log(id);

    let agg = [
      {
        $match: {
          userId: new ObjectId(String(id)),
        },
      },
      {
        $lookup: {
          as: "detail",
          from: "schedules",
          foreignField: "_id",
          localField: "scheduleId",
        },
      },
      {
        $unwind: {
          path: "$detail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          as: "subject",
          from: "subjects",
          foreignField: "_id",
          localField: "detail.subjectId",
        },
      },
      {
        $unwind: {
          path: "$subject",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unset: [
          "detail.teacherId",
          "detail.subjectId",
          "userId",
          "scheduleId",
          "detail.endTime",
          "detail.startTime",
          "detail._id",
          "detail.classId",
          "subject._id",
          "subject.description",
        ],
      },
    ];
    return await database
      .collection("attendance_records")
      .aggregate(agg)
      .toArray();
  }
}

export default Attendance;
