import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const all = {
	namespaced: true,
	state: {
		topActivities: [],	//首页显示的活动
		activities: []		//活动
	},
	getters: {
		
	},
	mutations: {
		topActivities(state, activities){
			state.topActivities = activities;
		},
		activities(state, activities){
			state.activities = activities;
		}
	}
}

const my = {
	namespaced: true,
	state: {  },
	mutations: {  },
	actions: {  },
	getters: {  }
}

const store = new Vuex.Store({
	
    modules: {
		all: all,
		my: my
	},
	state: {
		//访问来源
		shareFrom:{
			memberId:null,
			accountId:null
		},
		forcedLogin: false,	//是否需要强制登录
		hasLogin: false,
		account: null,		//登陆账号
		accounts: [],		//注册的账号
		// activities: [],		//已报名的活动ids
		redirect:'/pages/index/index',			//重新定向路由
		target:{
			activity:{},
			member:{},
			article:{}
		},
		//状态更新标识（时间戳）
		update:{
			hobby:0,				//我的兴趣爱好
			requirement:0			//我的择偶标准
		}
	},
	getters:{
		purposes: state => {
		  let purposes = [];
		  if(state.account == null || !state.account.purposes)return purposes;
		  else return state.account.purposes.split(',');
		},
		agentMember: state => {
			return (state.account&&state.account.agentMemberId)?state.account.member[state.account.agentMemberId]:{};
		},
		memberTags: state => (category) =>{
			return state.account.member[state.account.purpose][category];
		},
		signed:state => {
			let activities = state.all.topActivities.concat(state.all.activities);
			for(let activity in activities){
				for(let activityMember in activity.activityMemberList){
					if(activityMember.accountId == state.account.id){
						return true;
					}
				}
			}
			return false;
		},
		loginCheck:(state, getters) => (url, type) => {
			let result = {
				isPass:false,		//是否验证通过
				type:type,			//重新导航方式
				url:''				//重新导航地址	
			};
			state.redirect = url;
			if(state.hasLogin){
				//没有填写注册意图
				if(getters.purposes.length == 0){
					result.url = '/pages/blind/blind';
					result.type = 'switchTab';
					return result;
				}else{
					//没有上传头像
					for (let member of state.account.members) {
						if(!member.avatarUrl || member.avatarUrl == 'null' || member.avatarUrl == ''){
							result.url = '/pages/reg/avatarUpload?purpose='+member.purpose+'&memberId='+member.id;
							result.type = 'navigateTo';
							return result;
						}
					}
				}
				result.url = url;
				result.isPass = true;
			}else{
				result.url = '/pages/login/login';
				result.type = 'redirectTo';
			}
			return result;
		}
	},
	mutations: {
		saveShareFrom(state, obj){
			state.shareFrom = obj;
		},
		login(state, account) {
			if("mobile" == account.provider){
				for(let a of state.accounts){
					if(account.username == a.mobile && account.password == a.password){
						state.hasLogin = true;
						state.account = a;
					}
				}
			}else {
				for(let a of state.accounts){
					if(a.openId === account.openId){
						state.hasLogin = true;
						state.account = a;
					}
				}
			}
		},
		loginSuccess(state, account) {
			// console.log(account);
			state.hasLogin = true;
			state.account = account;
			account.member = {};
			account.members.forEach(item =>{
				account.member[item.id] = item;
			})
		},
		logout(state) {
			state.account = null;
			state.hasLogin = false;
		},
		register(state, account){
			state.accounts.push(account);
		},
		updateTime(state, attr){
			state.update[attr] = new Date().getTime();
		},
		sign(state, data){
			//首页活动列表
			for(let activity in state.all.topActivities){
				if(activity.id == data.activityId){
					activity.activityMemberList.splice(0, 0, data);
				}
			}
			//活动页活动列表
			for(let activity in state.all.activities){
				if(activity.id == data.activityId){
					activity.activityMemberList.splice(0, 0, data);
				}
			}
		},
		redirect(state, url){
			state.redirect = url;
		},
		saveMember(state, member){
			if(!state.account.member){
				state.account.member = {};
			}
			state.account.agentMemberId = member.id;
			state.account.member[member.id] = member;
			state.account.members.push(member);
			//更新默认意图
			state.account.purpose = member.purpose;
			if(state.account.purposes && state.account.purposes.indexOf(member.purpose) < 0){
				state.account.purposes += ',' + member.purpose;
			}else{
				state.account.purposes = member.purpose;
			}
		},
		// savePurpose(state, purpose){
		// 	if(state.account.purposes && state.account.purposes.indexOf(purpose) < 0){
		// 		state.account.purposes += ',' + purpose;
		// 	}else{
		// 		state.account.purposes = purpose;
		// 	}
		// 	//更新默认意图
		// 	state.account.purpose = purpose;
		// },
		changeAgentMember(state, member){			//更新默认代理会员
			state.account.agentMemberId = member.id;
		},
		saveAvatarUrl(state, member){
			state.account.nickname = member.nickname;
			state.account.member[member.id].avatarUrl = member.avatarUrl;
		},
		targetActivity(state, activity){
			state.target.activity = activity;
		},
		targetMember(state, member){
			state.target.member = member;
		},
		targetArticle(state, article){
			state.target.article = article;
		},
		saveSlogan(state, data){
			state.account.member[data.purpose].slogan = data.value;
		},
		saveMemberFiled(state, data){
			state.account.member[data.purpose][data.filed] = data.value;
		},
		saveMemberFileds(state, data){
			data.fileds.forEach(item =>{
				state.account.member[data.purpose][item.filed] = item.value;
			});
			
		},
		saveMemberTags(state, obj){
			state.account.member[state.account.purpose][obj.category] = obj.datas;
			let data = {
				...state.update
			};
			data[obj.category] = new Date().getTime();
			state.update = data;
		}
	}
})

export default store
