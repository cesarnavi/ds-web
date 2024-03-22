import { useState, useEffect } from "react";

export type Session = {
    _id: String;
    username: String;
    email: String;
    role: String
  }

export function useSession(sessionKey = "ds_session", keepOnWindowClosed = true) {
    if (!sessionKey) {
      throw new Error(
        "sessionKey was not provided to useSession hook"
      );
    }
  
    const getStorage = () => {
      return keepOnWindowClosed ? localStorage : sessionStorage;
    };

    const getStorageValue = () => {
      try {
        const storageValue = getStorage().getItem(sessionKey);
        if (storageValue != null) {
          // There is a session in the storage already
          try {
            const session = JSON.parse(storageValue);
            return session;
          } catch (_a) {
            // Oops... It seems it wasn't an object, returning as String then
            return storageValue;
          }
        }
      } catch (_b) {
        // This catch block handles the known issues listed here: https://caniuse.com/#feat=namevalue-storage
        console.warn(
          "useSession could not access the browser storage. Session will be lost when closing browser window"
        );
      }
      return null;
    };
    const [state, setState] = useState(getStorageValue);

    const save = (sessionValue: Session) => {
      if (typeof sessionValue == "object" || typeof sessionValue === "string") {
        getStorage().setItem(sessionKey, JSON.stringify(sessionValue));
        setState(sessionValue);
      } else {
        throw new Error(
          "useSession hook only accepts objects or strings as session values"
        );
      }
    };
  
    const clear = () => {
      getStorage().removeItem(sessionKey);
      setState(null);
    };
    const syncState = (event:any) => {
      if (event.key === sessionKey) {
        setState(getStorageValue());
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncState);
      return () => {
        window.removeEventListener("storage", syncState);
      };
    }, [sessionKey]);
    
    return { session: state, save, clear };
}