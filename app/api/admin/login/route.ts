import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, isAdminAuthConfigured, verifyAdminPassword } from "../../../../lib/auth";
import { publicUrl } from "../../../../lib/public-url";
function redirectTo(request:NextRequest,path:string){return new NextResponse(null,{status:303,headers:{Location:publicUrl(path,request.headers)}})}
export async function POST(request:NextRequest){if(!isAdminAuthConfigured())return redirectTo(request,"/admin/login?error=config");const data=await request.formData();if(!verifyAdminPassword(String(data.get("password")||"")))return redirectTo(request,"/admin/login?error=password");await createAdminSession();return redirectTo(request,"/admin")}
