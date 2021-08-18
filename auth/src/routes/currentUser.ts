import express from "express";
import jwt from "jsonwebtoken";
import { currentUser } from "../middlewares/currentUser";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
