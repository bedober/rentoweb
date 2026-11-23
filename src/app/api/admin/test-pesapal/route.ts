import {NextRequest,NextResponse} from "next/server";
import {requireAdmin} from "@/lib/auth";
import {token,registeredIpns} from "@/lib/pesapal";
import {adminDb} from "@/lib/firebase-admin";
export async function POST(req:NextRequest){try{await requireAdmin(req);await token();const cfg=(await adminDb().doc("app_config/global").get()).data()?.pesapal||{},items=await registeredIpns(),ipn=Array.isArray(items)?items.find((x:any)=>x.ipn_id===cfg.ipnId||x.ipnId===cfg.ipnId):null;return NextResponse.json({ok:true,environment:cfg.environment||process.env.PESAPAL_ENV||"sandbox",authenticated:true,ipnRegistered:!!ipn,ipnId:cfg.ipnId||null})}catch(e:any){return NextResponse.json({error:e.message},{status:400})}}
