import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db"; 
import { getServerSession } from "next-auth/next";



// get the user details 
export async function GET(req: NextRequest){
    const session = await getServerSession();
    // can get rid of the db call here if we use the userId 
    const user = await prismaClient.user.findFirst({
        where :{
            email: session?.user?.email ?? ""
        }
    });
    if(!user){
        return NextResponse.json({
            message: "Unautenticated"
        },{
            status : 403
        })
    }
}