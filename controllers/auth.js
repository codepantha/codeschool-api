import { hashPassword, comparePassword } from '../utils/auth';
import User from '../models/user';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const error = validateInput({name, email, password})
    if (error) return res.status(422).json(error);

    // check uniqueness
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(422).json('email already in use.')

    const hashedPassword = await hashPassword(password);

    const user = await new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json('user registration successful!');
  } catch (e) {
    console.log(e)
  }
};

const validateInput = (input) => {
  if (!input.name) return 'name is a required field';
  if(!input.email) return 'email is a required field';
  if (!input.password || input.password.length < 6) 
      return 'password is required and must be at least 6 characters long.';

  return null;
}
