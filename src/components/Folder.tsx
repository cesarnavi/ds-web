import { useRouter } from "next/router"
import Image from "next/image";

export default function Folder({
  folder,
}: {
  folder: { name: string; content_types: Array<any> , image_url: string, slug: string };
}) {
    const router = useRouter()
    const open = (slug:string)=>router.push("/biblioteca/"+slug);

  return (
    <div onClick={()=>open(folder.slug)} className="flex items-center p-4  flex-col rounded-xl shadow-md border hover:bg-blue-500/10 active:bg-blue-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none hover:cursor-pointer">
      <h5 className="capitalize text-center mb-2  text-lg font-semibold leading-snug text-blue-gray-900 antialiased">
        {folder.name}
      </h5>
      <div className="py-2 h-[100px] flex items-center object-cover">
       { folder.image_url && <Image
          width={100}
          height={100}
          alt="categoria"
          src={folder.image_url}
        />}
      </div>
      <div className="flex w-full mt-4 items-center justify-evenly">
        {
          folder.content_types && folder.content_types.map((v:any)=>(
            <button
             key={v.id}
            className="text-center text-xs font-medium uppercase text-blue-500"
            type="button"
            data-ripple-dark="true"
          >
           {v.items} {v.name} 
          
          </button>
          ))
        }
      </div>
    </div>
  );
}
