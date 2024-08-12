import { z } from "zod";
import { database } from "../config/mongodb";
import { hashPassword } from "../helpers/bcrypt";
import { ObjectId } from "mongodb";

export const UserSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
  role: z.string(),
  phoneNumber: z.string(),
});

type UserType = z.infer<typeof UserSchema>;

class User {
  static collection() {
    return database.collection<UserType>("users");
  }
  static async getUserByEmail(email: string) {
    return await this.collection().findOne({ email: email });
  }
  static async getUserById(id: string) {
    let agg = [
      {
        $match: {
          _id: new ObjectId(String(id)),
        },
      },
      {
        $unset: "password",
      },
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "classDetail",
        },
      },
      {
        $unwind: {
          path: "$classDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    return await database.collection("users").aggregate(agg).toArray();
  }

  static async getUserAttendance(id: string) {
    // console.log(id);

    let agg = [
      {
        $unset: ["password", "phoneNumber", "email"],
      },
      {
        $lookup: {
          from: "attendance_records",
          let: {
            user_id: new ObjectId(String(id)),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$user_id"],
                },
              },
            },
            {
              $lookup: {
                from: "schedules",
                let: {
                  classSchedule: "$scheduleId",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$classSchedule"],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: "subjects",
                      let: {
                        subjectSchedule: "$subjectId",
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ["$_id", "$$subjectSchedule"],
                            },
                          },
                        },
                      ],
                      as: "subjectDetail",
                    },
                  },
                ],
                as: "schedulesDetail",
              },
            },
          ],
          as: "attendanceDetail",
        },
      },
    ];
    return await database.collection("users").aggregate(agg).toArray();
  }
  static async createUser(payload: UserType) {
    const parsedData = UserSchema.safeParse(payload);
    if (!parsedData.success) {
      throw parsedData.error;
    }
    payload.password = hashPassword(payload.password);
    await this.collection().insertOne(payload);
  }
}

export default User;
