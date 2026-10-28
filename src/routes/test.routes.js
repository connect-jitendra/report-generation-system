import { Router } from "express";
import mockAuth from "../middlewares/mockAuth.js";
import authorize from "../middlewares/authorize.js";

const router = Router();

router.post('/test-rbac',mockAuth, authorize("report:view_all"), (req,res)=>{
    return res.status(200).json({
        success:true,
        message : " test-rbac is working smoothly "
    })
})

export default router;