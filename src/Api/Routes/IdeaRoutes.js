const express = require('express');
const validate = require('../Middlewares/validateMiddleware');
const ideaController = require('../controllers/ideaController');
const { ideaValidationSchema, updateIdeaValidationSchema } = require('../Middlewares/Joi_Validations/ideaValidationSchema');
// const ideaValidationSchema = require('../Middlewares/Joi_Validations/ideaValidationSchema');

const ideaRouter = express.Router();

ideaRouter
    .post('/create', validate(ideaValidationSchema), ideaController.createIdea) // Create a new idea
    .get('/ideas', ideaController.getAllIdeas) // Get all ideas
    .get('/ideas/:id', ideaController.getIdeaById) // Get idea by ID    
    .get('/user/:id', ideaController.getIdeaByUserId) // Get idea by ID    
    .put('/ideas/:id', validate(updateIdeaValidationSchema), ideaController.updateIdea) // Update idea by ID   
    .delete('/ideas/:id', ideaController.deleteIdea) // Delete idea by ID

    // Engagement features
    .post('/ideas/:id/view', ideaController.incrementViews) // Increment views count
    .post('/ideas/:id/upvote', ideaController.upvoteIdea) // Upvote an idea
    .post('/ideas/:id/comment', ideaController.addComment) // Add a comment to the idea

    // Search and filter features
    .get('/ideas/search/:title', ideaController.searchIdeasByTitle) // Search ideas by title
    .get('/ideas/latest', ideaController.getLatestIdeas) // Get latest ideas
    .get('/ideas/popular', ideaController.getPopularIdeas) // Get most popular ideas
    .get('/ideas/recommended', ideaController.getRecommendedIdeas) // Get recommended ideas

    // Additional features
    .get('/ideas/:id/related', ideaController.getRelatedIdeas) // Get related ideas
    .get('/ideas/:id/comments', ideaController.getIdeaComments) // Get comments for an idea
    .post('/ideas/:id/follow', ideaController.followIdea) // Follow an idea
    .get('/ideas/:id/followers', ideaController.getIdeaFollowers) // Get followers of an idea
    .post('/ideas/:id/report', ideaController.reportIdea) // Report an idea for review

    // Idea status management 
    .put('/ideas/:id/status', ideaController.updateIdeaStatus) // Update idea status
    .get('/ideas/status/:status', ideaController.getIdeasByStatus) // Get ideas by status

    // User-specific routes
    .get('/user/:userId/ideas', ideaController.getIdeasByUser) // Get all ideas by a specific user
    .get('/user/:userId/favorites', ideaController.getFavoriteIdeas) // Get user's favorite ideas
    .post('/user/:userId/favorite/:ideaId', ideaController.addToFavorites) // Add idea to favorites
    .delete('/user/:userId/favorite/:ideaId', ideaController.removeFromFavorites) // Remove from favorites

module.exports = ideaRouter;


