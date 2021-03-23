import { Express } from "express";
import { getRepository } from "typeorm";
import { NextFunction } from "express";

import User from "#root/db/entities/user";

const setupRoutes = (app: Express) => {
  const userRepository = getRepository(User);

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
