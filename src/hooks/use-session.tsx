import { SessionContext } from "@/context/session";
import { useContext } from "react";

export type Session = {
    _id: String;
    username: String;
    email: String;
    role: String;
    token: String
  }

export function useSession() {
  const context:{session: Session, setSession: (s:Session)=>void, removeSession: ()=>void} = useContext(SessionContext);
  return {
    ...context
  }
}