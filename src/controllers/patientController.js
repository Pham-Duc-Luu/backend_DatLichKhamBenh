import patientService from '../services/patientService';

let handleCreatePatientExamination = async (req, res) => {
    try {
        let data = await patientService.handleCreatePatientExamination(req.body);

        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

let handleVerifyBooking = async (req, res) => {
    try {
        let data = await patientService.handleVerifyBooking(req.body);
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
    handleCreatePatientExamination,
    handleVerifyBooking,
};
