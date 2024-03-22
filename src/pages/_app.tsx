import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {

  const [_,__] = useState(false);
  useEffect(()=>{
    __(true);
  },[]);

  return (
      <main id="main" className="flex h-screen flex-col items-center justify-between  bg-bgc">
        <section className="mb-5 flex h-full w-screen flex-1">
          <div className="flex flex-1">
            <div className="h-[90vh] w-full  rounded-2xl bg-white">
              { _ ?  <Component {...pageProps} /> :<></>}
            </div>
          </div>
        </section>
      </main>
  );
};
