import User from '../controllers/userController';
import Token from '../helpers/tokens';
import response from '../helpers/response';


export const verifyAuth = (req, res, next) => {
  const userToken = req.header('x-auth-token');
  if (!userToken) {
    return response.errorMessage(req, res, 400, 'You haven\'t provide your token');
  }
  try {
    const decoded = Token.verifyToken(userToken);
    const authUserId = User.users.find((user) => user.id === decoded);
    if (!authUserId) {
      return response.errorMessage(req, res, 401, 'You are not authorized to perform this action');
    }
    next();
  } catch (error) {
    return response.errorMessage(req, res, 400, error.message);
  }
};
export default verifyAuth;
