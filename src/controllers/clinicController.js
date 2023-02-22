import clinicService from '../services/clinicService';

let handleSaveClinic = async (req, res) => {
    try {
        let data = await clinicService.handleSaveClinic(req.body);
        return res.status(200).json({
            errCode: 0,
            data,
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let handleGetAllClinic = async (req, res) => {
    try {
        let limit = req.query.limit;
        if (!limit) {
            limit = 10;
        }
        let data = await clinicService.handleGetAllClinic(limit);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let getDoctorBelongToClinic = async (req, res) => {
    try {
        let id = req.query.id;

        let data = await clinicService.getDoctorBelongToClinic(id);
        // console.log(data);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);

        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let getClinic = async (req, res) => {
    try {
        let id = req.query.id;

        let data = await clinicService.getClinic(id);
        // console.log(data);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);

        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let getAllBooking = async (req, res) => {
    try {
        let { id, time } = req.query;

        let data = await clinicService.getAllBooking(req.query);
        // console.log(data);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);

        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let saveBookingStatus = async (req, res) => {
    try {
        let data = await clinicService.saveBookingStatus(req.body);
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
    handleSaveClinic,
    saveBookingStatus,
    getAllBooking,
    handleGetAllClinic,
    getDoctorBelongToClinic,
    getClinic,
};
