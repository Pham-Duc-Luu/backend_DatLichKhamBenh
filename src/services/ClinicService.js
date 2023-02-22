var bcrypt = require('bcryptjs');
import db from '../models/index';
import _, { reject } from 'lodash';
require('dotenv').config();

let handleSaveClinic = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { address, name, descriptionHTML, descriptionMarkdown, image } = data;

            if (!address || !name || !descriptionHTML || !descriptionMarkdown || !image) {
                resolve({ errCode: 1, message: 'Missing parameter!' });
            }
            let clinic = await db.Clinic.create({
                address: address,
                name: name,
                descriptionHTML: descriptionHTML,
                descriptionMarkdown: descriptionMarkdown,
                image: image,
            });

            let specialistMarkDown = await db.MarkDown.findOrCreate({
                where: { clinicId: clinic.id },
                defaults: {
                    contentHTML: data.descriptionHTML,
                    contentMarkDown: data.descriptionMarkdown,
                    description: data.description,
                    clinicId: data.clinicId,
                },
            });

            resolve({ errCode: 0, message: 'Create specialist successful' });
        } catch (e) {
            console.log(e);
            reject({ errCode: -1, message: 'Errow from server' });
        }
    });
};

let handleGetAllClinic = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                limit: +limit,
            });

            data = data.map((item) => {
                return { ...item, image: Buffer.from(item.image).toString('binary') };
            });
            // console.log(data);
            resolve({ errCode: 0, data });
        } catch (e) {
            console.log(e);
            reject({ errCode: -1, message: 'Errow from server' });
        }
    });
};

let getDoctorBelongToClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Doctor_infor.findAll({
                where: { clinicId: +id },
                include: [
                    {
                        model: db.User,
                        attributes: { exclude: ['password'] },
                        include: [
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
                    },
                    { model: db.MarkDown, attributes: { exclude: ['password'] } },
                ],
                raw: true,
                nest: true,
            });

            let AllCode = await db.Allcode.findAll();

            data = data.map((item) => {
                // let payment;
                // let price;
                // let province;
                if (item) {
                    let { paymentId, priceId, provinceId } = item;
                    item.payment = AllCode.find((item) => item.keyMap === paymentId);
                    item.price = AllCode.find((item) => item.keyMap === priceId);
                    item.province = AllCode.find((item) => item.keyMap === provinceId);
                }

                return { ...item, User: { ...item.User, image: Buffer.from(item.User.image).toString('binary') } };
            });

            resolve({ errCode: 0, data });
        } catch (e) {
            console.log(e);
            reject({ errCode: -1, message: 'Errow from server' });
        }
    });
};

let getClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findOne({
                where: { id: id },
            });

            data.image = Buffer.from(data.image).toString('binary');
            resolve({ errCode: 0, data });
        } catch (e) {
            console.log(e);
            reject({ errCode: -1, message: 'Errow from server' });
        }
    });
};

let getAllBooking = ({ id, date }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !date) {
                resolve({ errCode: 1, message: 'Missing parameter' });
            }

            // console.log(id, date);
            let data = await db.Booking.findAll({
                where: {
                    doctorId: +id,
                    date: date,
                },
                include: [
                    {
                        model: db.User,
                        attributes: { exclude: ['password'] },
                    },
                    {
                        model: db.Allcode,
                        attributes: { exclude: ['password'] },
                        as: 'time',
                    },
                    {
                        model: db.Allcode,
                        attributes: { exclude: ['password'] },
                        as: 'status',
                    },
                ],
                raw: true,
                nest: true,
            });

            resolve({ errCode: 0, data });
        } catch (e) {
            console.log(e);
            reject({ errCode: -1, message: 'Errow from server' });
        }
    });
};

let saveBookingStatus = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(data);
            if (data.id) {
                let booking = await db.Booking.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false,
                });

                if (data.statu === 'S3') {
                    booking.statuId = 'S3';
                } else booking.statuId = 'S4';

                await booking.save();
                resolve({ errCode: 0, data: booking });
            } else {
                resolve({ errCode: 1, message: 'Missing parameter' });
            }
        } catch (e) {
            console.log(e);
            reject({ errCode: -1, message: 'Errow from server' });
        }
    });
};
module.exports = {
    handleSaveClinic,
    saveBookingStatus,
    getAllBooking,
    handleGetAllClinic,
    getDoctorBelongToClinic,
    getClinic,
};
