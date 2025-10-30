import express, { request } from "express";
import workspaceController from "../controllers/workspace.controller.js";
import authMiddleware from '../middlewares/authMiddleware.js'
import workspaceMiddleware from "../middlewares/workspacemiddleware.js";

const workspaceRouter = express.Router()

/* workspaceRouter.get(
    '/all',
    workspaceController.getAll
) */

workspaceRouter.get(
    '/',
    authMiddleware,
    workspaceController.getAll
)

workspaceRouter.post(
    '/',
    authMiddleware,
    workspaceController.create
)

workspaceRouter.get(
    '/:workspace_id/test',
    authMiddleware,
    workspaceMiddleware(['user']),
    (request, response) => {
        console.log(request.workspace_selected)
        console.log(request.member)
        response.json({
            ok: true,
            status: 200,
            message: 'test'
        })
    }
)

export default workspaceRouter    