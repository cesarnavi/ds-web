import React, {  useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { SyntheticEvent } from "react";
import AxiosApiInstance from "@/services/API";

const MAX_FILE_SIZE_MB = 16;

type ContentType = {
    name: string
    id: string
}

export const fileToBase64 = (file: any) => {
  return new Promise((resolve) => {
    var reader = new FileReader();
    // Read file content on file loaded event
    reader.onload = function (event: any) {
      resolve(event.target.result);
    };
    // Convert data to base64
    reader.readAsDataURL(file);
  });
};

const fetcher = (url: string) => AxiosApiInstance.get(url).then((res) => res.data);

function getFileInput(content_type:ContentType, handleChoose: (e:any)=>void){
    if(!content_type){
        return <></>
    }
    else if(content_type.id == "VIDEO_URL"){
        return  <input
        name="video_url"
        required
        placeholder="https://youtube.com/video"
        type="url"
        className="w-full px-3 py-2 bg-white placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
      />
    }else if(content_type.id == "TEXT"){
       return  <input
        onChange={handleChoose}
        required
        type="file"
        name="text"
        id="text-item"
        multiple={false}
        accept={".txt"}
        className="w-full px-3 py-2 bg-white placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
      />
    } else if(content_type.id == "IMAGE"){
        return  <input
        onChange={handleChoose}
        required
        type="file"
        name="image"
        id="text-item"
        multiple={false}
        accept={[".png",".jpg",".jpef",".webp"].join(",")}
        className="w-full px-3 py-2 bg-white placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
      />
    } else{
        return  <input
        onChange={handleChoose}
        required
        type="file"
        name="any"
        id="text-item"
        multiple={false}
        className="w-full px-3 py-2 bg-white placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
      />
    }
}

function ItemForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (d: any) => void;
}) {
  const [topic, setTopic] = useState<any>(null);
  const [file, setFile] = useState<{name:string, b64:any}|null>(null);
  const [tab, setTab] = useState<ContentType>(null);
  // Get active topics
  const { data: topics } = useSWR("/api/topics", fetcher);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
 
    let form: any = e.target;
    let video_url = "";
    if(form["video_url"]){
      video_url = form["video_url"].value
    }
    onSubmit({
      topic_slug: form.topic.value,
      file,
      name: form.name.value,
      video_url
    });
  };

  const handleChooseFile = async (e: any) => {
    const selection = e.target.files[0];

    if (selection == undefined) {
      window.alert("Seleccione un archivo valido");
      setFile({
        name: "",
        b64: null,
      });
      return;
    }
    if (selection.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
      window.alert("Archivo excede los 16mb");
      setFile({
        name: "",
        b64: null,
      });
    }
    setFile({
      name: selection.name,
      b64: await fileToBase64(selection),
    });
  };

  useEffect(() => { // Set first topic as default
    if (topics && topics.length > 0 && !topic) {
      setTopic(topics[0]);
    }
  }, [topics]);

  useEffect(() => { //Set default content type for selected topic and clean file
    if(topic && topic.content_types){
        setTab(topic.content_types[0]);
    }
    setFile(null);
  }, [topic]);

  return (
    <div className="fixed flex flex-col z-10 bottom-[100px] top-0 right-0  left-0  sm:top-16  sm:left-auto h-[calc(100%-95px)] w-full sm:w-[450px] overflow-auto min-h-[250px] sm:h-[600px] border border-gray-300 bg-white dark:bg-gray-800 shadow-2xl rounded-md">
      <div className="flex p-5 flex-col justify-center items-center h-20">
        <h3 className=" text-lg text-black dark:text-white">Añadir Elemento</h3>
      </div>
      <div className="flex-grow p-4">
        <form
          onSubmit={handleSubmit}
          id="form"
          className="text-black text-sm text-left "
        >
          {/* Topic */}
          <div className="mb-4">
            <label
              htmlFor="topic"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Temática
            </label>
            <select
              id="topic"
              required
              name="topic"
              defaultValue={""}
              onChange={(s: any) =>
                setTopic(topics.find((t: any) => t.slug == s.target.value))
              }
              className="w-full capitalize  px-3 py-2 bg-white placeholder-gray-300 border border-gray-300 rounded-md"
            >
              {topics?.map((t: any) => (
                <option key={t.slug} className="w-10" value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          {/* Item name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Nombre
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Nombre elemento"
              required
              className="w-full px-3 py-2 bg-white placeholder-gray-300 border border-gray-300 rounded-md "
            />
          </div>
          {/* Tabs for item type */}
          {
            topic && <>
            <div className="mb-4">
            <div className="flex justify-evenly mb-2">
                {/* Impirmimos todos los tipos de datos disponibles */}
                { topic.content_types && topic.content_types.map((t: any) => (
                    <button
                        key={tab.id}
                        onClick={() => setTab(t)}
                        type="button"
                        className={`${
                        tab?.id == t.id && "border-blue-500 border-b-4"
                        }  font-semibold w-full mb-2 text-sm text-gray-600 dark:text-gray-400 `}
                >
                    {t.name}
                </button>
                ))
                }
            </div>  
          </div>
            
            </>
          }
          {/* Input for handling file */}
          {
            tab && getFileInput (tab as ContentType, handleChooseFile)
          }

          {/* Submmiting form */}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full px-3 py-4 text-white bg-green-600 focus:bg-green-600 rounded-lg focus:outline-none"
            >
              Subir
            </button>
            <button
              onClick={onClose}
              type="button"
              className="mt-2 w-full px-3 py-4 text-white bg-gray-400 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemForm