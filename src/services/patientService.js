var bcrypt = require('bcryptjs');
import db from '../models/index';
import _ from 'lodash';
require('dotenv').config();

let handleCreatePatientExamination = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { email } = data;
            console.log(data);
            if (email) {
                let [response, created] = await db.User.findOrCreate({
                    where: { email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                    },
                });
                console.log(response);

                let { id } = response;

                await db.Booking.findOrCreate({
                    where: { patientId: id },
                    defaults: {
                        statuId: data.statuId,
                        doctorId: data.doctorId,
                        patientId: id,
                        date: data.date,
                        timeType: data.timeType,
                    },
                });

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

module.exports = {
    handleCreatePatientExamination,
};
