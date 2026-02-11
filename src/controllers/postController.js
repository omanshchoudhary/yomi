import Post from '../models/Post.js';

export async function getAllPosts(req, res) {
    try {
        const allPosts = await Post.find({});
        return res.status(200).json(allPosts)
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getPostById(req, res) {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

export async function createPost(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Body is required' });
        }
        const { title, content } = req.body
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        const post = await Post.create({ title, content })
        return res.status(201).json(post)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

export async function updatePost(req, res) {
    try {
        const { id } = req.params
        if (!req.body) {
            return res.status(400).json({ error: 'Body is required' });
        }
        const { title, content } = req.body;

        const update = {};
        if (title) update.title = title;
        if (content) update.content = content;

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ error: 'At least one field (title or content) is required' });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if(post.author.toString()!==req.user._id.toString()){
            return res.status(403).json({ error: "Not authorized" });
        }

        if (title) post.title = title;
        if (content) post.content = content;

        await post.save();  

        return res.status(200).json(post);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function deletePost(req, res) {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if(post.author.toString()!==req.user._id.toString()){
            return res.status(403).json({ error: "Not authorized" });
        }
        await post.deleteOne();
        
        return res.status(200).json({ status: 'success' })
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}