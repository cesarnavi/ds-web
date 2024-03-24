import { useState, useEffect, SyntheticEvent } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "@/hooks/use-session";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const { session, setSession } = useSession();

  const handleSubmit= (e: SyntheticEvent)=>{
    e.preventDefault();
    e.stopPropagation();
  
    let form: any = e.target;
    axios.post("/api/users",{
        email:form.email.value,
        username:form.username.value,
        role:form.role.value
    })
    .then(({data})=>{
      setSession(data);
        router.push("/biblioteca")
    }).catch((err)=>window.alert(err.response.data.message || "error"))
  }

   // useEffect
   useEffect(() => {
    document.title = "Iniciar";
    if(session){
        window.location.href ="/"
    }
  }, [session]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-300">
      <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
          Registro
        </div>

        <div className="mt-10">
          <form className="capitalize" onSubmit={handleSubmit}>
            <div className="flex flex-col mb-6">
              <label
                htmlFor="email"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Correo Electronico:
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="lowercase text-sm sm:text-base placeholder-gray-500 pl-2 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                  placeholder="Correo electrónico"
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label
                htmlFor="username"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Nombre de Usuario:
              </label>
              <input
                id="username"
                type="text"
                required
                name="username"
                className="lowercase text-sm sm:text-base placeholder-gray-500 pl-2 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                placeholder="Nombre usuario"
              />
            </div>
            <div className="flex flex-col mb-6">
              <label
                htmlFor="role"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
               Tipo de usuario:
              </label>
              <select name="role" className=" text-sm sm:text-base placeholder-gray-500 pl-2 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400">
                <option value={"READER"}>Lector</option>
                <option value={"WRITER"}>Creador</option>
              </select>
            
            </div>
            <div className="flex w-full">
              <button
                type="submit"
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 uppercase">Registrarse</span>
                <span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center mt-6">
          <Link
            href="/entrar"
            className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center"
          >
            <span>
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </span>
            <span className="ml-2">Ya tienes cuetna ? Iniciar sesion</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
