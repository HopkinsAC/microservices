import config from "config";
import got from "got";

const USERS_SERVICE_URI = config.get("USERS_SERVICE_URI") as string;


export default class UsersService {

  static async fetchUserSession({ sessionId }: { sessionId: string }) {
    const body = await got.get(`${USERS_SERVICE_URI}/sessions/${sessionId}`).json();
    if (!body) return null;

    return body;
  }
}