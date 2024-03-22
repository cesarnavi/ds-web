import React, { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { AiOutlinePlus } from "react-icons/ai";
import { SyntheticEvent } from "react";
import { useSession } from "@/hooks/use-session";

const MAX_FILE_SIZE_MB = 16;

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

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function Modal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (d: any) => void;
}) {
  const [topic, setTopic] = useState<any>(null);
  const [file, setFile] = useState<{name:string, b64:any}|null>(null);
  const [tab, setTab] = useState<string>("");
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

  const getAllowedFormats=(): Array<string>=>{
    let allowedFormats = [];
    if(topic && topic.content_types.includes("TXT")){
      allowedFormats.push(".txt")
    }
  
    if(topic && topic.content_types.includes("IMAGE")){
      allowedFormats.push(".png",".jpg",".jpef",".webp")
    }
    return allowedFormats
  }

  useEffect(() => {
    if (topics && topics.length > 0 && !topic) {
      setTopic(topics[0]);
    }
  }, [topics]);

  useEffect(() => {

    setFile(null);
    setTab("");
  }, [topic]);

  const allowedFormats = getAllowedFormats();
  const allowVideoURL = topic && topic.content_types.find((f:any)=>f.key  == "VIDEO_URL");
  const allowFile = topic && topic.content_types.find((f:any)=>f.key  == "TEXT")
  const allowImage = topic && topic.content_types.find((f:any)=>f.key  == "IMAGE")

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
          <div className="mb-4">
            <div className="flex justify-evenly mb-2">
             { (allowFile || allowImage) && <button
                onClick={() => setTab("file")}
                type="button"
                className={`${
                  tab == "file" && "border-blue-500 border-b-4"
                }  font-semibold w-full mb-2 text-sm text-gray-600 dark:text-gray-400 `}
              >
                Subir Archivo
              </button>}
              { allowVideoURL && (
                <button
                  type="button"
                  onClick={() => setTab("video_url")}
                  className={`${
                    tab == "video_url" && "border-blue-500 border-b-4"
                  }   font-semibold w-full mb-2 text-sm text-gray-600 dark:text-gray-400`}
                >
                  Subir URL Youtube
                </button>
              )}
            </div>

            {tab == "video_url" && (
              <input
                name="video_url"
                required
                placeholder="https://youtube.com/video"
                type="url"
                className="w-full px-3 py-2 bg-white placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
              />
            )}
            {tab === "file" && (
              <input
                onChange={handleChooseFile}
                required
                type="file"
                name="item"
                id="item"
                multiple={false}
                accept={allowedFormats.join(",")}
                className="w-full px-3 py-2 bg-white placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none"
              />
            )}
          </div>

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

export default function AddItemButton({ disabled }: { disabled: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { session } = useSession();
  const { mutate } = useSWRConfig();

  const handleClick = () => {
    if (modalOpen) {
      return;
    }
    setModalOpen(true);
  };

  const handleSubmit = (form: any) => {
    console.log("Form:", form);
    if (disabled) {
      window.alert("No cuenta con conexion a internet");
      return;
    }
    //TODO: do sme validations
    axios
      .post("/api/items", form, {
        headers: {
          "Authorization": "Bearer "+session.token
        },
      })
      .then((res) => {
        mutate("/api/topics/"+form.topic_slug);
        setModalOpen(false);
      })
      .catch((e) => {
        console.log(e);
        let msg =
          e?.response?.data?.message || e.response.data || "Contacate a soporte";
        window.alert("Error guardando entrada: " + msg);
      });
  };

  return (
    <>
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      )}
      <button
        disabled={disabled}
        onClick={handleClick}
        className="hover:bg-blue-500 flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium"
      >
        <AiOutlinePlus />
        Añadir
      </button>
    </>
  );
}
