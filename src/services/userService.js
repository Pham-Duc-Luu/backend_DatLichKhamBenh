var bcrypt = require('bcryptjs');
import db from '../models/index';

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
                attributes: ['email', 'password', 'roleId'],
            });

            user ? resolve(user) : resolve();
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
};