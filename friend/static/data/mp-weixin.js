let appid = 'wxd5d142d2a8575f18';
let secret = '826f2a536baa184e8ba665fc25e2d31f';
let openIdUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&grant_type=authorization_code'+'&js_code=';
let orderUrl = "https://www.qswltech.com/payment/wemarkday/mp/miniPay.do"; //统一下单						
export default{
	appid,
	secret,
	openIdUrl,
	orderUrl
}