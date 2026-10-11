import fs from "node:fs/promises";
import path from "node:path";
import { TableClient, type TableEntity } from "@azure/data-tables";

export type EventItem = { id:number; title:string; description:string; location:string; startsAt:string; status:string; createdBy:string; createdAt:string; updatedAt:string };
type EventEntity = TableEntity<Omit<EventItem,"id">>;

const dataFile = path.join(process.cwd(), "data", "events.json");
const partitionKey = "events";
let client: TableClient | null = null;
let ready: Promise<void> | null = null;

function table() {
  const connectionString=process.env.AZURE_STORAGE_CONNECTION_STRING;
  if(!connectionString)return null;
  if(!client)client=TableClient.fromConnectionString(connectionString,"communityevents");
  return client;
}

async function ensureTable(storage:TableClient){
  if(!ready)ready=storage.createTable().then(()=>{}).catch((error:unknown)=>{const status=(error as {statusCode?:number}).statusCode;if(status!==409)throw error;});
  await ready;
}

async function localRead():Promise<EventItem[]>{return JSON.parse(await fs.readFile(dataFile,"utf8"));}
async function localWrite(items:EventItem[]){await fs.writeFile(dataFile,JSON.stringify(items,null,2)+"\n");}
function requireLocalDev(){if(process.env.NODE_ENV==="production")throw new Error("AZURE_STORAGE_CONNECTION_STRING is required in production");}

export async function listEvents(publishedOnly=false):Promise<EventItem[]>{
  const storage=table();
  if(!storage){requireLocalDev();const rows=await localRead();return rows.filter(x=>!publishedOnly||x.status==="published").sort((a,b)=>b.startsAt.localeCompare(a.startsAt));}
  await ensureTable(storage);const rows:EventItem[]=[];
  for await(const entity of storage.listEntities<EventEntity>({queryOptions:{filter:`PartitionKey eq '${partitionKey}'`}})){const item=fromEntity(entity);if(!publishedOnly||item.status==="published")rows.push(item);}
  return rows.sort((a,b)=>b.startsAt.localeCompare(a.startsAt));
}

export async function createEvent(input:Omit<EventItem,"id"|"createdAt"|"updatedAt">){
  const storage=table();const now=new Date().toISOString();const id=Date.now();const item={...input,id,createdAt:now,updatedAt:now};
  if(!storage){requireLocalDev();const rows=await localRead();await localWrite([item,...rows]);return item;}
  await ensureTable(storage);await storage.createEntity(toEntity(item));return item;
}

export async function updateEvent(id:number,input:Pick<EventItem,"title"|"description"|"location"|"startsAt"|"status">){
  const storage=table();
  if(!storage){requireLocalDev();const rows=await localRead();let saved:EventItem|undefined;const next=rows.map(x=>x.id===id?(saved={...x,...input,updatedAt:new Date().toISOString()}):x);await localWrite(next);return saved;}
  await ensureTable(storage);
  try{const existing=await storage.getEntity<EventEntity>(partitionKey,String(id));const item={...fromEntity(existing),...input,updatedAt:new Date().toISOString()};await storage.updateEntity(toEntity(item),"Replace");return item;}catch(error){if((error as {statusCode?:number}).statusCode===404)return undefined;throw error;}
}

export async function deleteEvent(id:number){const storage=table();if(!storage){requireLocalDev();await localWrite((await localRead()).filter(x=>x.id!==id));return;}await ensureTable(storage);await storage.deleteEntity(partitionKey,String(id));}

function toEntity(item:EventItem):EventEntity{return {partitionKey,rowKey:String(item.id),title:item.title,description:item.description,location:item.location,startsAt:item.startsAt,status:item.status,createdBy:item.createdBy,createdAt:item.createdAt,updatedAt:item.updatedAt};}
function fromEntity(entity:EventEntity):EventItem{return {id:Number(entity.rowKey),title:String(entity.title),description:String(entity.description),location:String(entity.location),startsAt:String(entity.startsAt),status:String(entity.status),createdBy:String(entity.createdBy),createdAt:String(entity.createdAt),updatedAt:String(entity.updatedAt)};}
