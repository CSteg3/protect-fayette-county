import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../lib/auth";
import { createEvent, listEvents } from "../../../lib/events";
export async function GET(){try{return NextResponse.json(await listEvents(true));}catch{return NextResponse.json([]);}}
export async function POST(request:NextRequest){if(!(await isAdmin()))return NextResponse.json({error:"Admin sign-in required"},{status:401});const body=await request.json();if(!body.title||!body.startsAt)return NextResponse.json({error:"Title and date are required"},{status:400});const created=await createEvent({title:String(body.title),description:String(body.description||""),location:String(body.location||""),startsAt:String(body.startsAt),status:body.status==="published"?"published":"draft",createdBy:"admin"});return NextResponse.json(created,{status:201});}
