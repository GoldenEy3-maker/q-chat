import { withAuth } from "next-auth/middleware";
import { PagePathMap } from "./libs/enums";

export default withAuth({
  pages: {
    signIn: PagePathMap.Auth,
  },
});

export const config = {
  matcher: ["/"],
};
