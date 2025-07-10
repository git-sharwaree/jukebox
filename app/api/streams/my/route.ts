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


    // the below code finds all the streams for thid user  
    const streams = await prismaClient.stream.findMany({
        where:{
            userId: user.id
        },
        // include the count of all the upvotes in all the respective streams
        include: {
            _count:{
                select:{
                    upvotes: true
                }
            },
            upvotes: {
                where:{
                    userId: user.id // when user needs to know whether they have voted for a stream alr
                }
            }
        }
    })

    return NextResponse.json({
        streams: streams.map(({_count, ...rest}) => ({
            ...rest,
            upvotes:_count.upvotes,
            haveUpVoted: rest.upvotes.length ? true : false 
        }))
        
    })
}