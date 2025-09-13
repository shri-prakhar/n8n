import { Router } from "express";

import { verify } from "./middlewares/verify.js";
import { Credentials, deleteCredentials } from "./credentials.js";


const router:Router = Router();

router.post("/credentials" , verify, Credentials);
router.delete("/credentials" , verify, deleteCredentials);


export default router