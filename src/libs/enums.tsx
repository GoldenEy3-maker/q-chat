import { type ValueOf } from "./utils";

export const PagePathMap = {
  Home: "/",
  Auth: "/auth",
} as const;

export type PagePathMap = ValueOf<typeof PagePathMap>;
