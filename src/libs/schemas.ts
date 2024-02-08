import { z } from "zod";

export const signUpFormSchema = z.object({
  name: z.string().min(2, {
    message: "Ваше имя должно быть не менее 2 символов!",
  }),
  email: z.string().email({
    message: "Недопустимый email!",
  }),
  username: z.string().min(2, {
    message: "Имя пользователя должно быть не менее 2 символов!",
  }),
  password: z
    .string({
      invalid_type_error: "Недопустимое занчение!",
      required_error: "Обязательное поле!",
    })
    .min(8, {
      message: "Пароль должен быть не менее 8 символов!",
    }),
});
