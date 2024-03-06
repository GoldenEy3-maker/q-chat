import { signOut } from "next-auth/react";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { PagePathMap } from "~/libs/enums";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

export const SignOutAlertDrawer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы точно уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить. Вы будите перенаправлены на
              страницу авторизации. До момента повторной успешной авторизации,
              вы потеряете доступ к ресурсу!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={isLoading}>
                Отменить
              </Button>
            </AlertDialogCancel>
            <Button
              asChild
              variant="destructive"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                await signOut({
                  callbackUrl: PagePathMap.Auth,
                });
                setIsLoading(false);
              }}
            >
              <AlertDialogAction>Выйти</AlertDialogAction>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer nested open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Вы точно уверены?</DrawerTitle>
          <DrawerDescription>
            Это действие нельзя будет отменить. Вы будите перенаправлены на
            страницу авторизации. До момента повторной успешной авторизации, вы
            потеряете доступ к ресурсу!
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await signOut({
                callbackUrl: PagePathMap.Auth,
              });
              setIsLoading(false);
            }}
          >
            Выйти
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" disabled={isLoading} className="w-full">
              Отменить
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
