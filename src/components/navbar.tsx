import { useTheme } from "next-themes";
import Link from "next/link";
import {
  BiCog,
  BiGroup,
  BiLogOut,
  BiMessage,
  BiMoon,
  BiSun,
} from "react-icons/bi";
import { SignOutAlertDrawer } from "./sign-out-alert-drawer";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export const Navbar: React.FC = () => {
  const { setTheme, theme } = useTheme();

  return (
    <nav className="sticky top-0 hidden h-dvh flex-col items-center gap-2 border-r md:flex">
      <ScrollArea className="h-full px-2 py-4">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-10 w-10 flex-shrink-0"
        >
          <Link href="#">
            <BiMessage className="text-xl" />
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-10 w-10 flex-shrink-0"
        >
          <Link href="#">
            <BiGroup className="text-xl" />
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-10 w-10 flex-shrink-0"
        >
          <Link href="#">
            <BiCog className="text-xl" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="mt-auto h-10 w-10 flex-shrink-0"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <BiSun className="text-xl" />
          ) : (
            <BiMoon className="text-xl" />
          )}
        </Button>
        <SignOutAlertDrawer>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
          >
            <BiLogOut className="text-xl" />
          </Button>
        </SignOutAlertDrawer>
      </ScrollArea>
    </nav>
  );
};
