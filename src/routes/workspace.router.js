import express, { request } from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import authMiddleware from '../middlewares/authMiddleware.js'
import workspaceMiddleware from "../middlewares/workspacemiddleware.js";
import ChannelController from "../controllers/channel.controller.js";
import channelMiddleware from "../middlewares/channelMiddleware.js";
import MessagesController from "../controllers/messages.controller.js";


const workspaceRouter = express.Router()

workspaceRouter.get(
    '/',
    authMiddleware,
    WorkspaceController.getAll
)

workspaceRouter.post(
    '/',
    authMiddleware,
    WorkspaceController.create
)

workspaceRouter.get(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(),
    WorkspaceController.getById
)

workspaceRouter.post(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(['admin']),
    ChannelController.create
)

workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesController.create
)

workspaceRouter.get(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesController.getAllByChannelId
)

workspaceRouter.post (
    '/:workspace_id/invite',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.invite
)

export default workspaceRouter