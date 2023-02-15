var bcrypt = require('bcryptjs');
import db from '../models/index';
import _, { reject } from 'lodash';
require('dotenv').config();
import emailService from './emailService';

let handleCreatePatientExamination = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { email, doctorId } = data;
            // console.log(data);
            if (email && doctorId) {
                let [response, created] = await db.User.findOrCreate({
                    where: { email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                    },
                });
                // console.log(response);

                let { id } = response;
                let emailRes = await emailService.handleSendEmail(data);

                let [patient, patientCreated] = await db.Booking.findOrCreate({
                    where: { patientId: id },
                    defaults: {
                        statuId: 'S1',
                        doctorId: data.doctorId,
                        patientId: id,
                        date: data.date,
                        timeType: data.timeType,
                        token: data.token,
                    },
                    raw: false,
                });
                // console.log(patient);

                // if (patient.token === data.token && patient.doctorId === data.doctorId) {
                //     patient.statuId = 'S2';
                //     await patient.save();
                // } else {
                //     console.log(123);
                //     data.token = '';
                //     console.log(data.token);
                //     patient.token = data.token;
                //     await patient.save();
                // }

                resolve({ errCode: 0, data: response });
            } else {
                resolve({ errCode: 1, message: 'Missing parameter' });
            }
        } catch (e) {
            console.log(e);
            reject({ errCode: 1, message: 'Missing parameter' });
        }
    });
};

let handleVerifyBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data);
            if (data.token && data.doctorId) {
                let booking = await db.Booking.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false,
                });

                booking.statuId = 'S2';
                await booking.save();

                resolve({ errCode: 0, message: 'Verify booking' });
            } else {
                resolve({ errCode: 1, message: 'Missing parameter!' });
            }
        } catch (e) {
            console.log(e);
            reject({ errCode: -1, message: 'Errow from server' });
        }
    });
};

module.exports = {
    handleCreatePatientExamination,
    handleVerifyBooking,
};
