const { z } = require("zod");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/jwt");

const authSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6)
});

exports.register = asyncHandler(async (req, res) => {
  const data = authSchema.extend({ name: z.string().min(2) }).parse(req.body);

  const exists = await User.findOne({ email: data.email });
  if (exists) {
    const err = new Error("Email already in use");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await User.hashPassword(data.password);
  const user = await User.create({ name: data.name, email: data.email, passwordHash });

  const token = signToken({ userId: user._id, email: user.email });
  res.status(201).json({
    success: true,
    data: { token, user: { id: user._id, name: user.name, email: user.email } }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const data = authSchema.pick({ email: true, password: true }).parse(req.body);

  const user = await User.findOne({ email: data.email });
  if (!user || !(await user.comparePassword(data.password))) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ userId: user._id, email: user.email });
  res.json({
    success: true,
    data: { token, user: { id: user._id, name: user.name, email: user.email } }
  });
});
