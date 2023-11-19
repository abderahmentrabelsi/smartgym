import express from "express";
import {createPost, getPosts,updatePost,deletePost,likePost,getPostsBySearch,getPost,commentPost,uncommentPost} from "../controllers/posts.js";


const router = express.Router();


router.get("/search", getPostsBySearch);
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/",  createPost); // we add the auth middleware to the route
router.patch("/:id",  updatePost);
router.delete("/:id",  deletePost);
router.patch("/:id/likePost/:userId",  likePost);
router.post("/:id/commentPost",  commentPost)
router.put("/:id/uncomment",  uncommentPost)






export default router;
