import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, isAdminAuthConfigured, verifyAdminPassword } from "../../../../lib/auth";
function redirect(path:string){return new NextResponse(null,{status:303,headers:{Location:path}})}
export async function POST(request:NextRequest){if(!isAdminAuthConfigured())return redirect("/admin/login?error=config");const data=await request.formData();if(!verifyAdminPassword(String(data.get("password")||"")))return redirect("/admin/login?error=password");await createAdminSession();return redirect("/admin")}
