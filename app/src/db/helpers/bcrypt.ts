import bcrypt, { genSaltSync } from "bcryptjs";

export const hashPassword = (password: string) => {
    let hash = bcrypt.hashSync(password, genSaltSync(10))
    return hash
}

export const comparePassword = (password: string, hashPassword: string) => {
    return bcrypt.compareSync(password, hashPassword)
}