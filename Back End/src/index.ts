import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { login256, login512 } from '../handlers/login';
import { secretKey256, secretKey512 } from '../assets/exampleSecretKey';
import { verifyToken } from '../handlers/tokens';

export interface CustomRequest extends Request {
    user?: {id: number; username: string;}
}

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.post('/login256', login256);
app.post('/login512', login512);

// Route protected untuk token HMAC SHA-256
app.get('/protected256', (req: CustomRequest, res: Response, next: NextFunction) => {
    verifyToken(req, res, next, secretKey256, 'HS256');
}, (req: CustomRequest, res: Response) => {
    res.status(200).json({ message: 'Access granted (HMAC SHA-256)', user: req.user });
});


app.get('/protected512', (req: CustomRequest, res: Response, next: NextFunction) => {
    verifyToken(req, res, next, secretKey512, 'HS512');
}, (req: CustomRequest, res: Response) => {
    res.status(200).json({ message: 'Access granted (HMAC SHA-512)', user: req.user });
});

app.listen(port, () => {
    console.log("Server Online on localhost" + port);
});
