import config from "config";
import { Connection, createConnection } from "typeorm"
import { USERS_SERVICE_DB_URL } from "../../config/default";

import User from "./entities/User";
import UserSession from "./entities/UserSession";

let connection: Connection;

export const initConnection = async () => {
  connection = await createConnection({
    entities: [User, UserSession],
    type: "mysql",
    url: config.get("USERS_SERVICE_DB_URL") as string
  });
}

const getConnection = () => connection;

export default getConnection;
