import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import localFont from "next/font/local";

// Font files can be colocated inside of `pages`
const cursiveFont1 = localFont({
  src: "./blankscript.otf",
  variable: "--font-brand",
});
const cursiveFont2 = localFont({
  src: "./bukhariscript.ttf",
  variable: "--font-brand2",
});

const franxfat = localFont({
  src: "./franxfat.ttf",
  variable: "--font-brand3",
});

const franxmed = localFont({
  src: "./franxmed.ttf",
  variable: "--font-brand4",
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout): ReactElement {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  //This is meant to not re-render the page but i am not sure if that is correct?
  const Page = getLayout(<Component {...pageProps} />) as ReactElement;
  return (
    <div
      className={`${cursiveFont1.variable} ${cursiveFont2.variable} ${franxfat.variable} ${franxmed.variable}`}
    >
      <SessionProvider session={session}>{Page}</SessionProvider>
    </div>
  );
}
export default api.withTRPC(MyApp);
