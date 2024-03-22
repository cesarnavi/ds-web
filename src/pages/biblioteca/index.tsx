import { useSession } from "@/hooks/use-session";
import axios from "axios";
import useSWR from "swr";
import Folder from "@/components/Folder";
import PageHeader from "@/components/PageHeader";
import { useEffect } from "react";
import Header from "@/components/Header";

const fetcher = (path: string) =>
  axios.get(path).then((res) => res.data);

export default function Home() {
  const { session } = useSession();
  const { data: topics } = useSWR("/api/topics", fetcher);
  
 
  useEffect(()=>{
    if(!session){
      window.location.href = "/entrar"
    }
  },[session]);

  if(!session){
    return <></>
  }

  console.log(topics)

  return (
    <>
      <Header />
      <PageHeader headerName="Biblioteca" />
      <div>
      
        <div className="h-[75vh] w-full p-5">
          {/* Folders / Topics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-4">
            { topics &&
              topics?.map((t: any) => <Folder folder={t} />)
              }
          </div>
        </div>
      </div>
    </>
  );
}
