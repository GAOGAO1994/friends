<template>
	<div class="mpvue-tags">
		<div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
		<div class="mpvue-tags-content" :class="{'mpvue-tags-view-show':showPicker}">
			<div class="mpvue-tags__hd" catchtouchmove="true">
				<div class="mpvue-tags__action" @click="tagsCancel">取消</div>
				<div class="mpvue-tags__action" :style="{color:themeColor}" @click="tagsConfirm">确定</div>
			</div>
			
			<scroll-view scroll-y="true" class="scroll-Y">
				<div class="mpvue-body-content">
				<div class="tags-items" v-for="(item, index) in tagsItem" :class="{'tags-item-picked': pickItems.indexOf(index) >= 0 } "
				@click="picked(index)" :key="index">{{item}}</div>
                   <!-- <div class="tags-items" v-for="(item, index) in tagsItem" :class="{'tags-item-picked': pickItems[index]} "
                    @click="picked(index)" :key="index">{{item}}</div> -->
             
				</div>
			</scroll-view>
		</div>
	
	</div>
</template>

<script>
	import Vue from 'vue'
	import tagsItem from './tagsitem.js';
	
	
	export default {
		data(){
			return{
				showPicker: false, //是否显示选择菜单
				tagsItem: tagsItem, // 从文件中读取的所有选择项
				// pickItems: Array(tagsItem.length),
				pickItems: [], // 选中项，在所有项目数组中的位置，用于切换选中样式
				tagsPicked:[], // 选中的标签项数组
				indexNum: 0, // 相中的项目数量，用于控制不可超过3项
				pickItemsDefault: [], // 用于使选中项下标数组，恢复之前的设置
			}
		},
		
		props:{
			themeColor: String,
			tagsValueDefault: Array,
		},
		methods:{
			deepCopy(copyTemplate){
				return JSON.parse(JSON.stringify(copyTemplate));
			},
			show(){
				setTimeout(() => {
					this.showPicker = true;
				}, 0);
				
				console.log(this.pickItems);
				// 清除默认的下标数组
				 this.pickItemsDefault = [];
				 // 设置未改变时的选中项下标数组
				 if (this.tagsValueDefault.length > 0) {
				 	this.tagsValueDefault.forEach(item =>{
				 		let n = this.tagsItem.indexOf(item);
				 		this.pickItemsDefault.push(n);
					});
				 }
				// 
				
			 	// ！！！！！！！非常重要的深拷贝、浅拷贝问题！！！！！
			 	// 数组不能直接赋值，因为是存储在同一片堆内存中，改变一处，左右的都会受影响！！！一定要注意
			 	this.tagsPicked = this.deepCopy(this.tagsValueDefault);
			 	this.pickItems = this.deepCopy(this.pickItemsDefault);
			 	this.indexNum = this.tagsPicked.length;
			 	// console.log('从文件中读取的所有可选择标签：',this.tagsItem);
		 
			 	console.log('从self中传入的选中标签列表',this.tagsPicked);
			 	console.log('默认的选中项列表',this.pickItemsDefault);
			 	console.log('默认的选中数量',this.indexNum);
			},
			
			// 取消操作
			tagsCancel(){
				this.showPicker = false;
				// 取消时，设置当前的选中样式下标，为改变前的默认下标列表
				this.pickItems = this.deepCopy(this.pickItemsDefault);
				// 取消时，设置当前的选中项数组为改变前的选中项
				this.tagsPicked = this.deepCopy(this.tagsValueDefault);
				// 选中数量，调整为改变前的数量
				this.indexNum = this.tagsPicked.length;
				
				console.log('取消了：','下标数组：',this.pickItems,'选中数组：', this.tagsPicked,'选中数量：',this.indexNum);
			},
			
			// 提交操作
			tagsConfirm(){
				this.showPicker = false;
				// 当提交时，设置此时的默认样式列表，改变为选中的列表
				// this.pickItemsDefault = this.pickItems;
				console.log('提交了');
				this.$emit('tagsChange',this.tagsPicked);
			},
			
			// 点击外侧区域，默认为取消处理
			maskClick(){
				// this.showPicker = false;
				this.tagsCancel();
			},
			
			// 选择标签操作
			picked(index){
				

				// 
				//  this.$set(this.pickItems, index, true);
				//  Vue.set(this.pickItems, index, true);
			 	
				// 选中数量自增
				this.indexNum++;
				// 判断当前下标数组中是否已经存在被选中的项目
				let n = this.pickItems.indexOf(index);
				if(n>=0){
					// 若是存在，则需要清除下标数组对应项
					this.pickItems.splice(n, 1);
					// 此时数量要减去2，因为要多清除一次自增
					this.indexNum -= 2;
					
					// 清除标签数组对应项
					let num = this.tagsPicked.indexOf(this.tagsItem[index]);
					if(num >= 0){
						this.tagsPicked.splice(num, 1);
					}
					console.log('删除标签成功：',this.pickItems,this.indexNum,this.tagsPicked);
				}else {
				// 没有选中项则需要进行添加，首先判断添加数量是否超过添加限制
					if(this.indexNum > 3) {
						// 减去一次自增
						this.indexNum--;
						// 给出提示框
						uni.showToast({
							icon: "none",
							title:'最多可选3个',
							duration: 1000
						});
						// 不再执行后续添加操作
						return;
					}
				
					this.pickItems.push(index);
					this.tagsPicked.push(this.tagsItem[index]);
					console.log('添加成功：',this.tagsPicked,this.indexNum,this.pickItems);
				}
				
				console.log('添加or删除的结果：',this.pickItems, this.tagsPicked, this.indexNum);
			}
		},
		
	}
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
	
	.mpvue-tags-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		/* 没有点击的时候，此时选择框在屏幕之外的地方 */
		transform: translateY(100%);
		z-index: 3000;
	}
	
	.mpvue-tags-view-show {
		/* 点击展现时，从屏幕下方移入屏幕中 */
		transform: translateY(0);
	}
	
	.mpvue-tags__hd {
		display: flex;
		padding: 9px 15px;
		background-color: white;
		position: relative;
		text-align: center;
		font-size: 17px;
	}
	
	.mpvue-tags__hd:after {
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
	
	.mpvue-tags__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}
	
	.mpvue-tags__action:first-child {
		text-align: left;
		color: #888;
	}
	
	.mpvue-tags__action:last-child {
		text-align: right;
	}
	
	.scroll-Y {
		height: 238px;
	}
	.mpvue-body-content {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 1);
		box-sizing: border-box;
		padding: 10px;
	}
	.tags-items {
		min-width: 30px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		padding: 0 10px;
		border-radius: 30px;
		font-size: 16px;
		border: rgba(0, 0, 0, 0.3) solid 1px;
		color: #333333;
		margin: 10px 10px 0 0;
		transition: all 0.3s ease; 
	}
	.tags-item-picked {
		background: #007AFF;
		border: #007AFF solid 1px;
		color: white;
		font-weight: 400;
	}
</style>
