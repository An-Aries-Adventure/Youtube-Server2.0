const mongoose = require('mongoose');
const Joi = require('joi')



const replySchema = new mongoose.Schema({
    text: { type: String, required: true }
});
const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    replies: { type: [replySchema] }
});
const videoSchema = new mongoose.Schema({
    videoId: { type: String, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    comments: { type: [commentSchema] }
});


const Comment = mongoose.model('Comments', commentSchema);
const Video = mongoose.model('Video', videoSchema);

function valdiateVideo(video){
    const schema = Joi.object({
        videoId: Joi.string().required(),
        likes: Joi.number(),
        dislikes: Joi.number(),

    });
    return schema.validate(video);
}




module.exports.Video = Video;
module.exports.Comment = Comment;
exports.validate = valdiateVideo