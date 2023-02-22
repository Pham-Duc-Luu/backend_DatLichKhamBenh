var bcrypt = require('bcryptjs');
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let existUser = await checkExistUser(email);
            // if the user is exist , return user, else return nothing

            if (existUser) {
                // check if the password is correct
                let correctPassword = bcrypt.compareSync(password, existUser.password);
                delete existUser.password;
                if (correctPassword) {
                    resolve({ errCode: 0, message: 'successful!', data: existUser });
                } else {
                    resolve({
                        errCode: 3,
                        message: 'the password is wrong',
                    });
                }
            } else {
                resolve({
                    errCode: 2,
                    message: "the email isn't exist",
                });
            }
        } catch (e) {
            reject();
        }
    });
};

let checkExistUser = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email },
                raw: true,
                attributes: ['email', 'password', 'lastName', 'roleId', 'positionId', 'id'],
            });

            user ? resolve(user) : resolve();
        } catch (e) {
            reject(e);
        }
    });
};

let handleGetUserInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'missing parameter',
                    userData,
                });
            } else {
                if (id.toLowerCase() === 'all') {
                    userData = await db.User.findAll({
                        attributes: { exclude: ['password'] },
                    });
                    resolve({
                        errCode: 0,
                        message: 'successful!',
                        userData,
                    });
                } else {
                    userData = await db.User.findOne({
                        where: { id: id },
                        attributes: { exclude: ['password'] },
                    });

                    !userData &&
                        resolve({
                            errCode: 2,
                            message: "the user isn't exist",
                            userData,
                        });

                    resolve({
                        errCode: 0,
                        message: 'successful!',
                        userData,
                    });
                }
            }

            // let userData = await db.User.
        } catch (e) {
            reject();
        }
    });
};

let createNewUser = (data) => {
    // console.log(data);
    return new Promise(async (resolve, reject) => {
        try {
            let existUser = await checkExistUser(data.email);
            // console.log(existUser);
            if (existUser) {
                resolve({
                    errCode: 2,
                    message: 'the email had existed',
                });
            } else {
                let hashPassword = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    image: data.image,
                    roleId: data.roleId,
                    positionId: data.positionId,
                });
            }

            resolve({
                errCode: 0,
                message: 'created new user',
            });
        } catch (e) {
            reject(e);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hash = await bcrypt.hashSync(password, salt);
            resolve(hash);
        } catch {
            reject();
        }
    });
};

let deleteUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
            });

            if (user) {
                await db.User.destroy({
                    where: { id },
                });
                resolve({ errCode: 0, message: 'deleted' });
            }
            resolve({ errCode: 1, message: 'User not found' });
        } catch (e) {
            reject(e);
        }
    });
};

let updateUserData = (data) => {
    // console.log(data);
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                data.email && (user.email = data.email);
                data.password && (user.password = data.password);
                data.firstName && (user.firstName = data.firstName);
                data.lastName && (user.lastName = data.lastName);
                data.address && (user.address = data.address);
                data.phoneNumber && (user.phoneNumber = data.phoneNumber);
                data.gender && (user.gender = data.gender);
                data.image && (user.image = data.image);
                data.roleId && (user.roleId = data.roleId);
                data.positionId && (user.positionId = data.positionId);

                await user.save();

                resolve({ errCode: 0, message: 'updated successful!' });
            } else {
                resolve({ errCode: 1, message: 'User not found' });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllcodeService = (type) => {
    // console.log(type);
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (type) {
                let res = await db.Allcode.findAll({
                    where: { type },
                });

                if (res.length === 0) {
                    data.data = res;
                    data.errCode = 2;
                } else {
                    // console.log(res)

                    data.data = res;
                    data.errCode = 0;
                }
            } else {
                data.errCode = 1;

                data.data = 'missing parameter!';
            }

            resolve(data);
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    handleGetUserInfo: handleGetUserInfo,
    createNewUser: createNewUser,
    deleteUserById,
    updateUserData,
    getAllcodeService,
};
