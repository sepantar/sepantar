import { z } from "zod";
import { database } from "../config/mongodb";
import { hashPassword } from "../helpers/bcrypt";

export const UserSchema = z.object({
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(5),
    role : z.string(),
    phoneNumber : z.string()
})

type UserType = z.infer<typeof UserSchema>

class User{
    static collection(){
        return database.collection<UserType>("users")
    }
    static async getUserByEmail(email:string){
        return await this.collection().findOne({email: email})
    }
    static async createUser(payload : UserType){
        const parsedData = UserSchema.safeParse(payload)
        if(!parsedData.success) {
            throw parsedData.error;
        }
        payload.password = hashPassword(payload.password)
        await this.collection().insertOne(payload)
    }
}

export default User