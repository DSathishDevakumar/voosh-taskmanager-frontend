const LIVE = false
const LIVEURL = LIVE ? "https://voosh-backend-5vxz.onrender.com/" : "http://localhost:4001/";
const ROOTURL = LIVEURL + 'api/v1/';
const FILEURL = LIVE ? "https://voosh-backend-5vxz.onrender.com" : "http://localhost:4001";
const API = {
    login: ROOTURL + 'account/login',

    addUser: ROOTURL + 'user/addUser',
    getUser: ROOTURL + 'user/getUser',
    updateUser: ROOTURL + 'user/updateUser',

    addTask: ROOTURL + 'task/addTask',
    editTask: ROOTURL + 'task/editTask',
    softDeleteTask: ROOTURL + 'task/softDeleteTask',
    getTask: ROOTURL + 'task/getTask',
    updateTasksOrder: ROOTURL + 'task/updateTasksOrder',
}


const ImportedURL = {
    API: API,
    LIVEURL: LIVEURL,
    FILEURL: FILEURL
}
export default ImportedURL;
