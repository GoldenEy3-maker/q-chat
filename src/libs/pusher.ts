import Pusher from "pusher-js";
import { env } from "~/env";

Pusher.logToConsole = process.env.NODE_ENV === "development";

export const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  forceTLS: true,
  authEndpoint: "/api/pusher/auth",
  authTransport: "ajax",
  auth: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});
