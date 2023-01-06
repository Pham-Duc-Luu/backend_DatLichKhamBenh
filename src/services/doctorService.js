var bcrypt = require('bcryptjs');
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let getDoctorInfo = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findAll({
                where: { roleId: 'R2' },
                limit: limit,
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['password'] },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true,
            });

            if (data) {
                resolve({ data, errCode: 0 });
            } else {
                resolve({ data, errCode: 2 });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: ['id', 'email', 'firstName', 'lastName'],
            });

            if (data) {
                resolve({ data, errCode: 0 });
            } else {
                resolve({ data, errCode: 2 });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let saveDetailInfoDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.contentHTML && data.contentMarkDown && data.doctorId) {
                let isExist = await db.MarkDown.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false,
                });
                // console.log(isExist);

                if (isExist) {
                    isExist.contentHTML = data.contentHTML;
                    isExist.contentMarkDown = data.contentMarkDown;
                    isExist.description = data.description;
                    isExist.doctorId = data.doctorId;
                    isExist.specialtyId = data.specialtyId;
                    isExist.clinicId = data.clinicId;

                    await isExist.save();
                } else {
                    await db.MarkDown.create({
                        contentHTML: data.contentHTML,
                        contentMarkDown: data.contentMarkDown,
                        description: data.description,
                        doctorId: data.doctorId,
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId,
                    });
                }

                resolve({ errCode: 0, message: "Saved the doctor's details infomations" });
            }
            resolve({
                errCode: 1,
                message: 'Missing parameter!',
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getDoctorDetail = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findOne({
                where: { id: id },
                // attributes: ['id', 'email', 'firstName', 'lastName'],
                include: [
                    {
                        model: db.MarkDown,
                        attributes: [
                            'contentHTML',
                            'contentMarkDown',
                            'description',
                            'doctorId',
                            'specialtyId',
                            'clinicId',
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });

            data.image = Buffer.from(data.image).toString('binary');

            if (data) {
                resolve({ data, errCode: 0 });
            } else {
                resolve({ data, errCode: 2 });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

module.exports = {
    getDoctorInfo,
    getAllDoctor,
    saveDetailInfoDoctor,
    getDoctorDetail,
};
