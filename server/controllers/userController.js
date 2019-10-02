import lodash from 'lodash';
import dotenv from 'dotenv';
import User from '../models/userModel';
import Token from '../helpers/tokens';
import response from '../helpers/response';
import hashed from '../helpers/securedPassword';

dotenv.config();
let users = [];
class UserController {
  static users = [];

  static signUp = (req, res) => {
    const id = users.length + 1;
    const takenEmail = users.find((user) => user.email === req.body.email);
    if (takenEmail) {
      return response.errorMessage(req, res, 409, `${req.body.email} is already taken`);
    }
    let {
      firstName, lastName, email, password,
    } = req.body;
    password = hashed.encryptPassword(password);
    const user = new User(id, firstName, lastName, email, password);
    const token = Token.generateAuthToken(id, user.email);
    users.push(user);
    const data = {
      token,
      userdata: lodash.pick(user, ['id', 'firstName', 'lastName', 'email']),
    };
    return response.successMessage(req, res, 201, 'User created successfully', data);
  }

  static signIn = (req, res) => {
    const { email, password } = req.body;
    const user = users.find((userdata) => (userdata.email === email)
      && (hashed.decryptPassword(password, userdata.password)));

    if (!user) {
      return response.errorMessage(req, res, 401, 'Incorrect email or password');
    }
    const token = Token.generateAuthToken(user.id, user.email);
    const data = {
      token,
      userdata: lodash.pick(user, ['id', 'firstName', 'lastName', 'email']),
    };
    return response.successMessage(req, res, 200, 'User signed in successfully', data);
  }
}

export default { UserController, users };
