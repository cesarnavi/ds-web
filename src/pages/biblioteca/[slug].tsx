import PageHeader from "@/components/PageHeader";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";

import Header from "@/components/Header";
import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";
import { ImImage, ImYoutube } from "react-icons/im";
import { AiFillFile } from "react-icons/ai";
import AxiosApiInstance from "@/services/API";

const fetcher = (path: string) =>
  AxiosApiInstance.get(path).then((res) => res.data);

export default function Topic() {
  const router = useRouter();
  const { session } = useSession();
  const { data: topic } = useSWR("/api/topics/" + router?.query?.slug, fetcher);
  const openFile = (id: string) => {
    if(session.role == "WRITER"){
      return;
    }
    window.open(`${process.env.API_BASE_URL}/items/${id}/file?_=${session.token}`, "_blank");
  };

  useEffect(()=>{
    if(!session){
      window.location.href = "/entrar"
    }
  },[session]);

  return <>
    <Header />
    <PageHeader headerName={topic?.name} />
    <div className="flex ">
        <div className="w-full">
            <table className="w-full bg-white shadow-md rounded-xl table">
            <thead>
                <tr className="bg-blue-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Autor</th>
                <th className="py-3 px-4 text-left">Fecha modificacion</th>
               
                </tr>
            </thead>
            <tbody className="text-blue-gray-900">
            { topic &&
                topic?.items?.map((file: any) => {
                        const icon = file.item_type == "IMAGE" 
                          ? <ImImage /> 
                          : file.item_type == "VIDEO_URL" 
                          ? <ImYoutube />
                          : <AiFillFile />
                        return <tr 
                            key={file._id}
                            onDoubleClick={() => openFile(file._id)} 
                            className="border-b-200 space-y-1 border hover:bg-blue-100 cursor-pointer"
                        >
                            <td className="py-3 px-4">
                                <div className="flex items-center space-x-4">
                                    {/* File Icon */}
                                    <div className="h-6 w-6">{icon}</div>
                                    {/* File Name */}
                                    <span className="w-36 sm:w-60 xl:w-auto truncate text-sm font-medium cursor-pointer ">
                                    {file.item_name}
                                    </span>
                                </div>
                            </td>
                            <td className="py-3 px-4">{file.author ?? ""}</td>
                            <td className="py-3 px-4">{new Date(file.updated_at).toLocaleString()}</td>
                        </tr>
                    })
                }
            </tbody>
            </table>
        </div>
    </div>
</>
}
