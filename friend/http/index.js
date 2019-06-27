import Vue from 'vue'

// const contextPath = 'https://www.qswltech.com/friend-server/';
const contextPath = 'http://localhost:80/';
const h5Path = 'https://www.qswltech.com/h5/#/'
//const imgPath = 'https://qs-friend.oss-cn-shanghai.aliyuncs.com/';		//阿里oss
const imgPath = 'https://friend-1251032618.cos.ap-shanghai.myqcloud.com/';	//腾讯cos

const success = function (res, custom) {
	console.log(res);
	if(res.statusCode == 200){
		if(res.data.status == 0){
			if(!custom){
				uni.showToast({
					icon: 'none',
					title: (res.data.msg == '')?'未知错误，请稍后再试':res.data.msg,
					duration: 2000
				});
			}
			return false;
		}else{
			return true;
		}
	}else{
		if(!custom){
			uni.showToast({
				icon: 'none',
				title: '服务器内部，请稍后再试',
				duration: 2000
			});
		}
		return false;
	}
}

const fail = function(e){
	uni.showToast({
	    icon: 'none',
	    title: '网络错误，请稍后再试'
	});
}

export default {
	contextPath,
	h5Path,
	imgPath,
	success,
	fail
}
