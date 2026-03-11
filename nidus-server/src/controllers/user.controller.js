import {
  findUserById,
  updateUser,
  searchUsers,
} from "../services/user.service.js";

async function getUser(req, res, next) {
  try {
    const userInfo = await findUserById(req.user.id);
    const { passwordHash, googleId, ...safeUser } = userInfo;
    res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const userInfo = await findUserById(req.params.id);
    const { passwordHash, googleId, ...safeUser } = userInfo;
    res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
}

async function updateUserInfo(req, res, next) {
  try {
    const { bio, avatarUrl } = req.body;
    const updatedUser = await updateUser(req.user.id, { bio, avatarUrl });
    const { passwordHash, googleId, ...safeUpdatedUser } = updatedUser;
    res.status(200).json(safeUpdatedUser);
  } catch (error) {
    next(error);
  }
}

async function searchUsersController(req, res, next) {
  try {
    const username = req.query.username;
    const searchRequest = await searchUsers(username);
    res.status(200).json(searchRequest);
  } catch (error) {
    next(error);
  }
}

export { getUser, getUserById, updateUserInfo, searchUsersController };
