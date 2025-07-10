import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import { prismaClient} from "@/app/lib/db";

const handler = NextAuth({
    // i want to use google 
    providers : [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "", // assign it to a default string to avoid undefined error in ts 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })

    ],
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks:{
        async signIn(params){
            //console.log(params);
            if(!params.user.email){
                return false;
            }
             try{
                await prismaClient.user.create({
                    data:{
                        email : params.user.email, // create a new user in the db with the email from the params
                        provider : "Google" // hardcoded for now, can be dynamic later 
                   }
                
                })
            } catch(e){
            } 
            return true;
        }

    }
   })
    
export {handler as GET, handler as POST}


