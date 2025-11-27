/* import express from "express";
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

export default workspaceRouter */

import express from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import authMiddleware from '../middlewares/authMiddleware.js'
import workspaceMiddleware from "../middlewares/workspacemiddleware.js";
import ChannelController from "../controllers/channel.controller.js";
import channelMiddleware from "../middlewares/channelMiddleware.js";
import MessagesController from "../controllers/messages.controller.js";

import { deleteMessage, deleteChannel, deleteWorkspace } from '../services/deleteService.js'

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

workspaceRouter.post(
    '/:workspace_id/invite',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.invite
)

// RUTAS DELETE (sin try/catch, permitiendo que el error handler global las maneje)

// DELETE mensaje
workspaceRouter.delete(
    '/:workspace_id/channels/:channel_id/messages/:message_id',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    async (req, res, next) => {
        const result = await deleteMessage({ params: req.params })
        if (!result) return res.status(404).json({ ok: false, message: 'No encontrado' })
        return res.status(204).end()
    }
)

// DELETE canal (admin)
workspaceRouter.delete(
    '/:workspace_id/channels/:channel_id',
    authMiddleware,
    workspaceMiddleware(['admin']),
    async (req, res, next) => {
        const result = await deleteChannel({ params: req.params })
        if (!result) return res.status(404).json({ ok: false, message: 'No encontrado' })
        return res.status(204).end()
    }
)

// DELETE workspace (admin)
workspaceRouter.delete(
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(['admin']),
    async (req, res, next) => {
        const result = await deleteWorkspace({ params: req.params })
        if (!result) return res.status(404).json({ ok: false, message: 'No encontrado' })
        return res.status(204).end()
    }
)

export default workspaceRouter