import Head from "next/head";
import { Toaster } from "~/components/ui/sonner";

type MainLayoutProps = {
  title?: string;
} & React.PropsWithChildren;

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title ?? "Q-Chat"}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        vaul-drawer-wrapper=""
        className="flex min-h-svh flex-col bg-background"
      >
        {children}
      </div>
      <Toaster />
    </>
  );
};
