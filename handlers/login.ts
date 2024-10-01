import { users } from "../assets/databaseDataExample";
import { secretKey256, secretKey512 } from "../assets/exampleSecretKey";
import { createToken } from "./tokens";

import { Request, Response } from 'express';

export const login256 = (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = users.find(user => user.username === username && user.password === password);

    if(!user) {
        res.status(404).json({message: "Username atau password salah"});  
    } else {
        const token = createToken(user, secretKey256, 'HS256');
        res.status(200).json({token});        
    }
};

export const login512 = (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = users.find(user => user.username === username && user.password === password);

    if(!user) {
        res.status(401).json({message: "Username atau password salah"});
    } else {
        const token = createToken(user, secretKey512, 'HS512');

        res.status(200).json({token});
    }
};
