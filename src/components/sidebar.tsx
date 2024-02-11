import Link from "next/link";
import { BiCheckDouble, BiPlus, BiSearch } from "react-icons/bi";
import { Avatar } from "./avatar";
import { NavDrawer } from "./navdrawer";
import { NewChatDialogDrawer } from "./new-chat-dialog-drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export const Sidebar: React.FC = () => {
  return (
    <aside className="grid max-h-screen grid-rows-[auto_1fr] overflow-hidden border-r md:sticky md:left-0 md:top-0">
      <header className="mb-1 mt-4 grid grid-cols-[auto_1fr] gap-2 px-4 md:grid-cols-[1fr]">
        <NavDrawer />
        <div className="relative">
          <Input placeholder="Поиск" className="pl-9" />
          <span className="pointer-events-none absolute inset-y-0 ml-3 flex items-center justify-center">
            <BiSearch />
          </span>
        </div>
      </header>
      <ScrollArea className="relative px-4 py-3">
        <Button
          asChild
          className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
          variant="ghost"
        >
          <Link href="#">
            <Avatar fallback="US" isOnline className="row-span-2 h-12 w-12" />
            <div className="flex items-center gap-2 overflow-hidden">
              <strong className="flex-grow truncate">Владислав</strong>
              <BiCheckDouble className="text-xl text-primary" />
              <time className="opacity-50">12:00</time>
            </div>
            <p className="truncate">Последнее сообщение</p>
          </Link>
        </Button>
        <Button
          asChild
          className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
          variant="ghost"
        >
          <Link href="#">
            <Avatar fallback="US" isOnline className="row-span-2 h-12 w-12" />
            <div className="flex items-center gap-2 overflow-hidden">
              <strong className="flex-grow truncate">Владислав</strong>
              <BiCheckDouble className="text-xl text-primary" />
              <time className="opacity-50">12:00</time>
            </div>
            <p className="truncate">Последнее сообщение</p>
          </Link>
        </Button>
        <Button
          asChild
          className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
          variant="ghost"
        >
          <Link href="#">
            <Avatar fallback="US" isOnline className="row-span-2 h-12 w-12" />
            <div className="flex items-center gap-2 overflow-hidden">
              <strong className="flex-grow truncate">Владислав</strong>
              <BiCheckDouble className="text-xl text-primary" />
              <time className="opacity-50">12:00</time>
            </div>
            <p className="truncate">Последнее сообщение</p>
          </Link>
        </Button>
        <Button
          asChild
          className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
          variant="ghost"
        >
          <Link href="#">
            <Avatar fallback="US" isOnline className="row-span-2 h-12 w-12" />
            <div className="flex items-center gap-2 overflow-hidden">
              <strong className="flex-grow truncate">Владислав</strong>
              <BiCheckDouble className="text-xl text-primary" />
              <time className="opacity-50">12:00</time>
            </div>
            <p className="truncate">Последнее сообщение</p>
          </Link>
        </Button>
        <Button
          asChild
          className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
          variant="ghost"
        >
          <Link href="#">
            <Avatar fallback="US" isOnline className="row-span-2 h-12 w-12" />
            <div className="flex items-center gap-2 overflow-hidden">
              <strong className="flex-grow truncate">Владислав</strong>
              <BiCheckDouble className="text-xl text-primary" />
              <time className="opacity-50">12:00</time>
            </div>
            <p className="truncate">Последнее сообщение</p>
          </Link>
        </Button>
        <Button
          asChild
          className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
          variant="ghost"
        >
          <Link href="#">
            <Avatar fallback="US" isOnline className="row-span-2 h-12 w-12" />
            <div className="flex items-center gap-2 overflow-hidden">
              <strong className="flex-grow truncate">Владислав</strong>
              <BiCheckDouble className="text-xl text-primary" />
              <time className="opacity-50">12:00</time>
            </div>
            <p className="truncate">Последнее сообщение</p>
          </Link>
        </Button>
        <Button
          asChild
          className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-4 px-2"
          variant="ghost"
        >
          <Link href="#">
            <Avatar fallback="US" isOnline className="row-span-2 h-12 w-12" />
            <div className="flex items-center gap-2 overflow-hidden">
              <strong className="flex-grow truncate">Владислав</strong>
              <BiCheckDouble className="text-xl text-primary" />
              <time className="opacity-50">12:00</time>
            </div>
            <p className="truncate">Последнее сообщение</p>
          </Link>
        </Button>
        <NewChatDialogDrawer>
          <Button
            className="absolute bottom-8 right-8 z-10 h-12 w-12 rounded-full md:h-10 md:w-10"
            size="icon"
          >
            <BiPlus className="text-xl" />
          </Button>
        </NewChatDialogDrawer>
      </ScrollArea>
    </aside>
  );
};
