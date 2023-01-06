import userService from '../services/userService';

let handleLogin = async (req, res) => {
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    // console.log(user);
    if (!userEmail || !userPassword) {
        return res.status(500).json({
            errCode: 1,
            message: 'missing parameter',
        });
    } else {
        let userApi = await userService.handleUserLogin(userEmail, userPassword);
        if (userApi) {
            return res.status(200).json({
                ...userApi,
            });
        } else {
            return res.status(500).json({
                ...userApi,
            });
        }
    }

    return res.status(200).json({
        message: 'calling api',
    });
};

let handleGetUserInfo = async (req, res) => {
    let userId = req.query.id;

    let data = await userService.handleGetUserInfo(userId);

    return res.status(200).json({
        ...data,
    });
};

let handleCreateUser = async (req, res) => {
    let data = await userService.createNewUser(req.body);

    // console.log(data);
    return res.status(200).json({
        ...data,
    });
};

let handleDeleteUserInfo = async (req, res) => {
    // console.log(req);

    if (req.body.id) {
        let response = await userService.deleteUserById(req.body.id);
        return res.status(200).json({
            ...response,
        });
    } else {
        return res.status(200).json({
            errCode: 1,
            message: 'missing parameter',
        });
    }
};

let handleUpdateUser = async (req, res) => {
    let response = await userService.updateUserData(req.body);
    return res.status(200).json({
        ...response,
    });
};

let getAllcode = async (req, res) => {
    try {
        // console.log(req.query);
        let type = req.query.type;

        let data = await userService.getAllcodeService(type);

        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Errow from server',
        });
    }
};

module.exports = {
    handleLogin: handleLogin,
    handleGetUserInfo: handleGetUserInfo,
    handleCreateUser: handleCreateUser,
    handleDeleteUserInfo: handleDeleteUserInfo,
    handleUpdateUser: handleUpdateUser,
    getAllcode,
};
