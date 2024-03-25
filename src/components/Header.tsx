"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import useSWR from "swr";
import AxiosApiInstance from "@/services/API";
import { ImImage, ImYoutube } from "react-icons/im";
import { AiFillFile } from "react-icons/ai";
import { useRouter } from "next/navigation";

const fetcher = (url:string)=>AxiosApiInstance.get(url).then((res)=>res.data);

const getItem =(file)=>{
  const icon = file.item_type == "IMAGE" 
  ? <ImImage /> 
  : file.item_type == "VIDEO_URL" 
  ? <ImYoutube />
  : <AiFillFile />
  return icon;
}

function Header() {
  const router= useRouter();
  const { session, removeSession } = useSession();
  const [search,setSearch] = useState("");
  const { data: itemsSearch } = useSWR((search && (search.length > 0) ? "/api/items?name="+search : null),fetcher)
  const { data: topicsSearch } = useSWR((search && (search.length > 0) ? "/api/topics?name="+search : null),fetcher)
 
  const handleLogout = () => {
    removeSession();
    window.location.href = "/entrar";
  };

  const openFile = (id: string) => {
    if(session.role == "WRITER"){
      return;
    }
    window.open(`${process.env.API_BASE_URL}/items/${id}/file?_=${session.token}`, "_blank");
  };
  const openTopic =(slug:string)=>{
    router.push("/biblioteca/"+slug);
  }

  if (!session) {
    return <></>;
  }

  return (
    <div className="relative flex h-16 w-screen items-center justify-between px-5 py-2">
      <div className="w-16 pl-1 duration-500 tablet:w-60">
        <Link href={"/"} className="flex w-fit items-center space-x-2 p-1">
          <Image
            src="/logo.svg"
            width={200}
            height={100}
            alt="logo"

            draggable={false}
          />
        </Link>
      </div>
      {/* Input search */}
      <div className="relative">
        <input
          
          onChange={(s)=>setSearch(s.target.value)}
          type="search"
          placeholder="Buscar..." 
          className="px-4 py-2 border rounded-full w-72 md:w-96"
        />
        {
          search && <div className="bg-slate-300 w-72 md:w-96 fixed rounded-lg overflow-y-auto max-h-80">
            <ul className="divide-y-2">
            { topicsSearch && topicsSearch.length > 0 && <> <li className="py-1 px-4 font-extralight text-sm">Temáticas</li>
              {topicsSearch.map((a:any)=> <li key={a.slug} onClick={()=>openTopic(a.slug)} className="flex items-center hover:cursor-pointer py-1 px-4 hover:bg-blue-400">
                <Image   src={a.image_url}
            width={30}
            height={10} alt="tematica"/> &nbsp; {a.name}</li>)
                }
                </>}
             { itemsSearch && itemsSearch.length > 0 && <> <li className="py-1 px-4 font-extralight text-sm">Elementos</li>
              {itemsSearch.map((a:any)=> <li key={a._id} onClick={()=>openFile(a._id)} className="flex items-center hover:cursor-pointer py-1 px-4 hover:bg-blue-400">
                {getItem(a)} &nbsp; {a.item_name}</li>)
                }
                </>}
            </ul>
          </div>
        }
      </div>
      <div className="flex items-center">
        <div className=" mx-4 flex flex-col justify-center items-center">
          <div className="flex">
            <p className="flex flex-col text-center font-semibold text-xs px-4 rouded-full border-2 py-1 mx-2">
              {session.role}
              <span className="font-light">{session.username}</span>
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
