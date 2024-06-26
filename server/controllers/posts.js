import Post from '../models/Post.js';
import User from '../models/User.js';
import getDescription from "../services/vision.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        console.log('userId', userId);
        console.log('description', description);
        console.log('picturePath', picturePath);

        const user = await User.findById(userId);

        let finalDescription = description;

        if (!finalDescription && picturePath) {
            try {
                finalDescription = await getDescription(picturePath);
            } catch (error) {
                console.error(error.message);
                finalDescription = 'No description available.';
            }
        }

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description: finalDescription,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        });

        await newPost.save();

        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(201).json(posts);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

/* Helper function for generating a description */
export const generateDescription = async (req, res) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(400).json({ message: 'No picture file uploaded.' });
        }

        const picturePath = file.path;
        const description = await getDescription(picturePath);

        res.status(200).json({ description });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({userId: req.params.id}).sort({createdAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate (
            id,
            {likes: post.likes},
            {new: true}
        )

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

/* DELETE */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        const posts = await Post.find().sort({createdAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}