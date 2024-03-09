import { type User } from "next-auth";
import { type Members } from "pusher-js";
import { useEffect } from "react";
import { api } from "~/libs/api";
import { PusherChannelEventMap, PusherStaticChannelMap } from "~/libs/enums";
import { pusher } from "~/libs/pusher";
import { useOnlineUsersStore } from "~/store/online-users";

export const OnlineIndicator = () => {
  const onlineUsersStore = useOnlineUsersStore();

  const utils = api.useUtils();
  const updateOnlineAtApi = api.user.updateOnlineAt.useMutation({
    async onMutate(variables) {
      await utils.user.getAll.cancel();
      await utils.user.getById.cancel();

      const prevUserGetAllData = utils.user.getAll.getData();
      const prevUserGetByIdData = utils.user.getById.getData();

      utils.user.getAll.setData(undefined, (old) => {
        if (!old) return;

        return old.map((user) => {
          if (user.id === variables.id) {
            return {
              ...user,
              lastOnlineAt: variables.date,
            };
          }

          return user;
        });
      });

      utils.user.getById.setData({ id: variables.id }, (old) => {
        if (!old) return;

        return { ...old, lastOnlineAt: variables.date };
      });

      return { prevUserGetAllData, prevUserGetByIdData };
    },
    onSettled() {
      void utils.user.getAll.invalidate();
      void utils.user.getById.invalidate();
    },
  });

  useEffect(() => {
    const channel = pusher.subscribe(PusherStaticChannelMap.PresenceOnline);

    channel.bind(
      PusherChannelEventMap.MemberAdded,
      (member: { id: string; info: User }) => {
        onlineUsersStore.add(member.id);
      },
    );
    channel.bind(
      PusherChannelEventMap.SubscriptionSucceeded,
      (members: Members) => {
        const initialUsers: string[] = [];

        members.each((member: User) => initialUsers.push(member.id));
        onlineUsersStore.set(initialUsers);
      },
    );
    channel.bind(
      PusherChannelEventMap.MemberRemoved,
      (member: { id: string; info: User }) => {
        updateOnlineAtApi.mutate({ id: member.id, date: new Date() });
        onlineUsersStore.remove(member.id);
      },
    );

    return () => channel.unbind_all().unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
