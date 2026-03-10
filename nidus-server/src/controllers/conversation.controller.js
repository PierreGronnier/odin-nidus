import {
  getConversationById,
  getUserConversations,
  createConversation,
  updateConversation,
} from "../services/conversation.service.js";

async function createConversationController(req, res, next) {
  try {
    const { isGroup, name, avatarUrl, participantIds } = req.body;

    const data = isGroup
      ? { isGroup: true, name, avatarUrl } // groupe
      : { isGroup: false }; // DM

    const conversation = await createConversation(data, participantIds);
    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
}

async function getUserConversationsController(req, res, next) {
  try {
    const conversations = await getUserConversations(req.user.id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
}

async function getConversationByIdController(req, res, next) {
  try {
    const conversation = await getConversationById(req.params.conversationId);
    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
}

async function updateConversationController(req, res, next) {
  try {
    const { name, avatarUrl } = req.body;

    const conversation = await updateConversation(req.params.conversationId, {
      name,
      avatarUrl,
    });
    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
}

export {
  createConversationController,
  getUserConversationsController,
  getConversationByIdController,
  updateConversationController,
};
