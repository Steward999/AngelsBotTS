import express, { Router } from "express";
import { VerfyToken, RecivedMessage } from "../controllers/whatsappController";

const router: Router = express.Router();

router
  .get("/", VerfyToken)
  .post("/", RecivedMessage);

export default router;
