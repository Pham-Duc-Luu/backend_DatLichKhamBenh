import db from '../models/index';
import CRUDservice from '../services/CRUDservice'

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()

        // console.log('-----------------');
        // console.log(data);
        // console.log('------------------');
        return res.render('homePage.ejs',{ data: JSON.stringify(data)});
    }
    catch(e) {
        console.log(e);
    }
}

let getCRUD = (req, res) =>{
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message =  await CRUDservice.createNewUser(req.body);
    // console.log(req.body);
    // console.log(message);
    return res.send('posted');
}
 
let displayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    // console.log(data);
    return res.render('displayGetCRUD.ejs', {data});
}

let editCRUD = async (req, res) =>  {
    let userId = req.query.id;

    if( userId) {
        let userData = await CRUDservice.getUserInfoById(userId);
        // console.log(userData);
        // send user data to view
        return  res.render('editCRUD.ejs', {userData});

    }
    else {

        return  res.send('user not found');
    }


}

let putCRUD = async (req, res) =>  {
    let data = req.body
    let allUser =  await CRUDservice.updateUserData(data)
    return res.render('displayGetCRUD.ejs', {data: allUser});
} 

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    let allUser =  await CRUDservice.deleteUserById(id);
    return res.render('displayGetCRUD.ejs', {data: allUser});


} 

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    editCRUD: editCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}