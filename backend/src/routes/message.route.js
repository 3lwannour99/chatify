import express from 'express';

const router = express.Router();

router.get("/sent",(req,res)=>{
    res.send("sent message endpoint")
})
export default router;