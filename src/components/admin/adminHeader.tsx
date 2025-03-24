"use client";

import { Button } from "../ui/button";
import { ListTodo, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function AdminHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header className=" flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Link href="/">
          <Button variant="outline" size="sm">
            نمایش منو
            <ListTodo className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {session?.user && (
          <div className="inline-flex flex-row-reverse gap-2 items-center justify-center text-sm border border-input h-9 px-3 rounded-md text-slate-600">
            {session.user.name}
            <User className="w-4 h-4" />
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-slate-700"
        >
          خروج
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
