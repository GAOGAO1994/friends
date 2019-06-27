/**************************************时间格式化处理************************************/
const formart = function (fmt,date) { 
    var o = {   
		"M+" : date.getMonth()+1,                 //月份   
		"d+" : date.getDate(),                    //日   
		"h+" : date.getHours(),                   //小时   
		"m+" : date.getMinutes(),                 //分   
		"s+" : date.getSeconds(),                 //秒   
		"q+" : Math.floor((date.getMonth()+3)/3), //季度   
		"S"  : date.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
		fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
		if(new RegExp("("+ k +")").test(fmt))   
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	return fmt;   
}

const getDay = function getDay(value) {
	if (value == "") {
		return;
	} else {
		let days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
		return days[new Date(value).getDay()];
	}	
}

export default {
    formart,
	getDay
}