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

    console.log(data);
    return res.status(200).json({
        ...data,
    });
};

let handleDeleteUserInfo = async (req, res) => {
    let response = await userService.deleteUserById(req.body.id);
    return res.status(200).json({
        ...response,
    });
};

let handleUpdateUser = async (req, res) => {
    let response = await userService.updateUserData(req.body);
    return res.status(200).json({
        ...response,
    });
};

module.exports = {
    handleLogin: handleLogin,
    handleGetUserInfo: handleGetUserInfo,
    handleCreateUser: handleCreateUser,
    handleDeleteUserInfo: handleDeleteUserInfo,
    handleUpdateUser: handleUpdateUser,
};
