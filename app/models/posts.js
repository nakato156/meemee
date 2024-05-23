const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    mediaUrl: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    likeCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

PostSchema.methods.toggleLike = async function (userId) {
    const index = this.likes.indexOf(userId);
    if (index === -1) {
        // El usuario no ha dado like, añadir like
        this.likes.push(userId);
        this.likeCount += 1;
    } else {
        // El usuario ya ha dado like, quitar like
        this.likes.splice(index, 1);
        this.likeCount -= 1;
    }
    await this.save();
    return this.likeCount;
};

module.exports = model('Post', PostSchema);