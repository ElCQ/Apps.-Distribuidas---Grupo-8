import express from 'express';
import checkUserLogged from '../middlewares/checkUserLogged.js';

const routerAPI = express.Router();
//movies
routerAPI.get('/movies', movieController.getAllMovies);
routerAPI.post('/movies', checkUserLogged, movieController.postMovie);
routerAPI.get('/movies/:id', movieController.getMovieByID);
routerAPI.get('/movies/:id/comments', movieController.getMovieCommentsByID);
routerAPI.get('/movies/:id/content', movieController.getMovieContentByID);
//genres
routerAPI.get('/genres', genreController.getAllGenres)
//users
routerAPI.get('/users',checkUserLogged,userController.getCurrentUser);
routerAPI.post('/users', checkUserLogged, userController.postUpdateUser);
routerAPI.delete('/users', checkUserLogged, userController.deleteUser);
routerAPI.get('/users/favorites',checkUserLogged,userController.getCurrentUserFavorites);
routerAPI.post('/users/favorites/:id',checkUserLogged,userController.postMovieToCurrentUserFavorites);
routerAPI.delete('/users/favorites/:id',checkUserLogged,userController.deleteMovieFromCurrentUserFavorites);
//auths
routerAPI.post('/auths', userController.postAuthUser);
routerAPI.put('/auths', checkUserLogged, userController.putRefreshAuth);
routerAPI.delete('/auths', checkUserLogged, userController.postLogOutUser);
//comments
routerAPI.post('/comments', commentController.postComment);

export default routerAPI;