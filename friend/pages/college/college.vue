<template>
	<view class="content">
		<!-- #ifndef H5 -->
		<view class="padding-h">			
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="black" size="30"></m-icon>
				</navigator>
			</view>
		</view>
		<!-- #endif -->
		<view class="header">
			<view class="left">
				<image mode="scaleToFill" src="../../static/img/icons/yj.png"></image>
				<text class="text">情商学院</text>
			</view>
			<image class="right" mode="widthFix" :src="bg"></image>
		</view>
		
		<view class="padding-h">
			<view class="tag-wrap">
				<view class="tag-scroll-wrap">
					<scroll-view class="tag-scroll" scroll-x="true" scroll-left="0">
						<view class="tag label" v-for="(tag, index) in tags" :class="(index == tagIndex)?'tag-selected':'lable'" @click="bindTag(index)">
							<text>{{tag.name}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
			
			<!-- 恋爱学院 -->
			<view v-if="tagIndex == 0">
				<view class="anchor-wrap">
					<view class="anchor-scroll-wrap">
						<scroll-view class="anchor-scroll" scroll-x="true" scroll-left="0">
							<view class="anchor" v-for="(anchor, index) in anchors" @click="bindAnchor('love', index)">
								<image mode="scaleToFill" :src="(loveIndex == index)?anchor.iconSelected:anchor.icon"></image>
								<text :class="{selected:loveIndex == index}">{{anchor.name}}</text>
							</view>
						</scroll-view>
					</view>
				</view>
				
				<!-- 开办初衷 -->
				<view class="question-wrap" v-if="loveIndex == 0">
					<view class="card-wrap">
						<text>恋爱学院</text>
						<text>是你大学毕业后去的第一站</text>
						<text>是你感到最温暖的社群</text>
						<text>是您交友成长最好的邂逅</text>
						<text>恋爱学院 —— 让交友变得自然而然。</text>
						<image mode="scaleToFill" src="../../static/img/icons/icon-yj-outline.png"></image>
					</view>
					
					<view class="title-wrap">
						<text>为什么举办恋爱学院？</text>
					</view>
					
					<view class="common-text">
						<text>经调查数据显示：以结婚为目的，到适婚年龄的单身男女，第一次约见愿意再相处的40%左右，后面双方还有第二次联系的20%左右，保持关系一个月左右的5%不到，能持续到结婚领证的1%都不到。</text>
					</view>
					<view class="common-text margin-top">
						<text>许多单身朋友约见无数、盲目约见，却很少有结果，即使结婚了、也是闪婚闪离，经历一段婚姻又恢复单身身份。</text>
					</view>
					<view class="common-text margin-top">
						<text>中国离婚率已达到56%左右，平均两对结婚同时就有一对离婚，数据惊人。 </text>
					</view>
					<view class="common-text margin-top">
						<text>有许多单身朋友看见周边的朋友结婚后又离婚，过得不幸福，对婚姻充满了恐惧。 </text>
					</view>
					
					<view class="cause-wrap">
						<text class="why-text">是什么原因导致如此低的</text>
						<text class="why-text">牵手成功率和高离婚率呢？</text>
						<text class="why-text">从心理状态归纳，原因有以下三点：</text>
						<view class="blue-card-wrap">
							<text class="tag">无明</text>
							<text>不知道自己是谁？不知道自己想找什么样的对象？不知道恋爱和婚姻能让我们成长？不知道如何成长？</text>
						</view>
						<image mode="scaleToFill" src="../../static/img/why.png"></image>
					</view>
					
					<view class="blue-card-wrap">
						<text class="tag">无爱</text>
						<text>对自己和他人的评判很多，对婚姻有许多限制性思维，很难有好感觉，很难爱上一个人。都不愿主动，不愿给予。大家不懂爱，感觉不到爱，不会爱。</text>
					</view>
					
					<view class="blue-card-wrap">
						<text class="tag">无力</text>
						<text>生活感觉无趣乏味、有无力感，很难将一段恋情或婚姻持续到底。 </text>
					</view>
					
					<view class="common-text margin-top">
						<text>谈恋爱的过程其实是一个人了解自己、爱上自己，自我成长最好的过程。 </text>
					</view>
					
					<view class="common-text margin-top">
						<text>恋爱对象是折射我们内在最清澈的镜子，当你明了这一点、你会感恩每个有缘和你约见的异性朋友，因为他/它是来帮助你越来越了解自己，是上帝送给我们成长最好的礼物。</text>
					</view>
				</view>
				
				<!-- 学院收获 -->
				<view v-if="loveIndex == 1">
					<view class="title-wrap">
						<text>在恋爱学院能收获什么？</text>
					</view>
					
					<view class="aim-card-wrap" v-for="love in loveGains" :class="love.cardClass">
						<view class="card"></view>
						<view class="wrap">
							<text>{{love.name}}</text>
							<image :class="love.imageClass" mode="scaleToFill" :src="love.image"></image>
						</view>
					</view>
					
					<view class="content-card">
						<text class="title">提高情商，事业爱情双丰收</text>
						<view class="wrap">
							<view class="item">
								<view class="circle">
									<f-icon type="tick" size="18" color="#6d5eb3"></f-icon>
								</view>
								<text>学会主宰自己的情绪</text>
							</view>
							<view class="item">
								<view class="circle">
									<f-icon type="tick" size="18" color="#6d5eb3"></f-icon>
								</view>
								<text>学会有效沟通</text>
							</view>
							<view class="item">
								<view class="circle">
									<f-icon type="tick" size="18" color="#6d5eb3"></f-icon>
								</view>
								<text>男女性别能量归位</text>
							</view>
							<view class="item">
								<view class="circle">
									<f-icon type="tick" size="18" color="#6d5eb3"></f-icon>
								</view>
								<text>爱自己、爱他人的能力</text>
							</view>
							<view class="item">
								<view class="circle">
									<f-icon type="tick" size="18" color="#6d5eb3"></f-icon>
								</view>
								<text>自信绽放</text>
							</view>
							<view class="item">
								<view class="circle">
									<f-icon type="tick" size="18" color="#6d5eb3"></f-icon>
								</view>
								<text>事业爱情双兼顾保持动态平衡</text>
							</view>
						</view>
					</view>
					
					<view class="report-wrap">
						<view class="title-wrap">
							<text>恋爱学院已知成果报告</text>
						</view>
						
						<view class="report">
							<view class="left">
								<view class="circle">
									<image mode="scaleToFill" src="../../static/img/icons/icon-college-report2.png"></image>
								</view>
							</view>
							<view class="right">
								<text class="title">自信绽放</text>
								<text class="sub-title">持续参加恋爱学院的单身朋友一个个自信绽放，成功吸引到爱情。</text>
							</view>
						</view>
						
						<view class="report">
							<view class="left">
								<view class="circle">
									<image mode="scaleToFill" src="../../static/img/icons/icon-college-report3.png"></image>
								</view>
							</view>
							<view class="right">
								<text class="title">牵手率大于95%</text>
								<text class="sub-title">恋爱学院的牵手率95%以上。</text>
							</view>
						</view>
						
						<view class="report">
							<view class="left">
								<view class="circle">
									<image mode="scaleToFill" src="../../static/img/icons/icon-college-report4.png"></image>
								</view>
							</view>
							<view class="right">
								<text class="title">人际关系圆满</text>
								<text class="sub-title">恋爱学院的学员们不仅收获爱情，事业、健康、财富、人际关系都越来越圆满。</text>
							</view>
						</view>
						
						<view class="report">
							<view class="left">
								<view class="circle">
									<image mode="scaleToFill" src="../../static/img/icons/icon-college-report1.png"></image>
								</view>
							</view>
							<view class="right">
								<text class="title">走入婚姻</text>
								<text class="sub-title">参加过恋爱工作坊并坚持觉察的单身朋友见1-2个就可以走到婚姻。</text>
							</view>
						</view>
					</view>
					
					
				</view>
				
				<!-- 课程设置 -->
				<view v-if="loveIndex == 2">
					<view class="title-wrap">
						<text>恋爱学院班级设置</text>
					</view>
					
					<!-- <view class="class-wrap">
						<view class="class-scroll-wrap">
							<scroll-view class="class-scroll" scroll-x="true" scroll-left="0">
								<view class="class" v-for="(loveClass, index) in loveClasses" :class="{'margin-right':index < loveClasses.length-1}" @click="bindClass('love', index)">
									<text :class="{selected:loveClassIndex == index}">{{loveClass}}</text>
									<view v-if="loveClassIndex == index" class="under-line"></view>
								</view>
							</scroll-view>
						</view>
					</view> -->
					
					<view class="course-wrap">
						<text class="sub-title">个人成长</text>
						<view class="row">
							<text class="course">会员班</text>
							<text class="time primary">40节课/年</text>
						</view>
						<view class="row">
							<text class="course">恋爱导师班</text>
							<text class="time primary">2天</text>
						</view>
						<view class="row">
							<text class="course">恋爱私教班</text>
							<text class="time primary">2天</text>
						</view>
					</view>
					<view class="course-wrap">
						<text class="sub-title">恋爱工作坊</text>
						<view class="row">
							<text class="course">单人/双人</text>
						</view>
					</view>
					<view class="course-wrap">
						<text class="sub-title">导师培训班</text>
						<view class="row">
							<text class="course">初阶（助教老师）</text>
							<text class="time primary">2天</text>
						</view>
						<view class="row">
							<text class="course">中阶（沙龙老师）</text>
							<text class="time primary">2天</text>
						</view>
						<view class="row">
							<text class="course">高阶（工作坊老师）</text>
							<text class="time primary">2天</text>
						</view>
					</view>
					
					<view class="title-wrap">
						<text>恋爱学院招生要求</text>
					</view>
					
					<view class="common-text">
						<text>恋爱学院会分年龄段开班，按90年代，80年代，70年代，60年代以及学历高低分别分班。（ 40人/班 ）</text>
					</view>
					<view class="blue-card-wrap margin-top">
						<!-- <text class="tag">报名</text> -->
						<view class="item">
							<text class="primary">报名要求：</text>
							<text class="text">适婚单身男女</text>
						</view>
						<view class="item">
							<text class="primary">上课时间：</text>
							<text class="text">每周六晚18:30-20:30</text>
						</view>
						<view class="item">
							<text class="primary">学院地址：</text>
							<text class="text">中山东路288号新世纪广场B座1126室</text>
						</view>
						<view class="item">
							<text class="primary">咨询热线：</text>
							<text class="text">18913827410</text>
						</view>
					</view>
					
				</view>
			</view>
			
			<!-- 幸福学院 -->
			<view v-if="tagIndex == 1">
				<view class="anchor-wrap">
					<view class="anchor-scroll-wrap">
						<scroll-view class="anchor-scroll" scroll-x="true" scroll-left="0">
							<view class="anchor" v-for="(anchor, index) in anchors" @click="bindAnchor('happiness', index)">
								<image mode="scaleToFill" :src="(happinessIndex == index)?anchor.iconSelected:anchor.icon"></image>
								<text :class="{selected:happinessIndex == index}">{{anchor.name}}</text>
							</view>
						</scroll-view>
					</view>
				</view>
				
				<!-- 开办初衷 -->
				<view class="question-wrap" v-if="happinessIndex == 0">
					<view class="card-wrap">
						<text>幸福学院 —— 使你成为一个幸福人。</text>
						<text>引领家庭的幸福</text>
						<text>引领客户的幸福</text>
						<text>引领社会的幸福</text>
						<text>幸福学院，还是一份事业，一个温暖的社团。</text>
						<image mode="scaleToFill" src="../../static/img/icons/icon-yj-outline.png"></image>
					</view>
					
					<view class="title-wrap">
						<text>为什么举办幸福学院？</text>
					</view>
					
					<view class="common-text">
						<text>现实生活中，56%的高离婚率，亲密关系，亲子关系、婆媳关系出现了问题或危机，生意越来越不好做，客户引流难的问题，事业发展遇到了瓶颈，中产阶级收入骤降，恐惧和焦虑成了大家的共同情绪体。</text>
					</view>
					
					<view class="happiness-image-wrap">
						<image mode="scaleToFill" :src="happinessImages[0]"></image>
					</view>
					
					<view class="common-text">
						<text>大家常常感觉不到快乐和幸福。</text>
						<text>外在的追求无止境，外在的丰盛并没有带来内心的安宁与富足，快乐早已不再纯粹。</text>
						<text>关系也不再纯粹，总是热情在前，产品在后，多少次上当和后悔，对于人的信任度越来越低。</text>
					</view>
					
					<view class="common-text margin-top">
						<text class="emphasize">幸福是每位家人最初和最后的归宿。为了提高大家的幸福度，关系变得越来越纯粹，快乐纯粹，相互真诚的给予帮助，资源达到真正的共享。</text>
					</view>
					
					<view class="common-text margin-top">
						<text class="emphasize">我们开办了幸福学院，帮助每位家人找到幸福，感到幸福，培养幸福导师，带领大家引领幸福。</text>
					</view>
					
				</view>	
				
				<!-- 学院收获 -->
				<view v-if="happinessIndex == 1">
					<view class="title-wrap">
						<text>在幸福学院能收获什么？</text>
					</view>
					
					<view class="aim-card-wrap" v-for="happiness in happinessGains" :class="happiness.cardClass">
						<view class="card"></view>
						<view class="wrap">
							<text>{{happiness.name}}</text>
							<image :class="happiness.imageClass" mode="scaleToFill" :src="happiness.image"></image>
						</view>
					</view>
				</view>
				
				<!-- 课程目录 -->
				<view v-if="happinessIndex == 2">
					
					<view class="title-wrap">
						<text>幸福学院课程设置</text>
					</view>
					
					<view class="course-wrap">
						<text class="sub-title">个人成长</text>
						<view class="row">
							<text class="course">会员</text>
							<text class="time primary">40节课/年</text>
						</view>
						<view class="row">
							<text class="course">工作坊</text>
							<text class="time primary">2天</text>
						</view>
					</view>
					<view class="course-wrap">
						<text class="sub-title">幸福工作坊</text>
						<view class="row">
							<text class="course">单人</text>
						</view>
						<view class="row">
							<text class="course">夫妻同修</text>
							<text class="time primary">2天</text>
						</view>
					</view>
					<view class="course-wrap">
						<text class="sub-title">导师培训班</text>
						<view class="row">
							<text class="course">初阶（助教老师）</text>
							<text class="time primary">2天</text>
						</view>
						<view class="row">
							<text class="course">中阶（沙龙老师）</text>
							<text class="time primary">2天</text>
						</view>
						<view class="row">
							<text class="course">高阶（工作坊老师）</text>
							<text class="time primary">2天</text>
						</view>
					</view>
					
					<view class="title-wrap">
						<text>幸福学院招生要求</text>
					</view>
					<view class="common-text">
						<text>幸福学院面向全体单身或已婚希望追求幸福生活的人士。（ 40人/班 ）</text>
					</view>
					<view class="blue-card-wrap margin-top">
						<!-- <text class="tag">报名</text> -->
						<view class="item">
							<text class="primary">报名要求：</text>
							<text class="text">单身或已婚男女</text>
						</view>
						<view class="item">
							<text class="primary">上课时间：</text>
							<text class="text">每周六晚18:30-20:30</text>
						</view>
						<view class="item">
							<text class="primary">学院地址：</text>
							<text class="text">中山东路288号新世纪广场B座1126室</text>
						</view>
						<view class="item">
							<text class="primary">咨询热线：</text>
							<text class="text">18913827410</text>
						</view>
					</view>
					
				</view>
			</view>
			
		</view>
			
		
		
		<view class="bottom-bar-wrap">
			<view class="bottom-bar">
				<view class="bar-box">
					<!--  -->
					<!--  #ifdef  MP-WEIXIN -->
					<view class="item">
						<button open-type="contact"><f-icon type="consult" color="#7558ff" size="30"></f-icon>咨询</button>
					</view>
					<!--  #endif -->
					<!--  #ifndef  MP-WEIXIN -->
					<view class="item " @click="consult">
						<f-icon type="consult" color="#7558ff" size="30"></f-icon>
						<text>在线咨询</text>
					</view>
					<!--  #endif -->
					
					<!-- <view class="item">
						<button open-type="share"><f-icon type="share" color="#7558ff" size="30"></f-icon>分享</button>
					</view> -->
					<view class="item button">
						<view class="button-wrap" @click="signUp">
							<image mode="widthFix" src="../../static/img/icons/bird.png"></image>
							<text>我要报名</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar-block"></view>
		<enroll title="情商学院" subTitle="收获幸福从情商学习开始" :show="enrollOpen" @close="closeEnroll"></enroll>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import enroll from '@/components/enroll/enroll.vue';
	import {mapMutations} from 'vuex'
	
	export default {
		components: {mIcon,fIcon,enroll},
		data() {
			return{
				enrollOpen:false,
				bg:this.$http.imgPath + "manage/college-bg.png",
				loveGains:[{
					cardClass:'aim-card-1',
					imageClass:'love-1',
					name:'结交朋友的机会，结交异性的机会',
					image:this.$http.imgPath + "manage/college-love-1.png"
				},{
					cardClass:'aim-card-2',
					imageClass:'love-2',
					name:'学会自我觉察，了解自己',
					image:this.$http.imgPath + "manage/college-love-2.png"
				},{
					cardClass:'aim-card-2',
					imageClass:'love-3',
					name:'学习恋商（撩妹撩哥技巧）',
					image:this.$http.imgPath + "manage/college-love-3.png"
				},{
					cardClass:'aim-card-2',
					imageClass:'love-4',
					name:'学会穿衣打扮，形体、礼仪培养',
					image:this.$http.imgPath + "manage/college-love-4.png"
				}],
				happinessImages:[
					this.$http.imgPath + "manage/college-happiness-1.png"
				],
				happinessGains:[{
					cardClass:'happiness-card-1',
					imageClass:'happiness-1',
					name:'了悟幸福、感到幸福',
					image:this.$http.imgPath + "manage/college-happiness-21.png"
				},{
					cardClass:'happiness-card-2',
					imageClass:'happiness-2',
					name:'了解自己是谁，爱自己，做自己的主宰',
					image:this.$http.imgPath + "manage/college-happiness-22.png"
				},{
					cardClass:'happiness-card-3',
					imageClass:'happiness-3',
					name:'爱他人的能力',
					image:this.$http.imgPath + "manage/college-happiness-23.png"
				},{
					cardClass:'happiness-card-4',
					imageClass:'happiness-4',
					name:'做一个幸福引领者 您可以成为一名恋爱学院或幸福学院的导师',
					image:this.$http.imgPath + "manage/college-happiness-24.png"
				},{
					cardClass:'happiness-card-5',
					imageClass:'happiness-5',
					name:'事业的扶持，资源的共享',
					image:this.$http.imgPath + "manage/college-happiness-25.png"
				},{
					cardClass:'happiness-card-6',
					imageClass:'happiness-6',
					name:'成为代理红娘，拥有一份自己的事业',
					image:this.$http.imgPath + "manage/college-happiness-26.png"
				}],
				tagIndex:0,
				tags:[{
					name:'恋爱学院'
				},{
					name:'幸福学院'
				}],
				loveIndex:0,
				happinessIndex:0,
				anchors:[{
					name:'开办初衷',
					icon:'../../static/img/icons/icon-question.png',
					iconSelected:'../../static/img/icons/icon-question-selected.png'
				},{
					name:'学院收获',
					icon:'../../static/img/icons/icon-aim.png',
					iconSelected:'../../static/img/icons/icon-aim-selected.png'
				},{
					name:'课程目录',
					icon:'../../static/img/icons/icon-book.png',
					iconSelected:'../../static/img/icons/icon-book-selected.png'
				}],
				loveClassIndex:0,
				loveClasses:['会员班','工作坊','导师班']
			}
		},
		computed: {
			
		},
		methods:{
			closeEnroll:function(){
				this.enrollOpen = false;
			},
			bindTag:function(index){
				this.tagIndex = index;
			},
			bindAnchor:function(tag, index){
				if(tag == 'love'){
					this.loveIndex = index;
				}else if(tag == 'happiness'){
					this.happinessIndex = index;
				}
			},
			bindClass:function(tag, index){
				if(tag == 'love'){
					this.loveClassIndex = index;
				}else if(tag == 'happiness'){
					// this.happinessClassIndex = index;
				}
			},
			signUp:function(){
				this.enrollOpen = true;
// 				uni.showModal({
// 					title:'情商学院报名',
// 					content: '等待明确内容和流程',
// 					confirmText:'确定',
// 					cancelText:'取消',
// 					success: function (res) {
// 						if (res.confirm) {
// 							
// 						} else if (res.cancel) {
// 							
// 						}
// 					}
// 				})
			},
			consult:function(){
				uni.navigateTo({
					url: '/pages/form/kefu'
				});
			}
		},
		onLoad(option) {
			
		},
		onShareAppMessage(res) {
			if (res.from === 'button' || res.from === 'menu') {// 来自页面内分享按钮
			    return {
			      title: '"阅见"情商学院',
			      imageUrl:this.$http.imgPath + 'manage/xqh1.png',
			      path: '/pages/college/college'
			    }
			}
		}
	}
</script>

<style>
	.content{
		width: 100%;
	}
	.header{
		padding:0;
	}
	.header .left{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
	}
	.header .left image{
		width:175upx;
		height:137upx;
	}
	.header .left .text{
		font-size: 24px;
		font-weight: 900;
		margin-top: 40upx;
	}
	.header .right{
		width: 430upx;
		max-height: 500upx;
	}
	.header .right text{
		font-size:18px;
	}
	
	.tag-wrap{
		margin-bottom: 60upx;
	}
	.tag-scroll-wrap{
	
	}
	.tag-scroll{
		width: 100%;
		display: flex;
		white-space: nowrap;
	}
	.tag-scroll .tag{
		margin-right: 20upx;
		padding: 15upx 20upx;
		display: inline-flex;
		width: 25%;
		justify-content: center;
		font-size: 16px;
		font-weight: 900;
	}
	.tag-selected{
		border-radius: 60upx;
		background-color: #ded4ff;
		color: #7667a5;
	}
	
	.anchor-wrap{
		margin-bottom: 40upx;
	}
	.anchor-scroll-wrap{
	
	}
	.anchor-scroll{
		width: 100%;
		display: flex;
		white-space: nowrap;
		justify-content: center;
	}
	.anchor-scroll .anchor{
		margin-right: 40upx;
		display: inline-flex;
		justify-content: center;
	}
	.anchor-scroll .anchor image{
		width: 54upx;
		height: 54upx;
	}
	.anchor-scroll .anchor text{
		font-size: 16px;
		margin-left: 10upx;
	}
	.anchor-scroll .anchor .selected{
		font-weight: 900;
	}
	
	.question-wrap .card-wrap{
		border-radius: 15upx;
		background-color: #eeeeee;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20upx 0;
		padding-left: 60upx;
	}
	.question-wrap .card-wrap image{
		width: 145upx;
		height:222upx;
		position: absolute;
		right: 10upx;
		bottom: 10upx;
	}
	.question-wrap .card-wrap text{
		margin: 10upx 0;
	}
	
	.title-wrap{
		height: 145upx;
		margin-top: 60upx;
		margin-bottom: 40upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: url(../../static/img/icons/icon-yj-blue.png) center no-repeat;
		background-size: 100upx 145upx;
	}
	.title-wrap text{
		font-size: 20px;
		color: #6d5eb3;
		font-weight: 900;
	}
	
	.course-wrap{
		margin-top: 60upx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.course-wrap .sub-title{
		font-size: 16px;
		font-weight: 900;
	}
	.course-wrap .row{
		margin-top: 20upx;
		display: flex;
	}
	.course-wrap .row .time{
		margin-left: 10upx;
	}
	
	.common-text{
		display: flex;
		flex-direction: column;
	}
	.common-text text{
		line-height: 24px;
	}
	.common-text .emphasize{
		color: #6d5eb3;
		font-weight: 900;
	}
	
	.cause-wrap{
		margin-top: 80upx;
		position: relative;
		display: flex;
		flex-direction: column;
	}
	.cause-wrap .why-text{
		color: #6d5eb3;
		line-height: 24px;
		font-weight: 900;
	}
	.cause-wrap image{
		position: absolute;
		top: 0;
		right:0;
		width: 220upx;
		height: 258upx;
	}
	.blue-card-wrap{
		padding: 40upx;
		margin-top: 15upx;
		border-radius: 15upx;
		background-color: #ebe7ff;
		display: flex;
		flex-direction: column;
	}
	.blue-card-wrap .tag{
		margin-bottom: 40upx;
		color: white;
		font-size: 32px;
		font-weight: 900;
		text-shadow:5upx 5upx 5upx #ab9dea;
	}
	.blue-card-wrap text{
		line-height: 24px;
	}
	.blue-card-wrap .item{
		display: flex;
		line-height: 38px;
		justify-content: flex-start;
	}
	.blue-card-wrap .item .primary{
		color: #6d5eb3;
		font-weight: 900;
		width: 80px;
	}
	.blue-card-wrap .item .text{
		align-self: flex-start;
	}
	
	.aim-card-wrap{
		position: relative;
	}
	.aim-card-1{
		height: 520upx;
	}
	.aim-card-2{
		height: 480upx;
	}
	.aim-card-wrap .card{
		height: 350upx;
		border-radius: 15upx;
		background-color: #ebe7ff;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
	}
	.aim-card-wrap .wrap{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.aim-card-wrap .wrap text{
		margin: 40upx 40upx;
		color: white;
		line-height: 32px;
		font-size: 18px;
		font-weight: 900;
		text-align: center;
		text-shadow:5upx 5upx 5upx #ab9dea;
	}
	.aim-card-wrap .love-1{
		width: 450upx;
		height: 355upx;
	}
	.aim-card-wrap .love-2{
		width: 450upx;
		height: 296upx;
	}
	.aim-card-wrap .love-3{
		width: 400upx;
		height: 296upx;
	}
	.aim-card-wrap .love-4{
		width: 450upx;
		height: 273upx;
	}
	.happiness-card-1{
		height: 500upx;
	}
	.happiness-card-2{
		height: 620upx;
	}
	.happiness-card-3{
		height: 430upx;
	}
	.happiness-card-4{
		height: 520upx;
	}
	.happiness-card-5{
		height: 480upx;
	}
	.happiness-card-6{
		height: 460upx;
	}
	.aim-card-wrap .happiness-1{
		width: 349upx;
		height: 315upx;
	}
	.aim-card-wrap .happiness-2{
		width: 371upx;
		height: 364upx;
	}
	.aim-card-wrap .happiness-3{
		width: 403upx;
		height: 233upx;
	}
	.aim-card-wrap .happiness-4{
		width: 236upx;
		height: 267upx;
	}
	.aim-card-wrap .happiness-5{
		width: 353upx;
		height: 296upx;
	}
	.aim-card-wrap .happiness-6{
		width: 363upx;
		height: 281upx;
	}
	
	.content-card{
		border-radius: 15upx;
		background-color: #ebe7ff;
		display: flex;
		flex-direction: column;
		padding: 40upx;
	}
	.content-card .title{
		align-self: center;
		color: white;
		font-size: 18px;
		font-weight: 900;
		text-shadow:5upx 5upx 5upx #ab9dea;
	}
	.content-card .wrap{
		margin-top: 60upx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.content-card .wrap .item{
		margin-right: 20upx;
		margin-top: 20upx;
		border-radius: 50upx;
		background-color: #6d5eb3;
		padding: 15upx;
		display: flex;
	}
	.content-card .wrap .item .circle{
		width: 42upx;
		height: 42upx;
		border-radius: 21upx;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.content-card .wrap .item text{
		color: white;
		margin: 0 20upx;
	}
	
	.report-wrap{
		
	}
	.report{
		display: flex;
		margin-top: 60upx;
	}
	.report .left{
		display: flex;
	}
	.report .right{
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		padding-left: 25upx;
	}
	.report .left .circle{
		width:100upx;
		height:100upx;
		border-radius: 50upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #6d5eb3;
	}
	.report .left .circle image{
		width:75upx;
		height:75upx;
	}
	.report .right .title{
		color: #6d5eb3;
		font-weight: 900;
		font-size: 18px;
	}
	.report .right .sub-title{
		margin-top: 15upx;
		line-height: 24px;
	}
	
	.happiness-image-wrap{
		display: flex;
		justify-content: center;
	}
	.happiness-image-wrap image{
		width:518upx;
		height:503upx;
		margin: 40upx 0;
	}
	
	.class-wrap{
		width: 100%;
		margin-bottom: 40upx;
		display: flex;
		justify-content: center;
	}
	.class-scroll{
		display: flex;
		white-space: nowrap;
		justify-content: center;
	}
	.class-scroll .class{
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.class-scroll .margin-right{
		margin-right: 60upx;
	}
	.class-scroll .class text{
		font-size: 16px;
		margin-left: 10upx;
	}
	.class-scroll .class .selected{
		font-weight: 900;
	}
	.class-scroll .under-line{
		height:5upx;
		background-color: #6d5eb3;
		margin-top: 10upx;
	}
	
	.bottom-bar-block{
		height: 200upx;
		align-items: flex-end;
	}
	
	.bottom-bar-wrap{
		width: 100%;
		position:fixed;
		left: 0;
		bottom: 0;
		height: 120upx;
		background-color: white;
		box-shadow: 0px -2px 30px 2px #f8f8f8;
		z-index: 100;
	}
	
	.bottom-bar{
		position:fixed;
		left: 40upx;
		right: 40upx;
		bottom: 0;
		height: 120upx;
		display: flex;
		flex-direction: row;
	}
	.bottom-bar .bar-box{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	
	.bottom-bar .bar-box .item{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
	}
	.bottom-bar .bar-box .item text{
		margin-left: 10upx;
	}
	.bottom-bar .bar-box .item button{
		background-color: white;
		font-size: 14px;
		display: flex;
		align-items: center;
	}
	.bottom-bar .bar-box .item button::after{ 
		border: none;
	}
	.bottom-bar .bar-box .button{
		justify-content: flex-end;
	}
	
	.bottom-bar .button-wrap{
		border-radius: 50upx;
		background: linear-gradient(to bottom, #ae74ff, #7558ff); /* 标准的语法 */
		box-shadow: 0px 0px 10px #7558ff;
		height: 80upx;
		line-height: 80upx;
		display: flex;
		align-items: center;
		padding: 0 50upx;
	}
	.bottom-bar .button-wrap image{
		width: 60upx;
	}
	.bottom-bar .button-wrap text{
		color: white;
		font-weight: normal;
	}
	
</style>
