import {Router} from "express";
import { registerUser, loginUser ,loggedOut,refreshAccessToken,changePassword,deleteByEmail, findAllUser,sentResetCode} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJwt}  from "../middlewares/auth.middleware.js";
import verifyCode from "../middlewares/verifyEmail.middleware.js";

const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount :1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)
    router.route("/login").post(loginUser)
    router.route("/logout").post(verifyJwt,loggedOut)
    router.route("/refresh-token").post(refreshAccessToken)
    router.route("/changePassword").post(verifyCode,changePassword)
    router.route("/deleteUserByEmail").delete(deleteByEmail);
    router.route("/getAllUser").get(verifyJwt,findAllUser);
    router.route("/send-reset-code").post(sentResetCode);
export default router;