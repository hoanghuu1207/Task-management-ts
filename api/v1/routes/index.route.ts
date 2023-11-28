import {Express} from "express";
import {taskRoute} from "./task.route";
import {userRoute} from "./user.route";

import * as authMiddleware from "../middlewares/auth.middleware";

const mainV1Routes = (app: Express): void => {
  const version = "/api/v1";

  app.use(version + "/tasks", authMiddleware.requireAuth, taskRoute);
  app.use(version + "/users", userRoute);
}

export default mainV1Routes;