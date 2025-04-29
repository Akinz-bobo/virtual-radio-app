import jwt from "jsonwebtoken";
import { getCurrentUser } from "./auth/getCurrentUser";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET as string;
const expiresIn = 7 * 24 * 60 * 60;
export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return user;
}
