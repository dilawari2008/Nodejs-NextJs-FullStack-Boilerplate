import UserService from "@/services/user";
import { Request, Response } from "express";

const updateProfile = async (req: Request, res: Response) => {
  const { context, body } = req;
  const user = await UserService.updateProfile(context, body);

  res.sendFormatted(user);
};

const generateCSV = async (req: Request, res: Response) => {
  const { context, body } = req;
  const user = await UserService.generateCSV();

  res.sendFormatted(user);
};

const UserController = {
  updateProfile,
  generateCSV,
};

export default UserController;
