const mongoose = require('mongoose');
const Joi = require('joi');
const { videoSchema } = require('../models/videoschema');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    comments: {type: [videoSchema] }

});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
    name: Joi.string().required(),
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;