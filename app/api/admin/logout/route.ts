import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession } from "../../../../lib/auth";
import { publicUrl } from "../../../../lib/public-url";
export async function POST(request:NextRequest){await clearAdminSession();return new NextResponse(null,{status:303,headers:{Location:publicUrl("/",request.headers)}})}
