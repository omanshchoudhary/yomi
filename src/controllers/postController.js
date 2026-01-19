import Post from '../models/Post.js';

export async function getAllPosts(req, res) {
    try {
        const allPosts = await Post.find({});
        return res.status(200).json(allPosts)
    }
    catch {
        return res.status(500).json({ error: error.message });
    }
}

export async function getPostById(req, res) {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        return res.status(200).json(post);
    } catch {
        return res.status(500).json({ error: error.message });
    }

}

export async function createPost(req, res) {
    try {
        const { title, content } = req.body
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        const post = await Post.create({ title, content })
        return res.status(201).json(post)
    } catch {
        return res.status(500).json({ error: error.message });
    }

}

export async function updatePost(req, res) {
    try {
        const { id } = req.params
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        const post = await Post.findByIdAndUpdate(id, { title, content }, { new: true });
        return res.status(200).json(post);

    } catch {
        return res.status(500).json({ error: error.message });
    }
}

export async function deletePost(req, res) {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);
        return res.status(200).json({ status: 'success' })
    }
    catch {
        return res.status(500).json({ error: error.message });
    }
}