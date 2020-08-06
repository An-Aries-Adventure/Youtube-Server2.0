const {Video, Comment, validate} = require('../models/videoschema');
const express = require('express');
const router = express.Router();


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
    return res.status(400).send(`The product with id "${req.params.id}" d
   oes not exist.`);
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
    return res.status(400).send(`The video with id "${req.params.id}" d
   oes not exist.`);
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
    return res.status(400).send(`The product with id "${req.params.id}" d
   oes not exist.`);
    return res.send(video);
    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});



module.exports = router