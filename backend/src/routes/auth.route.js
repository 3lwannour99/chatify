import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();
router.use(arcjetProtection); // to implement just once for all routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout); // post method is best practice
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user)
);
// router.get("/test",arcjetProtection,(req,res)=>{
//     res.status(200).send("test arcjet")
// })
export default router;
