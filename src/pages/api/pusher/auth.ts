import { type NextApiHandler } from "next";
import { getServerAuthSession } from "~/server/auth";
import { pusher } from "~/server/pusher";

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    return res.status(401);
  }

  const [socketId, channelName] = String(req.body)
    .split("&")
    .map((str) => str.split("=")[1]);

  if (!socketId || !channelName) {
    return res.status(400);
  }

  const presenceData = {
    user_id: session.user.id,
    user_info: session.user,
  };

  const authResponse = pusher.authorizeChannel(
    socketId,
    channelName,
    presenceData,
  );

  res.send(authResponse);
};

export default handler;
