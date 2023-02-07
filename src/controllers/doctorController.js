import doctorService from '../services/doctorService';

let handleGetDoctorInfo = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let data = await doctorService.getDoctorInfo(+limit);
        return res.status(200).json(data);
    } catch (e) {
        // console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};
let handleGetAllDoctor = async (req, res) => {
    try {
        let data = await doctorService.getAllDoctor();
        return res.status(200).json(data);
    } catch (e) {
        // console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let handleSaveDetailInfoDoctor = async (req, res) => {
    let dataInput = req.body;

    try {
        let data = await doctorService.saveDetailInfoDoctor(dataInput);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let handleGetDoctorDetail = async (req, res) => {
    try {
        let data = await doctorService.getDoctorDetail(req.query.id);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let handleSavedoctorSchedule = async (req, res) => {
    try {
        let data = await doctorService.savedoctorSchedule(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let handleGetDoctorScheduleById = async (req, res) => {
    try {
        let data = await doctorService.handleGetDoctorScheduleById(req.query);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};
module.exports = {
    handleGetDoctorInfo,
    handleGetAllDoctor,
    handleSaveDetailInfoDoctor,
    handleGetDoctorDetail,
    handleSavedoctorSchedule,
    handleGetDoctorScheduleById,
};
