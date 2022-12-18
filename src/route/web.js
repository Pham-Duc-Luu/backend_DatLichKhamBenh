import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/getCRUD', homeController.getCRUD);

    router.get('/get-crud', homeController.displayGetCRUD);

    router.post('/post-crud', homeController.postCRUD);
    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    //call api

    router.post('/api/login', userController.handleLogin);

    router.get('/api/get-user-info', userController.handleGetUserInfo);
    router.post('/api/create-user-info', userController.handleCreateUser);
    router.post('/api/update-user-info', userController.handleUpdateUser);
    router.delete('/api/delete-user-info', userController.handleDeleteUserInfo);

    router.get('/api/allCode', userController.getAllcode);

    return app.use('/', router);
};

module.exports = initWebRoutes;
