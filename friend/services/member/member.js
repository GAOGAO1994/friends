const getAge = function(birthday){
	return new Date().getFullYear() - parseInt(birthday.substring(0,4));
}
const getCity = function(residence){
	if(!residence)return '';
	let a = residence.split(',');
	return a[1];
}
const getMaritalStatusName = function(maritalStatus){
	let status = {
		single:'未婚',
		divorced:'离婚',
		lose:'丧偶'
	}
	return status[maritalStatus];
}
const getCityAndCounty = function(residence){
	if(!residence)return '';
	let a = residence.split(',');
	return a[1]+'.'+a[2];
}
const getIndustry = function(work){
	if(!work)return '';
	return work.split(' ')[0];
}
const getPosition = function(work){
	if(!work)return '';
	return work.split(' ')[1];
}
const getConstellation = function(birthday){
	let m = parseInt(birthday.substring(5,7));
	let d = parseInt(birthday.substring(8,10));
	var s="摩羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手摩羯";
	var arr=[20,19,21,21,21,22,23,23,23,23,22,22];
	return s.substr(m*2-(d<arr[m-1]?2:0),2)+'座';
}
const getTags = function(member){
	let tags = [];
	tags.push({
		name:getConstellation(member.birthday)
	});
	if(member.incomeGrade> 2){
		tags.push({
			name:'高收入'
		});
	}
	if(member.education == '硕士' || member.education == '博士'){
		tags.push({
			name:'高学历'
		});
	}
	return tags;
}
const getVipStatus = function(member, sysDate){
	if(!member.vipExpiryDate){
		return 'non';
	}else{
		return (new Date(member.vipExpiryDate).getTime() >= new Date(sysDate.substring(0,10)).getTime())?'vip':'expiry';
	}
}
const inviteHandler = function(kind, members, data, activityId){
	let label = (kind == 'invite')?'邀请':'约见';
	let statusLabel = (kind == 'invite')?'邀请中':'邀约中';
	let obj = {}		//邀请
	if(data.invites){
		data.invites.forEach(invite => {
			obj[invite.targetMemberId] = invite;
		})
	}
	let sign = {};		//报名
	if(data.activityMembers){
		data.activityMembers.forEach(activityMember => {
			sign[activityMember.memberId] = activityMember;
		})
	}
	
	members.forEach(item => {
		item.vipStatus = getVipStatus(item, data.sysDate);
		item.age = getAge(item.birthday);
		item.city = getCity(item.residence);
		item.cityAndCounty = getCityAndCounty(item.residence);
		item.industry = getIndustry(item.work);
		item.position = getPosition(item.work);
		item.tags = getTags(item);
		if(obj[item.id]){
			item.inviteLabel = getInviteLabel(obj[item.id], item, label, statusLabel);
			item.inviteStatus = obj[item.id].inviteStatus;
		}else{
			item.inviteLabel = label+((item.sex == '女')?'她':'他');
		}
		//报名
		if(sign[item.id]){
			item.activityMember = sign[item.id];
		}
	});
	return members;
}
const getInviteLabel = function(invite, member, label, statusLabel){
	if(invite.inviteStatus == 'inviting'){
		return statusLabel;
	}else if(invite.inviteStatus == 'accept'){
		return '已接受';
	}else if(invite.inviteStatus == 'reject'){
		return '已拒绝';
	}else{
		return label+((member.sex == '女')?'她':'他');
	}
}


export default {
    getAge,
	getCity,
	getCityAndCounty,
	getMaritalStatusName,
	getConstellation,
	getTags,
	inviteHandler
}