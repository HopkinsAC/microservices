import config from "config";
import dayjs from "dayjs";
import { Express } from "express";
import { getConnection, getRepository } from "typeorm";
import { NextFunction } from "express";

import User from "#root/db/entities/User";
import UserSession from "#root/db/entities/UserSession";
import generateUUID from "#root/helpers/generateUUID";
import passwordCompareSync from "#root/helpers/passwordCompareSync";


const USER_SESSION_EXPIRY_HOURS = config.get("USER_SESSION_EXPIRY_HOURS") as number;


const setupRoutes = (app: Express) => {
  const connection = getConnection();
  const userRepository = getRepository(User);

  // User session handling
  //
  app.post("/sessions", async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return next(new Error("Invalid body!"))
    }

    try {
      const user = await userRepository.findOne(
        {
          username: req.body.username
        },
        {
          select: ["id", "passwordHash"]
        }
      );

      if (!user) return next(new Error("Invalid user name!"));

      if (!passwordCompareSync(req.body.password, user.passwordHash)) {
        return next(new Error("Invalid password"));
      }

      const expiresAt = dayjs().add(USER_SESSION_EXPIRY_HOURS, "hours").toISOString()
      const sessionToken = generateUUID();
      const userSession = {
        expiresAt,
        id: sessionToken,
        userId: user.id
      };

      // 2021-03-25T15:46:00 PDT ACH
      // Had to duplicate this since the call to insert the values into the database
      // is adding a new field into the object.  Send the session info to the 
      // database and return the copy of the pre-session info.
      //
      const sessionInfo = {
        expiresAt,
        id: sessionToken,
        userId: user.id
      }

      await connection.createQueryBuilder().insert().into(UserSession).values([sessionInfo]).execute();

      // 2021-03-25T15:49:00 PDT ACH
      // Returning only the information needed by the calling post command.
      //
      return res.json(userSession);

    } catch (err) {
      return next(err);
    }
  });

  // User handling
  //
  app.get("/users/:userId", async (req, res, next) => {
    try {
      const user = await userRepository.findOne(req.params.userId);

      if (!user) return next(new Error("Invalid user Id"));

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  });
}

export default setupRoutes;
