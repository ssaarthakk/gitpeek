'use client';
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center ">
        {session.user?.image && (
          <img 
            src={session.user.image} 
            alt={session.user.name!}
            style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
          />
        )}
        <p className="p-4">Signed in as {session.user?.name}</p>
        <LogoutButton />
      </div>
    );
  }
  return (
    <div className="">
      <LoginButton />
    </div>
  )
}