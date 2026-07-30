"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isLockedOut, recordLoginAttempt } from "@/lib/auth/rate-limit";
import { getClientIp } from "@/lib/utils/client-ip";

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await getClientIp();

  if (await isLockedOut(ip)) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Password is required." };
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return { error: "Server is not configured. Contact the site owner." };
  }

  const isValid = await bcrypt.compare(password, hash);
  await recordLoginAttempt(ip, isValid);

  if (!isValid) {
    return { error: "Incorrect password." };
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();
  redirect("/admin");
}
