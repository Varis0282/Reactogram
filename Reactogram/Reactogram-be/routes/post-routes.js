const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const PostModel = mongoose.model("PostModel");
const protectedRoute = require("../middleware/protectedResource");


//all user posts
router.get("/allposts", (req, res) => {
    PostModel.find()
        .populate("author", "_id fullName profileImg")
        .populate("comments.commentedBy", "_id fullName")
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
})


//all posts only from logged in user
router.get("/myallposts", protectedRoute, (req, res) => {
    PostModel.find({ author: req.user._id })
        .populate("author", "_id fullName profileImg")
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
})

router.post("/createPost", protectedRoute, (req, res) => {
    const { description, location, image } = req.body;
    if (!description || !location || !image) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    req.user.password = undefined;
    const postObj = new PostModel({ description: description, location: location, image: image, author: req.user });
    postObj.save()
        .then((newPost) => {
            res.status(201).json({ post: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});


//delete post by the post author
router.delete("/deletepost/:postId", protectedRoute, async (req, res) => {
    try {
      const postFound = await PostModel.findOne({ _id: req.params.postId })
        .populate("author", "id");
  
      if (!postFound) {
        return res.status(400).json({ error: "Post doesn't exist" });
      }
  
      // Check if the post author is the same as the logged-in user, then allow deletion
      if (postFound.author._id.toString() === req.user._id.toString()) {
        await PostModel.deleteOne({ _id: req.params.postId });
        res.status(200).json({ result: "Post deleted successfully" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

router.put("/like", protectedRoute, (req, res) => {
    PostModel.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true //returns updated record
    }).populate("author", "_id fullName")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            else {
                res.json(result)
            }
        })
});

router.put("/unlike", protectedRoute, (req, res) => {
    PostModel.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true //returns updated record
    }).populate("author", "_id fullName")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            else {
                res.json(result)
            }
        })
});

router.put("/comment", protectedRoute, (req, res) => {

    const comment = { commentText: req.body.commentText, commentedBy: req.user._id }

    PostModel.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true //returns updated record
    }).populate("comments.commentedBy", "_id fullName")
        .populate("author", "_id fullName")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            else {
                res.json(result)
            }
        })
});

module.exports = router;