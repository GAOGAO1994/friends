<template>
	<view>
		<view class="footer">
			<view v-for="(item,index) in tabBar.list" :class="'footer_item ' + (item.size=='big'?'big_item':'')  " :style="'width:'+item_width" @click="change_nav(index, item)" :key="index">
				<image :src="index==now_index?item.selectedIconPath:item.iconPath" mode=""></image>
				<view>{{item.text}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				"tabBar": {
				    "color": "#7a7e83",
				    "selectedColor": "#7558ff",
				    "backgroundColor": "#ffffff",
				    "list": [{
				        "pagePath": "pages/index/index",
				        "text": "首页",
						"code":"home",
				        "iconPath": "static/img/icons/icon-home.png",
				        "selectedIconPath": "static/img/icons/icon-home-selected.png"
				    }, {
				        "pagePath": "pages/svc/svc",
				        "text": "服务",
						"code":"svc",
				        "iconPath": "static/img/icons/icon-service.png",
				        "selectedIconPath": "static/img/icons/icon-service-selected.png"
				    }, {
				        "pagePath": "pages/blind/blind",
						"text": "阅见",
						"code":"blind",
				        "iconPath": "static/img/icons/yj.png",
				        "selectedIconPath": "static/img/icons/yj.png"
				    },{
				        "pagePath": "pages/message/message",
				        "text": "消息",
						"code":"message",
				        "iconPath": "static/img/icons/icon-message.png",
				        "selectedIconPath": "static/img/icons/icon-message-selected.png"
				    }, {
				        "pagePath": "pages/user/user",
				        "text": "我的",
						"code":"user",
				        "iconPath": "static/img/icons/icon-my.png",
				        "selectedIconPath": "static/img/icons/icon-my-selected.png"
				    }]
				},
				page_index:0,
			};
		},
		methods:{
			change_nav(index, item){
				this.page_index = index;
				this.$emit('change', item, index);
			}
		},
		computed:{
			item_width(){
				let length = this.tabBar.list.length;
				switch (length){
					case 1:
						return '100%'
						break;
					case 2:
						return '50%'
						break;
					case 3:
						return '33.3%'
						break;
					case 4:
						return '25%'
						break;
					case 5:
						return '20%'
						break;
					default:
						break;
				}
			},
			now_index(){
				return this.page_index;
			}
		}
	}
</script>

<style>
.footer{
	height: 120upx;
	
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #181E30;
	color: #fff;
	
}
.footer_item{
	float: left;
	width: 33.3%;
	text-align: center;
	font-size: 28upx;
	height: 120upx;
 
}
.footer_item image{
	width: 60upx;
	height: 60upx;
}
.footer_item.big_item{
	position: relative;
	top: -40upx;
}
.footer_item.big_item image{
	width: 100upx;
	height: 100upx;
}
</style>