<template>
	<div class="mpvue-hobby">
		<div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
		<div class="mpvue-hobby-content" :class="{'mpvue-hobby-view-show':showPicker}">
			<div class="mpvue-hobby__hd" catchtouchmove="true">
				<div class="mpvue-hobby__action" @click="pickerCancel">取消</div>
				<div class="mpvue-hobby__action" :style="{color:themeColor}" @click="pickerConfirm">确定</div>
			</div>

			<picker-view class="mpvue-hobby-view" indicator-style="height: 40px;" :value="hobbyValue" @change="hobbyChange">
				<picker-view-column>
					<view class="hobby-item" v-for="(item,index) in hobbyKindsList" :key="index">{{item.label}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="hobby-item" v-for="(item,index) in hobbyDetailsList" :key="index">{{item.label}}</view>
				</picker-view-column>
			</picker-view>

		</div>
	</div>
</template>

<script>
	import hobbyKinds from './hobby-data/hobby-kinds.js';
	import hobbyDetals from './hobby-data/hobby-details.js';
	export default {
		name: 'mpvue-hobby',
		data() {
			return {
				showPicker: false,
				hobbyValue: [0, 0],
				hobbyKindsList: hobbyKinds,
				hobbyDetailsList: hobbyDetals[0],
			}
		},
		props: {
			hobbyValueDefault: {
				type: Array,
				dafault () {
					return [0, 0]
				}
			},
			themeColor: String,
		},
		created() {
			this.init();
			console.log(this.hobbyValueDefault);
		},
		methods: {
			init(){
				
				const hobbyValueDefault = this.hobbyValueDefault;
				this.hobbyKindsList = hobbyKinds;
				this.hobbyDetailsList = hobbyDetals[hobbyValueDefault[0]];
				this.hobbyValue = hobbyValueDefault;
			},
			
			maskClick() {
				this.pickerCancel();
			},
			show() {
				setTimeout(() => {
					this.showPicker = true;
				}, 0);
			},
			pickerCancel() {
				this.showPicker = false;

			},
			pickerConfirm() {
				this.showPicker = false;
				this._$emit('hobbyChange');
			},
			hobbyChange(e) {
				console.log(e.mp.detail.value);
				let changeHobbyList = e.mp.detail.value;
				if(this.hobbyValue[0] !== changeHobbyList[0]) {
					// 第一级滚动发生
					this.hobbyDetailsList = hobbyDetals[changeHobbyList[0]];
					changeHobbyList[1] = 0;
				}
				this.hobbyValue = changeHobbyList;
				// this._$emit('hobbyChange');
			},
			_$emit(emitName){
				let hobbyObj = {
					label: this._getLabel(),
					value: this.hobbyValue
				};
				this.$emit(emitName, hobbyObj);
			},
			_getLabel(){
				let hobbyLabel = this.hobbyKindsList[this.hobbyValue[0]].label+'-'+this.hobbyDetailsList[this.hobbyValue[1]].label;
				return hobbyLabel;
			},
		}
	};
</script>

<style>
	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.mpvue-hobby-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		/* 没有点击的时候，此时选择框在屏幕之外的地方 */
		transform: translateY(100%);
		z-index: 3000;
	}

	.mpvue-hobby-view-show {
		/* 点击展现时，从屏幕下方移入屏幕中 */
		transform: translateY(0);
	}

	.mpvue-hobby__hd {
		display: flex;
		padding: 9px 15px;
		background-color: white;
		position: relative;
		text-align: center;
		font-size: 17px;
	}

	.mpvue-hobby__hd:after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		/* 适配1px物理像素！！！！！ */
		transform-origin: 0, 100%;
		transform: scaleY(0.5);
	}

	.mpvue-hobby__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}

	.mpvue-hobby__action:first-child {
		text-align: left;
		color: #888;
	}

	.mpvue-hobby__action:last-child {
		text-align: right;
	}
	
	.mpvue-hobby-view {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 238px;
		background-color: rgba(255, 255, 255, 1);
	}
	.hobby-item {
		text-align: center;
		line-height: 40px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 16px;
	}
</style>
