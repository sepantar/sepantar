import jwt from "jsonwebtoken";
import * as jose from "jose";

const SECRET = process.env.JWT_SECRET as string;

export const signToken = (payload: {
  _id: string;
  role: string;
  email: string;
  username: string;
}) => {
  return jwt.sign(payload, SECRET);
};

export const verify = async <T>(payload: string) => {
  let encoded = new TextEncoder().encode(SECRET);
  let payloadJose = await jose.jwtVerify<T>(payload, encoded);

  return payloadJose.payload;
};
