import { Navbar } from "~/components/navbar";
import { Sidebar } from "~/components/sidebar";

export const ChatLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid min-h-screen grid-cols-[1fr] md:grid-cols-[auto_19rem_1fr]">
      <Navbar />
      <Sidebar />
      {children}
    </div>
  );
};
