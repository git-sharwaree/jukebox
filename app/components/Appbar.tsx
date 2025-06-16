"use client"; // in next when using onclick or any client side code/ component use the "use client" directive

import { signIn, signOut, useSession} from "next-auth/react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { input } from "@/components/ui/input";
import { Music } from "lucide-react";

export function Appbar(){
    const session = useSession();
    // creates a hook called useSession that returns the session variable 
    return <div className = "flex justify-between p-10 pt-4">
           <div className = "text-lg font-bold flex flex-col justify-center text-white">
              MusicSaaS
           </div>
           <div>
               {session.data?.user && <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signOut()}>Logout</Button>}
               {!session.data?.user && <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signIn()}>Sign In</Button>}
           </div> 
        </div>
    
}