import { hashPassword, comparePassword } from '../utils/auth';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const register = async (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();

  try {
    const error = validateInput({ name, email, password }, true);
    if (error) return res.status(422).json(error);

    // check uniqueness
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(422).json('email already in use.');

    const hashedPassword = await hashPassword(password);

    const user = await new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json('user registration successful!');
  } catch (e) {
    console.log(e);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const error = validateInput({ email, password });
  if (error) return res.status(422).json(error);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json('email incorrect.');

    if (await comparePassword(password, user.password)) {
      // create signed jwt
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      // set token and return user to client excluding the password
      delete user._doc.password;
      res.cookie('token', token, {
        httpOnly: true
        // secure: true, //only works on https
      });
      return res.json(user);
    }

    return res.status(401).json('email or password not valid');
  } catch (err) {
    return res.status(400).json('Ooops! Something bad happened. Try again.');
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.json('logout successful.');
  } catch (err) {
    return res.status(400).json('Ooops! Something bad happened. Try again.')
  }
}

const validateInput = (input = {}, register = false) => {
  if (register) if (!input.name) return 'name is a required field';
  if (!input.email) return 'email is a required field';
  if (!input.password || input.password.length < 6)
    return 'password is required and must be at least 6 characters long.';

  return null;
};
