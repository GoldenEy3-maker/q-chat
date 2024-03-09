import { type ValueOf } from "./utils";

export const PagePathMap = {
  Home: "/",
  Auth: "/auth",
  Chat: "/chat/",
} as const;

export const PusherChannelEventMap = {
  IncomingMessage: "incoming-message",
  ViewingMessage: "viewing-message",
  SubscriptionSucceeded: "pusher:subscription_succeeded",
  MemberAdded: "pusher:member_added",
  MemberRemoved: "pusher:member_removed",
} as const;

export const PusherStaticChannelMap = {
  PresenceOnline: "presence-online",
} as const;

export type PagePathMap = ValueOf<typeof PagePathMap>;
export type PusherChannelEventMap = ValueOf<typeof PusherChannelEventMap>;
export type PusherStaticChannelMap = ValueOf<typeof PusherStaticChannelMap>;
