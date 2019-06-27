<script>
    export default {
        onLaunch: function() {
            console.log('App Launch');
        },
        onShow: function() {
            console.log('App Show');
        },
        onHide: function() {
            console.log('App Hide');
        }
    }
</script>

<style>
    /*每个页面公共css */
    /* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
    body,
    page {
        min-height: 100%;
        display: flex;
    }

    /* #ifdef MP-BAIDU */
    page {
        width: 100%;
        height: 100%;
        display: block;
    }

    swan-template {
        width: 100%;
        min-height: 100%;
        display: flex;
    }

    /* #endif */

    .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        /* background-color: #efeff4; */
		background-color: #ffffff;
		font-size: 14px;
    }
	
	.padding{
		padding: 40upx;
	}
	.padding-h{
		padding: 0 40upx;
	}
	.padding-l{
		padding-left: 40upx;
	}
	.padding-r{
		padding-right: 40upx;
	}
	.header{
		/* #ifndef H5 */
		margin-top: 100upx;
		/* #endif */
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.header-margin-top{
		margin-top: 120upx;
	}
	.header text{
		color: black;
	}
	.black{
		color: black;
	}
	.label{
		color: #8F8F94;
	}
	
	.margin{
		margin: 40upx;
	}
	.margin-top{
		margin-top: 40upx;
	}

    .input-group {
        background-color: #ffffff;
        margin-top: 0upx;
        position: relative;
    }

    .input-group.border::before {
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        height: 1upx;
        content: '';
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        background-color: #c8c7cc;
    }

    .input-group.border::after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 1upx;
        content: '';
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        background-color: #c8c7cc;
    }

    .input-row {
        display: flex;
        flex-direction: row;
        position: relative;
    }

    .input-row .title {
        height: 50upx;
        min-height: 50upx;
        padding: 15upx 0;
        padding-left: 20upx;
        line-height: 50upx;
		text-align: left;
    }

    .input-row.border::after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0upx;
        height: 1upx;
        content: '';
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        background-color: #c8c7cc;
    }

    .btn-row {
        margin-top: 50upx;
        padding: 20upx;
    }

    button.primary {
        color: white;
		border-radius: 50upx;
        background: linear-gradient(to bottom, #ae74ff, #7558ff); /* 标准的语法 */
		/* box-shadow: 0 0 10upx #7558ff; */
    }
	button.outline {
		border-radius: 50upx;
	    background: white;
		border: 1px solid #C8C7CC;
	}
	button.male {
	    color: white;
		font-size:14px;
		border-radius: 80upx;
	    background: linear-gradient(to bottom, #ae74ff, #7558ff); /* 标准的语法 */
		/* box-shadow: 0px 0px 10px #ae74ff; */
		height: 70upx;
		line-height: 70upx;
		display: flex;
		align-items: center;
		padding: 0 50upx;
	}
	button.female {
		color: white;
		font-size:14px;
	    border-radius: 80upx;
	    background: linear-gradient(to bottom, #fe8dc8, #fc597b); /* 标准的语法 */
	    /* box-shadow: 0px 0px 10px #fe8dc8; */
	    height: 70upx;
	    line-height: 70upx;
	    display: flex;
	    align-items: center;
	    padding: 0 50upx;
	}
	/* button.male-disable {
	    background: linear-gradient(to bottom, #d9c5e6, #c3a7e2);
	}
	button.female-disable {
	    background: linear-gradient(to bottom, #fca0c9, #ff9cb2);
	} */
	button.disabled {
		color: #999999;
	}
	
	text.primary{
		color: #7558ff;
	}
	.more {
		color: #8F8F94;
	}
	.gray {
		color: #8F8F94;
	}
	.header{
		padding: 40upx 0;
	}
	.header text{
		font-size: 25px;
		font-weight: 900;
	}

	.name-male{
		font-size: 20px;
		font-weight: 900;
		background: linear-gradient(to right, #00c0ff, #7558ff); /* 标准的语法 */
	    -webkit-background-clip: text;
	    color: transparent;
	}
	.name-female{
		font-size: 20px;
		font-weight: 900;
		background: linear-gradient(to right, #ff527f, #7558ff); /* 标准的语法 */
	    -webkit-background-clip: text;
	    color: transparent;
	}
	
	.nav-back-wrap{
		width: 100%;
		position: relative;
	}
	.nav-back-wrap image{
		width: 100%;
		max-height: 500upx;
	}
	.nav-back-wrap .icon-back{
		position: fixed;
		left: 20upx;
		top: 60upx;
		z-index: 100;
	}
	
	.line{
		width:100%;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.under-line{
		position: relative;
		width: 100%;
		height: 16px;
	}
	.under-line .text {
		color:#8F8F94;
		position: absolute;
		width:280upx;
		left: 0;
		right: 0;
		top: 0;
		background-color: #FFFFFF;
		margin: auto;
		text-align: center;
	}
	.under-line .split{
		position: absolute;
		width:100%;
		height: 1upx;
		left: 0;
		top: 6px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	
	.empty{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 200upx;
	}
	.empty image{
		width: 361upx;
		height:309upx;
	}
	.empty text{
		margin-top: 20upx;
	}
</style>
