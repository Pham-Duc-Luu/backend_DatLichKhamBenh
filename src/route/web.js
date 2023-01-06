import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';

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

    // call api to get doctor info by limit

    router.get('/api/get-doctor-info', doctorController.handleGetDoctorInfo);
    router.get('/api/get-all-doctor', doctorController.handleGetAllDoctor);
    router.post('/api/save-detail-info-doctor', doctorController.handleSaveDetailInfoDoctor);
    router.get('/api/get-doctor-detail-description-by-id', doctorController.handleGetDoctorDetail);

    router.get('/api/allCode', userController.getAllcode);

    return app.use('/', router);
};

module.exports = initWebRoutes;
