//const host = 'https://www.qswltech.com/friend-server/';
const host = 'http://localhost:80/';
const imgPath = 'https://qs-friend.oss-cn-shanghai.aliyuncs.com/';

const isSuccess = function (res) {
	if(res.data.code == 0){
		uni.showToast({
			title: '网络响应错误，请稍后再试',
			duration: 2000
		});
		return false;
	}else{
		return true;
	}
}

// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

const user = {};
const lastLoginTime = null;

const getUsers = function () {
    let ret = '';
    ret = uni.getStorageSync(USERS_KEY);
    if (!ret) {
        ret = '[]';
    }
    return JSON.parse(ret);
}

const addUser = function (userInfo) {
    let users = getUsers();
    users.push({
        account: userInfo.mobile,
        password: userInfo.password
    });
    uni.setStorageSync(USERS_KEY, JSON.stringify(users));
}

const cacheUser = function(userInfo){
	this.user = userInfo;
	this.lastLoginTime = new Date().getTime();
}

const isLogined = function () {
    return (this.lastLoginTime && new Date().getTime() - this.lastLoginTime < 1*60*60*1000)?true:false;
}

export default {
	host,
	imgPath,
	getUsers,
	addUser,
	cacheUser,
	isLogined,
	isSuccess
}

