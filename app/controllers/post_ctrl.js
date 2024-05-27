const Post = require("../models/posts")

const postCtrl = {}

async function getPosts(userId, skip, limit) {
    const topPosts = await Post.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            $unwind: "$author"
        },
        // {
        //     $lookup: {
        //         from: "users",
        //         localField: "likes",
        //         foreignField: "_id",
        //         as: "likedUsers"
        //     }
        // },
        // {
        //     $addFields: {
        //         isLikedByCurrentUser: {
        //             $in: [userId, "$likes"]
        //         }
        //     }
        // },
        {
            $project: {
                _id: 1,
                createdAt: 1,
                likeCount: 1,
                mediaUrl: 1,
                author: "$author.username",
                profilePicture: "$author.profilePicture",
                description: 1,
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);
    return topPosts;
}


postCtrl.indexPosts = async (req, res) => {
    const userId = req.session.user._id
    const posts = await getPosts(userId, 0, 3)
    res.render("dinamic/posts", { posts })
}

postCtrl.reels = async (req, res) => {
    const reels = await Post.find({"type": "video"}).sort({"createdAt": -1}).limit(2)
    res.render("users/reels", { titulo: "Reels", reels})
}

postCtrl.suggestPost = async (req, res) => {
    const userId = req.session.user._id
    try {
        const postPerPage = 3;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * postPerPage;
        const posts = await getPosts(userId, skip, postPerPage)
        // console.log({posts})
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching posts', details: err });
    }
}

postCtrl.suggestReel = async (req, res) => {
    const reelsPerPage = 3;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * reelsPerPage;
    const reels = await Post.find({"type": "video"}).sort({"createdAt": -1}).skip(skip).limit(reelsPerPage)
    res.json(reels);
}

// Dar like a una publicación
postCtrl.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const newLikeCount = await post.toggleLike(req.session.user._id); // Asumiendo que el ID del usuario se envía en el cuerpo de la solicitud
        res.json({ message: 'Like toggled successfully', likeCount: newLikeCount });
    } catch (err) {
        res.status(500).json({ error: 'Error toggling like', details: err });
    }
};

module.exports = postCtrl