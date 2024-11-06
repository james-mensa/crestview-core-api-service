import { userController } from '@controllers/user.controller';
import {Router} from 'express'

const AuthRouter=Router();
AuthRouter.route("/init/:email").get(userController.authInit)
AuthRouter.route("/register").post(userController.registerUser);
AuthRouter.route("/verify").get(userController.verifyUser);
AuthRouter.route("/users").get(userController.getUsers);
AuthRouter.route("/user/:id").get(userController.getUser);
AuthRouter.route("/login").post(userController.loginUser);
AuthRouter.route("/google").get(userController.socialAuth)

export default AuthRouter