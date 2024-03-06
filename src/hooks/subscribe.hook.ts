import { useEffect } from "react";
import { type PusherChannelEventMap } from "~/libs/enums";
import { pusher } from "~/libs/pusher";

export const useSubscribe = <T>(
  channelName: string,
  event: PusherChannelEventMap,
  callback: (data: T) => Promise<void> | void,
) => {
  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind(event, callback);

    return () => {
      channel.unbind().unsubscribe();
    };
  }, [callback, channelName, event]);
};
