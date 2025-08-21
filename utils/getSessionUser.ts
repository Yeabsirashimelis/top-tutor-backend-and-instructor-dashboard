import { getServerSession } from "next-auth"; //same shit with the useSession in the frontend
import { authOptions } from "./authOptions";

export async function getSessionUser() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session || !session.user) return null;

    return { user: session.user, userId: session.user.id };
  } catch (error) {
    console.error(error);
    return null;
  }
}
