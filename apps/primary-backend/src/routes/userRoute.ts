import Router from "express";
import { registerUser, loginUser, logoutUser, userDetails} from "../controllers/userController";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.get('/', (req, res) => {
    // registerUser(req, res);
    res.json({ "msg": "HELLO" });
}
);


userRouter.post('/signup', (req, res) => {
    registerUser(req, res);
}
);

userRouter.post('/signin', (req, res) => {
    loginUser(req, res); 
});

userRouter.post('/signout', logoutUser);

userRouter.post('/wallet', authMiddleware, (req: AuthRequest, res) => {
    console.log(req.payload);
    res.json({ "msg": "Wallet route" }); 
});

// Example Express route
userRouter.get('/me', authMiddleware, async (req: AuthRequest, res) => {
    // By now, req.payload will be set
    const user = req.payload;
    
    res.json({ user }); // or userData if fetched from DB
});  

userRouter.get('/protected', authMiddleware, userDetails);

export default userRouter;