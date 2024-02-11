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

export const Navbar: React.FC = () => {
  const { setTheme, theme } = useTheme();

  return (
    <nav className="sticky left-0 top-0 hidden flex-col items-center gap-2 overflow-auto border-r px-2 py-4 md:flex">
      <Button asChild variant="ghost" size="icon" className="h-10 w-10">
        <Link href="#">
          <BiMessage className="text-xl" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="h-10 w-10">
        <Link href="#">
          <BiGroup className="text-xl" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="h-10 w-10">
        <Link href="#">
          <BiCog className="text-xl" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="mt-auto h-10 w-10"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <BiSun className="text-xl" />
        ) : (
          <BiMoon className="text-xl" />
        )}
      </Button>
      <SignOutAlertDrawer>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <BiLogOut className="text-xl" />
        </Button>
      </SignOutAlertDrawer>
    </nav>
  );
};
