import { Router } from "express";
import { signup } from "./signup.js";
import { signin } from "./signin.js";
import { verify } from "./middlewares/verify.js";


const router:Router = Router();

router.post("/signup" , signup);
router.post("/signin" , signin);
router.post("/verify" , verify);


export default router