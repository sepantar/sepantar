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

  static async getTeacherById(id: string) {
    let agg = [
      {
        $match: {
          _id: new ObjectId(String(id)),
        },
      },
      {
        $lookup: {
          from: "schedules",
          localField: "_id",
          foreignField: "teacherId",
          as: "schedules",
        },
      },
      {
        $unwind: "$schedules",
      },
      {
        $lookup: {
          from: "subjects",
          localField: "schedules.subjectId",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $unwind: "$subject",
      },
      {
        $unset: ["password", "schedules"],
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
  static async updateUserInfo(password: string, phoneNumber: string, userId : string){
    return await this.collection().updateOne({_id: new ObjectId(String(userId))}, {$set: {password: hashPassword(password), phoneNumber: phoneNumber}})
  }
}

export default User;
