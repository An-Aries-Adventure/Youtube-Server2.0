const {Video, Comment, validate} = require('../models/videoschema');
const {User, validateUser} = require('../models/user');
const express = require('express');
const router = express.Router();

// adding new video

router.get('/', async (req, res) => {
    try {
        const videos = await Video.find();
        return res.send(videos);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

router.get('/:videoId', async (req, res) => {
    try {
   
    const videos = await Video.find({videoId: req.params.videoId});
    const video = videos[0];
    console.log(video);
    if (!video)
    return res.status(400).send(`The video with id "${req.params.videoId}" does not exist.`);
    return res.send(video);
    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error)
            return res.status(400).send(error);
        
        const video = new Video({
            videoId: req.body.videoId,
            likes: req.body.likes,
            dislikes: req.body.dislikes,
            comments: []
        })

        await video.save();
        return res.send(video);

}   catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`)
}
})

router.put('/:id', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error);

    const video = await Video.findByIdAndUpdate(
    req.params.id,
    {
        videoId: req.body.videoId,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        comments: []
    },
    { new: true }
    );
    if (!video)
    return res.status(400).send(`The video with id "${req.params.id}" does not exist.`);
    await video.save();
    return res.send(video);
    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
}
});
   
router.delete('/:id', async (req, res) => {
    try {
   
    const video = await Video.findByIdAndRemove(req.params.id);
    if (!video)
    return res.status(400).send(`The video with id "${req.params.id}" does not exist.`);
    return res.send(video);
    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


//adding new comment

//localhost:5000/api/videos/jH4yuUi/comments

router.post('/:videoId/comments', async (req, res) => {
    try {
        const videos = await Video.find({videoId: req.params.videoId});
        let video = videos[0];

        const comment = new Comment({
            text: req.body.text,
            replies: []
        });

        if (!video){
        video = new Video({
            videoId: req.params.videoId,
            likes: 0,
            dislikes: 0,
            comments: [comment]
        }); 
        }else{
            video.comments.push(comment);
        }

        await video.save();
        return res.send(comment);
    } 
    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


// router.put('/:videoId/comments/:commentId', async (req, res) => {
//     try {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error);
    
//     comments = await Video.find({commentId: req.params.videoId.comments.commentId});
//     let commentToUpdate = comments[0]
    
//     comment = video.comments.id(req.params.commentId);
//     if (!comment) return res.status(400).send(`The video with id "${req.params.commentId}" does not exist.`);
    
//     video.videoId = req.body.videoId;
//     video.likes = req.body.likes;
//     video.dislikes = req.body.dislikes;
//     video.comments = [];
    
//     await comment.save();
//     return res.send(comment);
    
//     } 
//     catch (ex) {
//     return res.status(500).send(`Internal Server Error: ${ex}`);
//     }
// });


router.delete('/:videoId/comments/:commentId', async (req, res) => {
    
    try {
   
        const video = await Video.findByIdAndRemove(req.params.id);
        if (!video)
        return res.status(400).send(`The video with id "${req.params.id}" does not exist.`);
        return res.send(video);
        } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
        }

    
    
    
    
    
    
    
    
    try {
   
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);

    let video = user.comments.id(req.params.videoId);
    if (!video) return res.status(400).send(`The video with id "${req.params.videoId}" does not in the users shopping cart.`);

    video = await video.remove();
    await user.save();
    return res.send(video);

    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});
   

module.exports = router