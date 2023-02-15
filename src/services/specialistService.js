var bcrypt = require('bcryptjs');
import db from '../models/index';
import _, { reject } from 'lodash';
require('dotenv').config();

let handleSaveSpecialist = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { name, description, image, contentHTML, contentMarkDown } = data;

            if (!name || !description || !image || !contentHTML || !contentMarkDown) {
                resolve({ errCode: 1, message: 'Missing parameter!' });
            }
            let specialist = await db.Specialty.create({
                name: data.name,
                description: data.description,
                image: data.image,
            });

            let specialistMarkDown = await db.MarkDown.findOrCreate({
                where: { specialtyId: specialist.id },
                defaults: {
                    contentHTML: data.contentHTML,
                    contentMarkDown: data.contentMarkDown,
                    description: data.description,
                    specialtyId: data.specialtyId,
                },
            });

            resolve({ errCode: 0, message: 'Create specialist successful' });
        } catch (e) {
            console.log(e);
            reject({ errCode: -1, message: 'Errow from server' });
        }
    });
};

let getSpecialist = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                limit: +limit,
            });

            data = data.map((item) => {
                return { ...item, image: Buffer.from(item.image).toString('binary') };
            });
            // console.log(data);
            resolve({ errCode: 0, message: 'Create specialist successful', data });
        } catch (e) {
            console.log(e);
            reject({ errCode: -1, message: 'Errow from server' });
        }
    });
};

let getDoctorBelongToSpecialist = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Doctor_infor.findAll({
                where: { specialistId: +id },
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

module.exports = {
    handleSaveSpecialist,
    getSpecialist,
    getDoctorBelongToSpecialist,
};
