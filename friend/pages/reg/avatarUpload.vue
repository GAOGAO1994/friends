<template>
	<view class="content">
		<view class="padding-h">			
			<view class="header">
				<text class="">{{operator=='new'?'上传':'修改'}}头像</text>
			</view>
			<view class="sub_title">
				<text>上传个人照片，给他/她一个美好的印象吧</text>
			</view>
			
			<view class="avatar-wrap">
				<view class="avatar-box" @click="pickPhoto">
					<image v-if="avatarUrl!=''" mode="scaleToFill" :src="avatarUrl"></image>
					<f-icon v-else type="add" color="#8F8F94" size="42"></f-icon>
				</view>
			</view>
			
			<view class="input-group">
				<view class="input-row border">
					<m-input class="m-input" type="text" v-model="nickname" placeholder="昵称"></m-input>
				</view>
			</view>
			
			<view class="btn-row">
				<button type="primary" class="primary" @tap="bindUpload">确定</button>
			</view>	
		</view>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input.vue'
	import { mapState, mapMutations } from 'vuex'
	
	export default {
		components: {mIcon, fIcon, mInput},
		data() {
			return{
				operator:'new',
				purpose:'',
				memberId:0,
				picked:false,
				avatarUrl:'',
				nickname:''
			}
		},
		computed: {
			...mapState(['account','redirect', 'target'])
		},
		methods:{
			...mapMutations(['saveAvatarUrl']),
			verify:function(){
				if (this.avatarUrl == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选取照片'
				    });
				    return;
				}
				if (this.nickname == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请输入昵称'
				    });
				    return;
				}
				return true;
			},
			bindUpload:function(){
				if(this.verify()){
					if(this.avatarUrl.startsWith('http')){
						//只更新昵称
						if(this.target.member.nickname == this.nickname){
							return;
						}else{
							this.modifyNickname();
						}
					}else{
						//更新昵称+头像
						this.doUpload();
					}
				}
			},
			modifyNickname:function(){
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'base/member/updateById',
					method: 'POST',
					data:{
						id:this.memberId,
						nickname:this.nickname
					},
					success: (res) => {
						if(that.$http.success(res)){
							that.target.member.nickname = that.nickname;
							that.saveAvatarUrl({
								id:that.memberId,
								nickname:that.nickname,
								avatarUrl:that.avatarUrl
							});
							uni.navigateBack();
						}
					}
				})
			},
			doUpload:function(){
				let that = this;
				uni.uploadFile({
					url: this.$http.contextPath + 'member/avatar/upload',
					filePath: that.avatarUrl,
					name: 'file',
					formData: {
						'name':'avatar',
						'memberId': this.memberId,
						'nickname': this.nickname
					},
					success: (res) => {
						if(that.$http.success(res)){
							let memberEntity = JSON.parse(res.data).data;
							that.saveAvatarUrl(memberEntity);
							if(that.operator == 'new'){
								//注册上传
								uni.showModal({
									title: '注册成功',
									content: '您已完成注册，您可以在‘我的’页面进一步完善资料，这样有助于提高成功机会。',
									showCancel:false,
									success: function (res) {
										if (res.confirm) {
											that.$croute.comeback(that.redirect);
										}
									}
								})
							}else{
								//修改头像
								that.target.member.nickname = memberEntity.nickname;
								that.target.member.avatarUrl = memberEntity.avatarUrl;
								uni.navigateBack();
							}
						}
					}
				});
			},
			pickPhoto:function(e){
				let that = this;
				 uni.chooseImage({
					count:1,
					success: (chooseImageRes) => {
						if(chooseImageRes.tempFiles[0].size > 1024*1024*5){
							uni.showToast({
								title:'图片大小限制5M'
							})
							return;
						}
						const tempFilePaths = chooseImageRes.tempFilePaths;
						that.avatarUrl = tempFilePaths[0];
						that.picked = true;
					}
				});
			}
		},
		onLoad(option) {
			this.memberId = option.memberId;
			this.purpose = option.purpose;
			if(option.operator && option.operator == 'modify'){//修改
				this.operator = option.operator;
				this.nickname = this.target.member.nickname;
				this.avatarUrl = this.target.member.avatarUrl;
			}else if(this.purpose == 'self' || this.purpose == 'everyone'){
				this.nickname = this.account.nickname;
			}
		}
	}
</script>

<style>
	.header text{
		color: black;
	}
	.sub_title{
		margin-top: 20upx;
		margin-bottom: 80upx;
	}
	.avatar-wrap{
		display: flex;
		justify-content: center;
		margin: 40upx 0;
	}
	.avatar-box{
		width: 260upx;
		height: 260upx;
		border-radius: 130upx;
		box-shadow: 0px 0px 30upx 5upx #dcdcdc;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.avatar-box image{
		width: 260upx;
		height: 260upx;
		border-radius: 130upx;
	}
	.m-input{
		
		
	}
	
</style>
