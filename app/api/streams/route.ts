// endpoint where a.users can add streams 

import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import { prismaClient }  from "@/app/lib/db";
var YT_REGEX = 
  /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;
import * as youtubesearchapi from "youtube-search-api";


const CreateStreamSchema = z.object({
    creatorId: z.string(), // valid obj must have  a creatorId whose val is a string
    url : z.string() // url property whose val is also a string 
})

export async function POST(req: NextRequest){
    try{
        const data = CreateStreamSchema.parse (await req.json()); // if data that comes over here from the user is incorect we wrap it in a try block 
        // can add rate limiting here so single user cant flood the stream 

        const isYt= YT_REGEX.test(data.url);
        if (!isYt){
            return NextResponse.json({
            message : "wrong url format" // if wrong return boolean false 
        }, {status : 411});
        } 
            
        // else if isYt is true then we extract the id from the url
        const extractedId= data.url.split("?v=")[1]; // get everything before and after the ?=v

        // given the id we can do a getvideo method call
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(res.title);
        console.log(res.thumbnail.thumbnails);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: { width:number},b:{width:number}) => { a.width < b.width ? -1 : 1}); // sort the thumbnails by width in ascending order
        
        
        

    
        const stream =await prismaClient.stream.create({ // here .stream.create method targets the stream table in our db
           data: {
                userId: data.creatorId,  // inserts a new record with these fields
                url: data.url,
                extractedId,
                type: "Youtube", // hardcoded for now 
                title: res.title ?? "cant find video ",
                smallImg : (thumbnails.length > 1 ? thumbnails[thumbnails.length-2].url : thumbnails[thumbnails.lenght-1].url) 
                 ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg", // if there is no smallImg then we assign it to the last element in the array
                bigImg: (thumbnails[thumbnails.length-1].url) ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg", // if there is no bigImg then we assign it to an empty string
                
            }
        
        });

        return NextResponse.json({
            messaage: "Stream added successfully", 
            id: stream.id
        })
    } catch(e){
        console.error("Stream creation error:",e);
        return NextResponse.json({
            message : "Error while adding stream"
        }, {status : 411});
    }

} 
// this function is used to get all the streams of a user 

export async function GET( req: NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId") // get the creatorId from the query params
    const streams = await prismaClient.stream.findMany({
        where :{
            userId: creatorId ?? "" // if creatorId is not present, return an empty string
        }
    })

    return NextResponse.json({
        
        // return streams in json 
        streams 
         
    })

}   
    