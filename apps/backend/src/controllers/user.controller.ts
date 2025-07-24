import { Request, Response, NextFunction } from 'express';
import { User, users } from '../models/user.model';

// Create a User
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const newUser: User = { id: Date.now(), name };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
