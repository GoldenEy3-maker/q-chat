import { zodResolver } from "@hookform/resolvers/zod";
import { type BuiltInProviderType } from "next-auth/providers/index";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogoGithub } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MainLayout } from "~/layouts/main";
import { api } from "~/libs/api";
import { PagePathMap } from "~/libs/enums";
import { signUpFormSchema } from "~/libs/schemas";
import { type ValueOf } from "~/libs/utils";
import { type NextPageWithLayout } from "./_app";

const signInFormSchema = z.object({
  email: z.string().email({
    message: "Недопустимый email!",
  }),
  password: z
    .string({
      invalid_type_error: "Недопустимое занчение!",
      required_error: "Обязательное поле!",
    })
    .min(1, {
      message: "Обязательное поле!",
    }),
});

const TabValueMap = {
  SignIn: "sign-in",
  SignUp: "sign-up",
} as const;

type TabValueMap = ValueOf<typeof TabValueMap>;

const AuthPage: NextPageWithLayout = () => {
  const [activeTab, setActiveTab] = useState<TabValueMap>("sign-in");
  const [isSignInLoading, setIsSignInLoading] = useState(false);

  const router = useRouter();

  const signUp = api.auth.signUp.useMutation({
    onSuccess() {
      toast.success("Регистрация прошла успешно!");
    },
    onError(error) {
      toast.error(error.message);
      console.error(error);
    },
  });

  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmitSignIn(values: z.infer<typeof signInFormSchema>) {
    void singInWithCredentials(values);
  }

  function onSubmitSignUp(values: z.infer<typeof signUpFormSchema>) {
    signUp.mutate(values);
  }

  async function singInWithCredentials(
    credentials: z.infer<typeof signInFormSchema>,
  ) {
    setIsSignInLoading(true);

    const res = await signIn("credentials", {
      ...credentials,
      redirect: false,
    });

    if (res?.error) toast.error(res.error);

    if (res?.ok) {
      toast.success("Вы успешно авторизовались!");
      void router.push(PagePathMap.Home);
    }

    setIsSignInLoading(false);
  }

  async function signInWithProvider(action: BuiltInProviderType) {
    setIsSignInLoading(true);

    const res = await signIn(action, {
      callbackUrl: PagePathMap.Home,
      redirect: false,
    });

    if (res?.error) toast.error(res.error);

    setIsSignInLoading(false);
  }

  const isLoading = isSignInLoading || signUp.isLoading;

  return (
    <main className="container-grid my-4 flex-grow">
      <div className="grid place-items-center">
        <section className="min-w-full max-w-full xs:min-w-[350px] xs:max-w-[350px]">
          <h1 className="mb-6 text-center text-3xl font-bold">Q-Chat</h1>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabValueMap)}
          >
            <TabsList className="mb-4 grid h-full w-full grid-cols-2 bg-transparent">
              <TabsTrigger
                value={TabValueMap.SignIn}
                className="rounded-none border-b border-b-transparent py-3 data-[state=active]:border-b-foreground"
                disabled={isLoading}
              >
                Авторизация
              </TabsTrigger>
              <TabsTrigger
                value={TabValueMap.SignUp}
                className="rounded-none border-b border-b-transparent py-3 data-[state=active]:border-b-foreground"
                disabled={isLoading}
              >
                Регистрация
              </TabsTrigger>
            </TabsList>
            <TabsContent value={TabValueMap.SignIn}>
              <Card>
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSubmitSignIn)}>
                    <CardContent className="space-y-3">
                      <FormField
                        control={signInForm.control}
                        name="email"
                        disabled={isLoading}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="email@mail.ru"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signInForm.control}
                        name="password"
                        disabled={isLoading}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="********"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        Войти
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
            <TabsContent value={TabValueMap.SignUp}>
              <Card>
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}>
                    <CardContent className="space-y-3">
                      <FormField
                        control={signUpForm.control}
                        name="name"
                        disabled={isLoading}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Иван"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        disabled={isLoading}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="email@mail.ru"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="username"
                        disabled={isLoading}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя пользователя</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="@Иван"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        disabled={isLoading}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="********"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        Зарегистрироваться
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
          <span className="my-4 flex items-center gap-4 whitespace-nowrap before:inline-block before:h-[2px] before:w-full before:content-normal before:bg-muted after:inline-block after:h-[2px] after:w-full after:content-normal after:bg-muted">
            Или
          </span>
          <footer className="flex items-center gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signInWithProvider("github")}
              disabled={isLoading}
            >
              <BiLogoGithub fontSize="1.5em" />
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signInWithProvider("google")}
              disabled={isLoading}
            >
              <FcGoogle fontSize="1.5em" />
            </Button>
          </footer>
        </section>
      </div>
    </main>
  );
};

AuthPage.getLayout = (page) => (
  <MainLayout title="Авторизация">{page}</MainLayout>
);

export default AuthPage;
