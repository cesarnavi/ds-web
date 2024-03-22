"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
// import { signIn, useSession } from "next-auth/react";
// import UserInfo from "./UserInfo";
import Link from "next/link";
// import Search from "./Search";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import { useSession } from "@/hooks/use-session";

function Header() {
  const { session, clear } = useSession();

  const handleLogout =()=>{
    clear();
    window.location.href = "/entrar"
  }

  if(!session){
    return <></>
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
      <div className="flex items-center">
        <button onClick={handleLogout} className="rounded bg-red-500 p-2 h-10 text-white">Salir</button>
      <div className="p-2 mx-4 flex flex-col justify-center items-center">
        <div className="h-8 w-8 cursor-pointer overflow-hidden rounded-full">
          <FaUserCircle className="h-full w-full" />
        </div>
        Bienvenido, {"Cesar"}
      
      </div>
      </div>
      
    </div>
  );
}

export default Header;
