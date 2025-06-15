"use client"; // in next when using onclick or any client side code/ component use the "use client" directive

import { signIn, signOut, useSession} from "next-auth/react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { input } from "@/components/ui/input";
import { Music } from "lucide-react";

export function Appbar(){
    const session = useSession();
    // creates a hook called useSession that returns the session variable 
    return <div>
         <Link className="flex tiems-center justify-center" href="a">
            <Music classnamae="h-6 w-6 text-purple-400"/>
            <span className="ml-2 text-lg font-bold text-purple-400">MusicStreamChoice</span>
            </Link>
            <nav className ="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" href="#">
               Features
            </Link>
            <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" href="#">
                Pricing
            </Link>
            
            {session.data?.user && <button className="m-4 p-4 bg-blue-400" onClick={() => signOut()}>Logout</button>}
            {!session.data?.user && <button className="m-4 p-4 bg-blue-400" onClick={() => signIn()}>Sign In</button>}

        </nav>
           
    </div>
    
}