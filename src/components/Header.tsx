"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
// import Search from "./Search";
import { FaUserCircle } from "react-icons/fa";
import { useSession } from "@/hooks/use-session";

function Header() {
  const { session, removeSession } = useSession();

  const handleLogout = () => {
    removeSession();
    window.location.href = "/entrar";
  };

  if (!session) {
    return <></>;
  }

  return (
    <div className="relative flex h-16 w-screen items-center justify-between px-5 py-2">
      <div className="w-16 pl-1 duration-500 tablet:w-60">
        <Link href={"/"} className="flex w-fit items-center space-x-2 p-1">
          <Image
            src="/logo.svg"
            width={500}
            height={200}
            alt="logo"
            className="w-20 h-20 object-contain object-center"
            draggable={false}
          />
        </Link>
      </div>
      <p> Bienvenido, {session.username} </p>
      <div className="flex items-center">
        <div className="p-2 mx-4 flex flex-col justify-center items-center">
          <div className="flex">
            <p className="font-semibold text-xs px-4 rouded-full border-2 py-2 mx-2">
              {session.role}
            </p>
            <button
              onClick={handleLogout}
              className="rounded bg-red-500 p-2 h-10 text-white"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
