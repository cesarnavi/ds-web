import { useRouter } from "next/router";
import React from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { BsArrowLeftCircle } from "react-icons/bs";
import AddItemButton from "./AddItemButton";
import { useSession } from "@/hooks/use-session";

function PageHeader({ headerName }: { headerName: string }) {
  const router = useRouter();
  const {session} = useSession()
  const isNestedFolder = router.route === "/biblioteca/[slug]";

  return (
    <div className="flex flex-col space-y-6 p-5 pb-2">
      <div className="flex items-center space-x-2 text-2xl text-textC">
        { isNestedFolder 
        && <span onClick={() => router.back()}><BsArrowLeftCircle size={14} /></span>

        }
        <h2 className="text-semibold capitalize">{headerName}</h2>
      </div>
      <div className="flex justify-between">
      <div className="flex flex-wrap items-center gap-2">
       
      </div>
      <div className="flex flex-wrap items-end gap-2">
        { session && session?.role == "WRITER"  && <AddItemButton disabled={false}/>}
      </div>
      </div>
    </div>
  );
}

export default PageHeader;