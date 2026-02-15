import ApiError from "../utils/apiError.js";
import Post from "../models/Post.js";

export async function getAllPosts(req, res, next) {
    try {

        //Adding pagination here
        const page= parseInt(req.query.page) || 1;
        const limit= parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;

        //Adding default filter here
        const filter={};

        //Filter by tag
        if(req.query.tag){
            const tags = req.query.tag.split(",");
            filter.tags = { $in: tags };
        }

        //Adding search filter
        if(req.query.q){
            const searchRegex = new RegExp(req.query.q, "i");
            filter.$or = [
                { title: { $regex: searchRegex } },
                { content: { $regex: searchRegex } },
            ];
        }
        
        //Adding sort params 
        let sortOption = {createdAt: -1};
        if(req.query.sort){
            sortOption = req.query.sort.split(",").join(" ");
        }


        const totalPosts = await Post.countDocuments(filter);
        const allPosts = await Post.find(filter).populate("author", "username email").sort(sortOption).skip(skip).limit(limit);
        return res.status(200).json({
            success:true,
            data: allPosts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts/limit),
            totalPosts
        })
    }
    catch (error) {
        next(error);
    }
}

export async function getPostById(req, res, next) {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("author", "username email");
        if (!post) {
            throw new ApiError(404, "Post not found", "POST_NOT_FOUND");
        }
        return res.status(200).json(post);
    } catch (error) {
        next(error);
    }

}

export async function createPost(req, res, next) {
    try {
        if (!req.body) {
            throw new ApiError(400, "Body is required", "MISSING_BODY");
        }
        const { title, content, tags } = req.body;
        if (!title || !content) {
            throw new ApiError(
                400,
                "Title and content are required",
                "MISSING_FIELDS",
            );
        }
        const post = await Post.create({ title, content, tags, author: req.user._id })
        return res.status(201).json(post)
    } catch (error) {
        next(error);
    }

}

export async function updatePost(req, res, next) {
    try {
        const { id } = req.params
        if (!req.body) {
            throw new ApiError(400, "Body is required", "MISSING_BODY");
        }
        const { title, content } = req.body;

        const update = {};
        if (title) update.title = title;
        if (content) update.content = content;

        if (Object.keys(update).length === 0) {
            throw new ApiError(
                400,
                "At least one field (title or content) is required",
                "MISSING_FIELDS",
            );
        }

        const post = await Post.findById(id);

        if (!post) {
            throw new ApiError(404, "Post not found", "POST_NOT_FOUND");
        }

        if (post.author.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Not authorized", "NOT_AUTHORIZED");
        }

        if (title) post.title = title;
        if (content) post.content = content;

        await post.save();

        return res.status(200).json(post);

    } catch (error) {
        next(error);
    }
}

export async function deletePost(req, res, next) {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            throw new ApiError(404, "Post not found", "POST_NOT_FOUND");
        }
        if (post.author.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Not authorized", "NOT_AUTHORIZED");
        }
        await post.deleteOne();

        return res.status(200).json({ status: 'success' })
    }
    catch (error) {
        next(error);
    }
}