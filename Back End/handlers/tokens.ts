import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../assets/databaseDataExample';
import { CustomRequest } from '../src';

export const createToken = (user: User, secret: string, algorithm: 'HS256' | 'HS512') => {
    return jwt.sign({ id: user.id, username: user.username }, secret,  {
      algorithm,
      expiresIn: '1h'
    });
};

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction, secret: string, algorithm: 'HS256' | 'HS512') => {
  const token = req.headers['authorization'];
  
  if (!token) return res.status(403).json({ message: 'Token is required' });
  
  const bearerToken = token.split(' ')[1];

  jwt.verify(bearerToken, secret, { algorithms: [algorithm] }, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded as { id: number; username: string };
    next();
  });
};