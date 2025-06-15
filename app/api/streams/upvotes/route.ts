import {NextResponse, NextRequest} from "next/server";
import {z} from 'zod';
import {getServerSession} from "next-auth";
import { prismaClient} from "@/app/lib/db";

const DownvoteSchema = z.object({
    streamId: z.string(), // the stream that the user is upvoting
     
});


export async function POST (req: NextRequest) {
    const session= await getServerSession();
    // if the user exists , get the user details 
    
    const user = await prismaClient.user.findFirst({
        where: {
            email : session?.user?.email ?? ""  // replace with id everywhere and check if the user is valid or not 
        }
    
    });

    // if the user does not exist, return unauthorized 
    
    if(!user){ 
        return NextResponse.json(
            {
                message: "Unauthorized"
            },
            { 
                status : 403
            }
        );
    }

    try {
        const data = DownvoteSchema.parse(await req.json());
        await prismaClient.upvote.create({
            data: {
                
                    userId : user.id, //
                    streamId: data.streamId, // the stream that the user is upvoting
                },
                
            
        });
    }catch (e){
        return NextResponse.json(
            {
                message: "Error while upvoting"
            },
            { 
                status : 403 

            },
        );
    }
}
    
