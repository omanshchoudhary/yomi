import BlogPost from '../models/Post.js';

export async function getAllPosts(req, res) {
    try {
        const allPosts = await BlogPost.find({});
        return res.json(allPosts)
    }
    catch {
        return res.json({ error: 'Error at backend' });
    }
}

export async function getPostById(req, res) {
    try {
        const { id } = req.params;
        const post = await BlogPost.findById(id);
        return res.json(post);
    } catch {
        return res.json({ error: 'Error at backend' });
    }

}

export async function createPost(req, res) {
    try {
        const { title, content } = req.body
        const post = await BlogPost.create({ title, content })
        return res.json(post)
    } catch {
        return res.json({ error: 'Error at backend' });
    }

}

export async function updatePost(req, res) {
    try{
        const {id} = req.params
        const {title,content} = req.body;
        const post = await BlogPost.findByIdAndUpdate(id, { title, content }, { new: true });
        return res.json(post);

    } catch {
        return res.json({ error: 'Error at backend' });
    } 
}

export async function deletePost(req, res) {
    try{
        const {id} = req.params;
        const post = await BlogPost.findByIdAndDelete(id);
        return res.json({staus:'success'})
    }
    catch {
        return res.json({ error: 'Error at backend' });
    } 
}