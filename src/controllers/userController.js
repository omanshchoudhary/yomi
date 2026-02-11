import Post from '../models/Post.js';

export async function getUserPost(req, res) {
    try {
        const posts = (await Post.find({ author: req.params.id }).populate("author", "username email")).sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}   