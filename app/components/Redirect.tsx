// if the user is logged in, he/she will be directed to the dashboard , is  a client side component  
"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 


import { use } from "react";

export function Redirect(){
    const session = useSession();
    const router = useRouter();
    useEffect(() => {
        if(session?.data?.user) {
            router.push("/dashboard");
        }
    },[session])

    return null 
}