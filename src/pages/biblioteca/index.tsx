import { useSession } from "@/hooks/use-session";
import useSWR from "swr";
import Folder from "@/components/Folder";
import PageHeader from "@/components/PageHeader";
import { useEffect } from "react";
import Header from "@/components/Header";
import AxiosApiInstance from "@/services/API";

const fetcher = (path: string) =>
  AxiosApiInstance.get(path).then((res) => res.data);

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

  return (
    <>
      <Header />
      <PageHeader headerName="Biblioteca" />
      <div>
      
        <div className="h-[75vh] w-full p-5">
          {/* Folders / Topics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-4">
            { topics &&
              topics?.map((t: any,k:number) => <Folder key={k+1} folder={t} />)
              }
          </div>
        </div>
      </div>
    </>
  );
}
