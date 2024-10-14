import { User } from "../models/index";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
