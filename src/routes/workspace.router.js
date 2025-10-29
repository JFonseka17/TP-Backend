import express from "express";
import workspaceController from "../controllers/workspace.controller.js";

const workspaceRouter = express.Router()

workspaceRouter.get(
    '/all',
    workspaceController.getAll
)

export default workspaceRouter    