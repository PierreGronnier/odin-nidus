import {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../services/message.service.js";

async function getMessagesController(req, res, next) {
  try {
    const conversationId = req.params.conversationId;
    const message = await getMessages(conversationId);
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
}

async function createMessageController(req, res, next) {
  try {
    const { content, imageUrl } = req.body;
    const senderId = req.user.id;
    const conversationId = req.params.conversationId;
    const message = await createMessage({
      senderId,
      conversationId,
      content,
      imageUrl,
    });
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

async function updateMessageController(req, res, next) {
  try {
    const { content, imageUrl } = req.body;

    const updatedMessage = await updateMessage(req.params.messageId, {
      content,
      imageUrl,
    });
    res.status(200).json(updatedMessage);
  } catch (error) {
    next(error);
  }
}

async function deleteMessageController(req, res, next) {
  try {
    const deletedMessage = await deleteMessage(req.params.messageId);
    res.status(200).json(deletedMessage);
  } catch (error) {
    next(error);
  }
}

export {
  createMessageController,
  getMessagesController,
  updateMessageController,
  deleteMessageController,
};
