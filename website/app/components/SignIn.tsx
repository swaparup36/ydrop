"use client";

import Button from "./ui/Button";
import { Chrome } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignIn() {
    return (
        <Button variant='primary' className='w-full' onClick={() => signIn("google")}>
            <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Connect with Google
        </Button>
    );
}