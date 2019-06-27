import Vue from 'vue'

const getType = function(result){
	if(result.url.indexOf('/pages/index/index') > -1 || result.url.indexOf('/pages/user/user') > -1 || result.url.indexOf('/pages/svc/svc') > -1 || result.url.indexOf('/pages/blind/blind') > -1 || result.url.indexOf('/pages/message/message') > -1){
		return "switchTab";
	}else if(result.fromUrl && result.fromUrl.indexOf('login') > -1){
		return "redirectTo";
	}else{
		return "navigateTo";
	}
}

//跳转
const navigate = function(result){
	if(result.url == '')return;
	if(!result.type || result.type ==''){
		result.type = getType(result);
	}
	if(result.type == 'navigateTo'){
		uni.navigateTo({
			url:result.url
		})
	}else if(result.type == 'switchTab'){
		uni.switchTab({
			url:result.url
		})
	}else if(result.type == 'redirectTo'){
		uni.redirectTo({
			url:result.url
		})
	}else if(result.type == 'reLaunch'){
		uni.reLaunch({
			url:result.url
		})
	}
}

//访问
const enter = function(result){
	if(result.isPass){
		navigate(result);
	}else{
		if(result.url.indexOf('login') > -1){
			if(result.loginType && result.loginType == 'navigateTo'){		//跳转登陆		
				uni.navigateTo({
					url:result.url
				})
			}else{											//弹出登陆		
				return true;
			}
		}else{
			navigate(result);
		}
	}
}

//返回
const comeback = function (url) {
	if(url == '/pages/index/index' || url == '/pages/user/user' || url == '/pages/blind/blind' || url == '/pages/svc/svc' || url == '/pages/message/message'){
		uni.switchTab({
			url:url
		})
	}else if(url){
		uni.redirectTo({
			url:url
		})
	}else{
		uni.navigateBack({})
	}
}

export default {
	enter,
	comeback
}
