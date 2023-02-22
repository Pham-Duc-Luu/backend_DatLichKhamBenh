import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialistController from '../controllers/specialistController';
import clinicController from '../controllers/clinicController';

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
    router.post('/api/post-dotor-schedule/bulk-create', doctorController.handleSavedoctorSchedule);
    router.get('/api/get-doctor-schedule-by-id', doctorController.handleGetDoctorScheduleById);
    router.post('/api/create-patient-examination', patientController.handleCreatePatientExamination);
    router.post('/api/verify-booking', patientController.handleVerifyBooking);

    //SPECIALIST

    router.post('/api/save-specialist-infomation', specialistController.handleSaveSpecialist);
    router.get('/api/get-all-specialist', specialistController.getAllSpecialist);
    router.get('/api/get-specialist', specialistController.getSpecialist);
    router.post('/api/get-doctor-belong-to-specialist', specialistController.getDoctorBelongToSpecialist);
    // Clinic

    router.post('/api/save-clinic-infomation', clinicController.handleSaveClinic);
    router.get('/api/get-all-clinic', clinicController.handleGetAllClinic);
    router.get('/api/get-clinic', clinicController.getClinic);
    router.post('/api/get-doctor-belong-to-clinic', clinicController.getDoctorBelongToClinic);

    // booking

    router.get('/api/get-all-booking', clinicController.getAllBooking);

    router.post('/api/save-booking-status', clinicController.saveBookingStatus);

    router.get('/api/allCode', userController.getAllcode);

    return app.use('/', router);
};

module.exports = initWebRoutes;
