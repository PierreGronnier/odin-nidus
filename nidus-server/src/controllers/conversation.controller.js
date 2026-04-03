import {
  getConversationById,
  getUserConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  addParticipants,
  removeParticipants,
} from "../services/conversation.service.js";

async function createConversationController(req, res, next) {
  try {
    const { isGroup, name, avatarUrl, participantIds } = req.body;

    const data = isGroup
      ? { isGroup: true, name, avatarUrl, ownerId: req.user.id } // groupe
      : { isGroup: false }; // DM

    const { conversation, created } = await createConversation(
      data,
      participantIds,
    );
    res.status(created ? 201 : 200).json(conversation);
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

    const conversation = await updateConversation(
      req.params.conversationId,
      req.user.id,
      {
        name,
        avatarUrl,
      },
    );
    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
}

async function deleteConversationController(req, res, next) {
  try {
    const deleteConv = await deleteConversation(
      req.params.conversationId,
      req.user.id,
    );
    res.status(200).json(deleteConv);
  } catch (error) {
    next(error);
  }
}

async function addParticipantsController(req, res, next) {
  try {
    const { participantIds } = req.body;
    const conversation = await addParticipants(
      req.params.conversationId,
      req.user.id,
      participantIds,
    );
    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
}

async function removeParticipantController(req, res, next) {
  try {
    const { participantIds } = req.body;
    const conversation = await removeParticipants(
      req.params.conversationId,
      req.user.id,
      participantIds,
    );
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
  deleteConversationController,
  addParticipantsController,
  removeParticipantController,
};
