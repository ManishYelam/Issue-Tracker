const Joi = require('joi');

const ideaValidationSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.base': 'Title must be a string.',
        'any.required': 'Title is required.'
    }),
    description: Joi.string().required().messages({
        'string.base': 'Description must be a string.',
        'any.required': 'Description is required.'
    }),
    industry: Joi.string().optional().allow(null, ''),
    location: Joi.string().optional().allow(null, ''),
    target_market: Joi.string().optional().allow(null, ''),
    stage: Joi.string().valid('idea', 'prototype', 'early', 'growth', 'scale-up').default('idea'),
    funding_required: Joi.number().precision(2).optional().allow(null),
    funding_type: Joi.string().valid('seed', 'angel', 'VC', 'bootstrapped').optional().allow(null),
    compensation: Joi.number().precision(2).optional().allow(null),
    equity_share: Joi.number().precision(2).optional().allow(null),
    partnership_terms: Joi.string().optional().allow(null, ''),
    terms: Joi.string().optional().allow(null, ''),
    expected_launch_date: Joi.date().optional().allow(null),
    development_timeline: Joi.string().optional().allow(null, ''),
    status: Joi.string().valid('open', 'closed', 'in-progress', 'completed').default('open'),
    visibility: Joi.string().valid('public', 'private').default('public'),
    pitch_video_url: Joi.string().uri().optional().allow(null, ''),
    images: Joi.array().items(Joi.string().uri()).optional().allow(null),
    views_count: Joi.number().integer().default(0),
    applications_count: Joi.number().integer().default(0),
    last_updated: Joi.date().default(() => new Date()),
    tags: Joi.array().items(Joi.string()).optional().allow(null),
    seeking: Joi.array().items(Joi.string()).optional().allow(null),
    posted: Joi.date().default(() => new Date()),
    marketSize: Joi.string().optional().allow(null, ''),
    traction: Joi.string().optional().allow(null, ''),
    competition: Joi.array().items(Joi.string()).optional().allow(null),
    commitment: Joi.string().optional().allow(null, ''),
    validation: Joi.array().items(Joi.string()).optional().allow(null),
    upvotes: Joi.number().integer().default(0),
    comments: Joi.number().integer().default(0)
});

const updateIdeaValidationSchema = Joi.object({
    title: Joi.string().optional().messages({
        'string.base': 'Title must be a string.'
    }),
    description: Joi.string().optional().messages({
        'string.base': 'Description must be a string.'
    }),
    industry: Joi.string().optional().allow(null, ''),
    location: Joi.string().optional().allow(null, ''),
    target_market: Joi.string().optional().allow(null, ''),
    stage: Joi.string().valid('idea', 'prototype', 'early', 'growth', 'scale-up').optional(),
    funding_required: Joi.number().precision(2).optional().allow(null),
    funding_type: Joi.string().valid('seed', 'angel', 'VC', 'bootstrapped').optional().allow(null),
    compensation: Joi.number().precision(2).optional().allow(null),
    equity_share: Joi.number().precision(2).optional().allow(null),
    partnership_terms: Joi.string().optional().allow(null, ''),
    terms: Joi.string().optional().allow(null, ''),
    expected_launch_date: Joi.date().optional().allow(null),
    development_timeline: Joi.string().optional().allow(null, ''),
    status: Joi.string().valid('open', 'closed', 'in-progress', 'completed').optional(),
    visibility: Joi.string().valid('public', 'private').optional(),
    pitch_video_url: Joi.string().uri().optional().allow(null, ''),
    images: Joi.array().items(Joi.string().uri()).optional().allow(null),
    views_count: Joi.number().integer().optional(),
    applications_count: Joi.number().integer().optional(),
    last_updated: Joi.date().default(() => new Date()),
    tags: Joi.array().items(Joi.string()).optional().allow(null),
    seeking: Joi.array().items(Joi.string()).optional().allow(null),
    posted: Joi.date().optional(),
    marketSize: Joi.string().optional().allow(null, ''),
    traction: Joi.string().optional().allow(null, ''),
    competition: Joi.array().items(Joi.string()).optional().allow(null),
    commitment: Joi.string().optional().allow(null, ''),
    validation: Joi.array().items(Joi.string()).optional().allow(null),
    upvotes: Joi.number().integer().optional(),
    comments: Joi.number().integer().optional()
});

module.exports = { ideaValidationSchema, updateIdeaValidationSchema };
