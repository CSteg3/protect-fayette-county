import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, verifyAdminPassword } from "../../../../lib/auth";
export async function POST(request:NextRequest){const data=await request.formData();if(!verifyAdminPassword(String(data.get("password")||"")))return NextResponse.redirect(new URL("/admin/login?error=1",request.url),303);await createAdminSession();return NextResponse.redirect(new URL("/admin",request.url),303)}
