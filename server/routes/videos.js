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

router.get('/:id', async (req, res) => {
    try {
   
    const video = await Video.findById(req.params.id);
    if (!video)
    return res.status(400).send(`The video with id "${req.params.id}" does not exist.`);
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

router.post('/:userId/comments/:videoId', async (req, res) => {
    try {

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);

    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(400).send(`The video with id "${req.params.videoId}" does not exist.`);

    user.comments.push(video);

    await user.save();
    return res.send(user.comments);
} 
catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


router.put('/:userId/comments/:videoId', async (req, res) => {
    try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);
    
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
    
    const video = user.comments.id(req.params.videoId);
    if (!video) return res.status(400).send(`The video with id "${req.params.videoId}" does not exist.`);
    
    video.videoId = req.body.videoId;
    video.likes = req.body.likes;
    video.dislikes = req.body.dislikes;
    video.comments = [];
    
    await user.save();
    return res.send(video);
    
    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


router.delete('/:userId/comments/:videoId', async (req, res) => {
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