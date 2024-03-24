import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "@/context/session";

export default function App({ Component, pageProps }: AppProps) {


  return (
      <main id="main" className="flex h-screen flex-col items-center justify-between  bg-bgc">
        <section className="mb-5 flex h-full w-screen flex-1">
          <div className="flex flex-1">
            <div className="h-[90vh] w-full  rounded-2xl bg-white">
              <SessionProvider keepOnWindowClosed={true}>
                <Component {...pageProps}/>
              </SessionProvider>
            </div>
            
          </div>
        </section>
      </main>
  );
};
