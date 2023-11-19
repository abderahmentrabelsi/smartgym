//const { isUserAuthenticated } = require("../middlewares/auth");
import express from 'express';
import passport from 'passport';
import { isUserAuthenticated } from '../middlewares/auth.js';
import result from "express-session/session/cookie.js";


const router = express.Router();
const successLoginUrl = "http://localhost:3000/dashboard/ecommerce";
const errorLoginUrl = "http://localhost:3000";

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get('/auth/google/callback', // add **/auth**
  (req,res,next)=>{
    passport.authenticate('google', { failureRedirect:errorLoginUrl,successRedirect: successLoginUrl}, async (error, user , info) => {
      if (error){
        return res.send({ message:error.message });
      }
      if (user){
        try {
          // your success code
          //res.redirect(successLoginUrl)
          return res.send({
            data: result.data,
            message:'Login Successful'
          });
          console.log(result.data)
          console.log("User: ", req.user);
        } catch (error) {
        //  res.redirect(errorLoginUrl)
          // error msg
          return res.send({ message: error.message });
        }
      }
    })(req,res,next);
  });

router.get("/isUserAuthenticated" ,isUserAuthenticated, (req, res) => {});
export default router;
