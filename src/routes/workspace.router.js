import express from "express";
import workspaceController from "../controllers/workspace.controller.js";
import authMiddleware from '../middlewares/authMiddleware.js'

const workspaceRouter = express.Router()

workspaceRouter.get(
    '/all',
    workspaceController.getAll
)

workspaceRouter.get(
    '/',
    authMiddleware,
    workspaceController.getAll
)

export default workspaceRouter    