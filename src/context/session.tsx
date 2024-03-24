import React, { useReducer, useState } from "react";
import useSWR from "swr";
import AxiosApiInstance from "@/services/API";
import { JWT_STORAGE_KEY } from "@/constants";

export const SessionContext = React.createContext(null)
const fetcherUser = (path:string)=>AxiosApiInstance.get(path).then(r=>r.data);

export function SessionProvider({children, keepOnWindowClosed}:{keepOnWindowClosed: boolean, children:any}){
    const [session, _ ] = useState(null);
    useSWR("/api/auth/me", fetcherUser,{
        onSuccess:(data)=>{
           setSession(data);
        },
        onError:()=>{
            removeSession();
        }
    });

    const getStorage = () => {
        return keepOnWindowClosed ? localStorage : sessionStorage;
    };

    const setSession =(data:{ role:string, token: string, username: string, email: string })=>{
        if(!data){
            return;
        }
        //1. Add token to localStorgae
        getStorage().setItem(JWT_STORAGE_KEY,data.token);
        //2. Set session to state
        _(data);
       
    }
    const removeSession =()=>{
        //1. Remove token from localStorgae
        getStorage().removeItem(JWT_STORAGE_KEY);
        //2. Set session to state
        _(null);
    }

    return <SessionContext.Provider value={{
        setSession,
        removeSession,
        session
    }}>
        { children }
    </SessionContext.Provider>
}