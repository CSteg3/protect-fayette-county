import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

export type EventItem = { id:number; title:string; description:string; location:string; startsAt:string; status:string; createdBy:string; createdAt:string; updatedAt:string };
const dataFile = path.join(process.cwd(), "data", "events.json");
let sql: ReturnType<typeof postgres> | null = null;

function database() {
  if (!process.env.DATABASE_URL) return null;
  if (!sql) sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 5 });
  return sql;
}

async function ensureTable(db: NonNullable<ReturnType<typeof database>>) {
  await db`CREATE TABLE IF NOT EXISTS events (id BIGSERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', location TEXT NOT NULL DEFAULT '', starts_at TIMESTAMPTZ NOT NULL, status TEXT NOT NULL DEFAULT 'draft', created_by TEXT NOT NULL DEFAULT 'admin', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
}

async function localRead(): Promise<EventItem[]> { return JSON.parse(await fs.readFile(dataFile, "utf8")); }
async function localWrite(items: EventItem[]) { await fs.writeFile(dataFile, JSON.stringify(items, null, 2) + "\n"); }
function requireLocalDev() { if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required in production"); }

export async function listEvents(publishedOnly=false): Promise<EventItem[]> {
  const db=database();
  if (!db) { requireLocalDev(); const rows=await localRead(); return rows.filter(x=>!publishedOnly||x.status==="published").sort((a,b)=>b.startsAt.localeCompare(a.startsAt)); }
  await ensureTable(db);
  const rows = publishedOnly ? await db`SELECT * FROM events WHERE status='published' ORDER BY starts_at DESC` : await db`SELECT * FROM events ORDER BY starts_at DESC`;
  return rows.map(mapRow);
}

export async function createEvent(input: Omit<EventItem,"id"|"createdAt"|"updatedAt">) {
  const db=database(); const now=new Date().toISOString();
  if (!db) { requireLocalDev(); const rows=await localRead(); const item={...input,id:Math.max(0,...rows.map(x=>x.id))+1,createdAt:now,updatedAt:now}; await localWrite([item,...rows]); return item; }
  await ensureTable(db); const [row]=await db`INSERT INTO events (title,description,location,starts_at,status,created_by) VALUES (${input.title},${input.description},${input.location},${input.startsAt},${input.status},${input.createdBy}) RETURNING *`; return mapRow(row);
}

export async function updateEvent(id:number,input:Pick<EventItem,"title"|"description"|"location"|"startsAt"|"status">) {
  const db=database();
  if (!db) { requireLocalDev(); const rows=await localRead(); let saved:EventItem|undefined; const next=rows.map(x=>x.id===id?(saved={...x,...input,updatedAt:new Date().toISOString()}):x); await localWrite(next); return saved; }
  await ensureTable(db); const [row]=await db`UPDATE events SET title=${input.title},description=${input.description},location=${input.location},starts_at=${input.startsAt},status=${input.status},updated_at=NOW() WHERE id=${id} RETURNING *`; return row?mapRow(row):undefined;
}

export async function deleteEvent(id:number) { const db=database(); if(!db){requireLocalDev();await localWrite((await localRead()).filter(x=>x.id!==id));return;} await ensureTable(db);await db`DELETE FROM events WHERE id=${id}`; }

function mapRow(row: Record<string,unknown>):EventItem { return {id:Number(row.id),title:String(row.title),description:String(row.description),location:String(row.location),startsAt:new Date(String(row.starts_at)).toISOString(),status:String(row.status),createdBy:String(row.created_by),createdAt:new Date(String(row.created_at)).toISOString(),updatedAt:new Date(String(row.updated_at)).toISOString()}; }
