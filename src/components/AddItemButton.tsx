import React, { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { AiOutlinePlus } from "react-icons/ai";
import { SyntheticEvent } from "react";
import { useSession } from "@/hooks/use-session";
import ItemForm from "./ItemForm";

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
        mutate("/api/topics");
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
        <ItemForm onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
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
