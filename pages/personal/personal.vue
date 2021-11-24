<template>
	<view>
		<!-- 页面顶部的头像和昵称 -->
		<!-- 已登录样式 -->
		<block v-if="userInfo">
			<view class="person-top">
				<view class="person-picture">
					<image class="avatarUrl" :src="userInfo.avatarUrl" />
				</view>
				<view class="person-name">
					<text>{{userInfo.nickName}}</text>
				</view>
			</view>
			<!-- 收藏列表 /pages/collectList/collectList -->
			<navigator class="person-opt" url="/pages/collectList/collectList">
				<image class="col-img" src="/static/images/collectAct.png" />
				<text class="collection-text">收藏列表</text>
				<text class="right-arrows"></text>
			</navigator>
		</block>
		<!-- 未登录样式 -->
		<view class="person-top" v-else>
			<!-- 用按钮获取用户数据----------
					open-type="getUserInfo" 微信服务端开放能力	
					@getuserinfo="onGetUserInfo" 用户点击该按钮时，会返回获取到的用户信息
			 -->
			<button class="btn-login" open-type="getUserInfo" @getuserinfo="onGetUserInfo">
				<image class="avatarUrl" src="cloud://dianping-830xs.6469-dianping-830xs-1300966336/mdata/app/head.jpg" />
			</button>
			<view class="person-name">
				<text>点击登录</text>
			</view>
		</view>
	</view>
	
</template>

<script>
	/* globalData 全局变量 */
	let {globalData} = getApp();
	
	/**
	 * userInfo 用户信息
	 */
	export default {
		data() {
			return {
				userInfo:null
			};
		},
		/* 页面加载时，从全局获取用户信息，若用户信息存在，就更新到data*/
		onLoad(){
			const {userInfo}=globalData;
			if(userInfo){
				this.userInfo=userInfo;
			}
		},
		methods: {
			/**通过按钮获取用户信息，并更新到data和全局*/
			onGetUserInfo({detail:{userInfo}}) {
				this.userInfo=userInfo;
				globalData.userInfo=userInfo;
			},
			
		}
	};
</script>

<style>
	.person-top{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 24px;
		padding-bottom: 20px;
		background-color: #f2f9ff;
		border-bottom: 1px solid #ddd;
	}

	.btn-login {
		border: none;
		background: none;
		padding: 0;
		line-height: 0;
	}

	.btn-login::after {
		border: none;
	}
	.person-picture {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.person-opt {
		width: 750upx;
		height: 100upx;
		line-height: 100upx;
		border-bottom: 1px solid #ddd;
	}

	.avatarUrl {
		border-radius: 50%;
		width: 200upx;
		height: 200upx;
		border: 2px solid #fff;
	}

	.person-name {
		font-size: 30upx;
		margin-top: 18upx;
	}

	.right-arrows {
		width: 18upx;
		height: 18upx;
		display: block;
		rotate: 45deg;
		border-right: 1px solid;
		border-top: 1px solid;
		float: right;
		margin-top: 40upx;
		margin-right: 35upx;
	}
	.col-img{
		width: 32upx;
		height:32upx;
		margin-left: 30upx;
		margin-right: 14upx;
	}
</style>
