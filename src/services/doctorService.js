var bcrypt = require('bcryptjs');
import db from '../models/index';
import _ from 'lodash';
require('dotenv').config();

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
        console.log(data);
        try {
            if (
                data.contentHTML &&
                data.contentMarkDown &&
                data.doctorId &&
                data.price &&
                data.payment &&
                data.province
            ) {
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

                let isExistInfo = await db.Doctor_infor.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false,
                });

                if (isExistInfo) {
                    isExistInfo.doctorId = data.doctorId;
                    isExistInfo.priceId = data.price;
                    isExistInfo.provinceId = data.province;
                    isExistInfo.paymentId = data.payment;
                    isExistInfo.addressClinic = data.clinicAddress;
                    isExistInfo.nameClinic = data.clinicName;
                    isExistInfo.note = data.note;
                    isExistInfo.count = data.count;
                    isExistInfo.specialistId = data.specialistId;
                    isExistInfo.clinicId = data.clinicId;

                    await isExistInfo.save();
                } else {
                    await db.Doctor_infor.create({
                        doctorId: data.doctorId,
                        priceId: data.price,
                        provinceId: data.province,
                        paymentId: data.payment,
                        addressClinic: data.clinicAddress,
                        nameClinic: data.clinicName,
                        note: data.note,

                        count: data.count,
                        specialistId: data.specialistId,
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
                attributes: { exclude: ['password'] },

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
                    {
                        model: db.Allcode,
                        as: 'positionData',
                    },
                    {
                        model: db.Doctor_infor,
                    },
                ],
                raw: true,
                nest: true,
            });

            let payment;
            let price;
            let province;

            let AllCode = await db.Allcode.findAll();

            // console.log(AllCode);

            if (data.Doctor_infor) {
                let { paymentId, priceId, provinceId } = data.Doctor_infor;
                data.Doctor_infor.payment = AllCode.find((item) => item.keyMap === paymentId);
                data.Doctor_infor.price = AllCode.find((item) => item.keyMap === priceId);
                data.Doctor_infor.province = AllCode.find((item) => item.keyMap === provinceId);
            }

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

let savedoctorSchedule = (data) => {
    let maxNumber = parseInt(process.env.MAX_SCHEDULE);

    return new Promise(async (resolve, reject) => {
        try {
            let currArr = [];

            // ADD MAX NUMBER
            if (data && data.length > 0) {
                currArr = data.map((item) => {
                    return { ...item, maxNumber, date: '' + item.date };
                });
            }

            let scheduleData = await db.schedule.findAll({
                where: { date: currArr[0].date, doctorId: currArr[0].doctorId },
                attributes: ['maxNumber', 'date', 'timeType', 'doctorId'],
                raw: true,
            });

            let exist = [];
            if (scheduleData && scheduleData.length > 0) {
                exist = scheduleData.map((item) => {
                    return { ...item };
                });
            }

            let toCreate = _.differenceWith(currArr, exist, (a, b) => {
                return a.timeType === b.timeType && a.date === b.date;
            });

            let createArray = toCreate.map((item) => {
                return { ...item, date: item.date };
            });

            let response = await db.schedule.bulkCreate(createArray, { raw: true });

            if (response) {
                resolve({ errCode: 0, message: 'Create schedule successful' });
            } else {
                resolve({ errCode: 1, message: 'error' });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let handleGetDoctorScheduleById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id, date } = data;

            if (id && date) {
                let response = await db.schedule.findAll({
                    where: { doctorId: +id, date },
                    include: [{ model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }],
                    raw: true,
                    nest: true,
                });

                // console.log(data);
                // console.log(response);
                if (response && response.length > 0) {
                    resolve({
                        errCode: 0,
                        message: 'successful',
                        data: response,
                        income: data,
                    });
                } else {
                    resolve({
                        errCode: 1,
                        message: 'the is no schedule',
                        income: data,
                    });
                }
            } else {
                resolve({ errCode: 1, message: 'Missing parameter' });
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
    savedoctorSchedule,
    handleGetDoctorScheduleById,
};
