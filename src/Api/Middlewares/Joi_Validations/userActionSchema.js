const Joi = require('joi');

const userActionSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    action_type: Joi.string().valid(
        'create', 'post', 'view', 'like', 'comment', 'share', 'apply',
        'save', 'report', 'follow', 'unfollow', 'subscribe', 'unsubscribe',
        'download', 'upload', 'message', 'review', 'rate', 'bookmark',
        'edit', 'delete', 'feedback', 'favorite', 'unfavorite'
    ).required(),
    entity_type: Joi.string().valid(
        'idea', 'profile', 'comment', 'project', 'resume', 
        'portfolio', 'post', 'article', 'event', 'company', 'job_listing'
    ).required(),
    entity_id: Joi.number().integer().required(),
    details: Joi.object().optional(),
    favorited_by: Joi.number().integer().allow(null),
    ip_address: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).allow(null),
    user_agent: Joi.string().max(255).allow(null),
    device_type: Joi.string().valid('desktop', 'mobile', 'tablet').allow(null),
    location: Joi.string().max(255).allow(null),
    timestamp: Joi.date().default(() => new Date(), 'current timestamp'),
    status: Joi.string().valid('active', 'inactive', 'deleted').default('active'),
    comment_text: Joi.string().max(500).allow(null),
    idea_id: Joi.number().integer().allow(null),
});

module.exports = userActionSchema;
