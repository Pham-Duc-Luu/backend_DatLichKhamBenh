import specialistService from '../services/specialistService';

let handleSaveSpecialist = async (req, res) => {
    try {
        // console.log(req.body);
        let data = await specialistService.handleSaveSpecialist(req.body);
        console.log(data);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);

        res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let getAllSpecialist = async (req, res) => {
    try {
        let limit = req.query.limit;
        if (!limit) {
            limit = 10;
        }
        let data = await specialistService.getAllSpecialist(limit);
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

let getDoctorBelongToSpecialist = async (req, res) => {
    try {
        let id = req.query.id;

        let data = await specialistService.getDoctorBelongToSpecialist(id);
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

let getSpecialist = async (req, res) => {
    try {
        let id = req.query.id;

        let data = await specialistService.getSpecialist(id);
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

module.exports = {
    handleSaveSpecialist,
    getAllSpecialist,
    getDoctorBelongToSpecialist,
    getSpecialist,
};
