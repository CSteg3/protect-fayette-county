import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { publicUrl } from "./public-url";

const COOKIE_NAME = "pfc_admin";
const MAX_AGE = 60 * 60 * 12;

function secret() { return process.env.SESSION_SECRET || (process.env.NODE_ENV === "development" ? "local-development-secret-change-me" : ""); }

function signature(value: string, key: string) { return createHmac("sha256", key).update(value).digest("hex"); }

export function isAdminAuthConfigured() { return Boolean(secret() && (process.env.ADMIN_PASSWORD || process.env.NODE_ENV === "development")); }

export function verifyAdminPassword(value: string) {
  const expected = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "development" ? "local-admin" : "");
  if (!expected) return false;
  const a = Buffer.from(value); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createAdminSession() {
  const key = secret();
  if (!key) throw new Error("Admin authentication is not configured");
  const expires = String(Date.now() + MAX_AGE * 1000);
  const value = `${expires}.${signature(expires, key)}`;
  (await cookies()).set(COOKIE_NAME, value, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE });
}

export async function clearAdminSession() { (await cookies()).delete(COOKIE_NAME); }

export async function isAdmin() {
  const key = secret();
  if (!key) return false;
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [expires, supplied] = value.split(".");
  if (!expires || !supplied || Number(expires) < Date.now()) return false;
  const expected = signature(expires, key); const a = Buffer.from(supplied); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function requireAdmin() { if (!(await isAdmin())) redirect(publicUrl("/admin/login",await headers())); }
