import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, isAdminAuthConfigured, verifyAdminPassword } from "../../../../lib/auth";
export async function POST(request:NextRequest){if(!isAdminAuthConfigured())return NextResponse.redirect(new URL("/admin/login?error=config",request.url),303);const data=await request.formData();if(!verifyAdminPassword(String(data.get("password")||"")))return NextResponse.redirect(new URL("/admin/login?error=password",request.url),303);await createAdminSession();return NextResponse.redirect(new URL("/admin",request.url),303)}
