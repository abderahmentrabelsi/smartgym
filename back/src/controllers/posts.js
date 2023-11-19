import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";
import express from "express";

const router = express.Router();

export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
      const post = await PostMessage.findById(id);
      res.status(200).json(post);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query;
  try
    {
        const LIMIT = 4;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find()
        .sort({ _id: -1 })
        .limit(LIMIT)
        .skip(startIndex);
        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

  }

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, "i"); //RegExp = regular expression = pattern used to match character combinations in strings
                                                         //i = case (non sensibilité à la casse)
        const posts = await PostMessage.find({
        $or: [{ title }, { tags: { $in: tags.split(",") } }],
        });
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({...post,creator: req.userId, createdAt: new Date().toISOString()});
    try {
      await  newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("No post with that id");

    const updatedPost = await PostMessage.findByIdAndUpdate(
      _id,
      { ...post, _id }, // ... take all the properties of the post and put them in the updatedPost
      {
        new: true,
      }
    );
    res.json(updatedPost);
  }

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("No post with that id");
    await PostMessage.findByIdAndRemove(id);
    res.json({ message: "Post deleted successfully" });
  }

export const likePost = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.params;

    if (!userId) {
        return res.json({ message: "Unauthenticated" });
    }


    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(userId));

    if (index === -1) {
        post.likes.push(userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    const post = await PostMessage.findById(id);
    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true }); // update the post
    res.json(updatedPost);


}

export const uncommentPost = async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    const post = await PostMessage.findById(id);
    const commentIndex = post.comments.findIndex((c) => c === comment);
    console.log(commentIndex);
    post.comments.splice(commentIndex, 1);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export default router;

