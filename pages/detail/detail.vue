<template>
	<view class="detail_container" v-if="shop">
		<view class="container_up">
			<!-- 店铺详情 -->
			<view class="detail_content">
				<!-- 店铺图片 -->
				<view class="imgContainer">
					<image :src="'cloud://dianping-830xs.6469-dianping-830xs-1300966336/'+shop.image_path"/>
				</view>
				<!-- 店铺简介 -->
				<view class="store">
					<view class="store_title">{{shop.title}}</view>
					<view class="store_price">
						<Star :score="shop.score"></Star>
						<text class="text-tiao">{{shop.view}}条 </text>
						<text class="text-price">￥{{shop.price}}/人</text>
					</view>
					<view class="store_taste">口味：{{shop.score}} 环境：{{shop.environment}} 服务：{{shop.service}}</view>
					<view class="store_type">{{shop.description}}</view>
				</view>
			</view>
			<!-- 店铺其它信息 -->
			<view class="local">
				<view class="content-show">
					<image src="/static/images/clock.png" /> 营业至21:00
					<image src="/static/images/wifi.png" /> WIFI
					<image src="/static/images/car.png" /> 停车场
					<image src="/static/images/more.png" />
				</view>
			</view>
			<!-- 店铺地址 -->
			<view class="position">
				<image src="/static/images/position.png" />
				<view class="text-content">
					<text class="text-pos">上地十街辉煌国际西6号楼低商1-2楼(地铁13号线西二旗A口西500米)</text>
				</view>
				<view class="phone-container">
					<image src="/static/images/phone.png" />
				</view>
			</view>
		</view>
		<!-- 分割线 -->
		<view class="line_gray"></view>
		<!-- 排名 -->
		<view class="rank">
			<image class="rank-img" src="/static/images/rank.png" />
			「上地小吃快餐热榜」 第1名
			<image class="rank-more" src="/static/images/more.png" />
		</view>
		<!-- 分割线 -->
		<view class="line_gray"></view>
		<!-- 团购 -->
		<view class="group-buying">
			<image class="group-buying-img" src="/static/images/group-buy.png" alt="团" />

			<view class="show-list-item">
				<image class="food-show" src="/static/images/eatPicture.png" />
				<view class="text-container">
					<text class="food-detail">
						单人商务套餐，提供免费WIFI
						<text>已售28</text>
					</text>
					<p>
						<text class="now-price">￥35</text>
						<text class="original-price">￥57</text>
					</p>
				</view>
			</view>

			<view class="show-list-item">
				<image class="food-show" src="/static/images/eatPicture.png" />
				<view class="text-container">
					<text class="food-detail">
						单人商务套餐，提供免费WIFI
						<text>已售28</text>
					</text>
					<p>
						<text class="now-price">￥35</text>
						<text class="original-price">￥57</text>
					</p>
				</view>
			</view>
			<view class="footer">
				<view @click="toggleCollect()">
					<image :src="collected?'/static/images/collect-active.png':'/static/images/collect.png'" /> 收藏
				</view>
				<view><image src="/static/images/remark.png" /> 写点评</view>
			</view>
		</view>
	</view>
</template>

<script>
	/* 星级组件 */
	import Star from "../../components/Star.vue";
	/* 数据库 */
	const db = wx.cloud.database();
	/* 全局对象 */
	const {globalData}=getApp();
	/* 当前店铺的id */
	let shopId=null;
	
	/**
	 * shop 店铺详细数据
	 * collected 是否已收藏，控制下方收藏图表的状态
	 */
	export default {
		data() {
			return {
				shop:null,
				collected: false,
				shopId:null
			};
		},
		/* 星级组件 */
		components: {Star},
		/**
		 * 页面加载时
		 * 	从回调参数中获取shopId
		 * 	getShopById() 根据商铺id 从热门店铺的集合里获取店铺
		 */
		onLoad({id}) {
			this.shopId = id;
			this.getShopById(id)
			.then((data)=>{
				console.log('店铺数据：',data);
				this.shop = data[0];
			});
		},
		/**
		 * 页面显示时
		 * 	updateCollect() 更新店铺收藏状态
		 */
		onShow(){
			this.updateCollect();
		},
		
		methods: {
			/**
			 * updateCollect() 若openid 存在，根据店铺id和openid在collect 集合中获取店铺数据
			 * 	db.collection() 从数据库中获取集合
			 * 		where({id,openid}) 查询条件
			 * 			get() 获取结果，返回结果为集合。集合为空，未收藏；否则，已收藏。
			 */
			updateCollect(){
				const openid = uni.getStorageSync('openid');
				db.collection('collect')
				.where({
					openid,
					id:this.shopId
				}).get({
					success:({data})=>{
						console.log('是否收藏：',data);
						this.collected = !!data.length;
					}
				})
			},
			/**
			 * toggleCollect() 店铺收藏和取消收藏的切换
			 * 	若openid和userInfo 都存在
			 * 		collect 集合中，切换数据的增删
			 * 			addCollect() 増
			 * 				db.collection() 从数据库中获取集合
			 * 				add({openid,id}) 增加记录
			 * 			delCollect() 删
			 * 				wx.cloud.callFunction({}) 调用微信云开发里的云函数
			 * 					name 函数名，如 delCollect
			 * 					data{openid,id} 根据data移除符合条件的记录
			 * 		data 中，切换collected 状态
			 * 	否则：showModal 模态框提示用户登录，点击确定，去往用户中心
			 * 			title 标题、content 内容、confirmText 确定、cancelText 取消、success 结果回调					
			 */
			toggleCollect() {
				const openid = uni.getStorageSync('openid');
				const userInfo = globalData.userInfo;
				if(userInfo&&openid){
					if(this.collected){
						this.delCollect(openid)
					}else{
						this.addCollect(openid)
					}
					this.collected = !this.collected;
				}else{
					this.showModal()
				}
			},
			/**
			 * 根据id获取shop数据
			 * 	集合名："favorList"
			 * 	查询条件：id:shopId
			 */
			getShopById(id){
				uni.showLoading({
					title:'数据加载中...'
				});
				return new Promise((resolve)=>{
					db.collection('favorLex')
					.where({
						id:id
					})
					.get({
						success:({data})=>{
							if(!data[0].image_path){
								data[0].image_path = 'mdata/img/404.jpg';
							}
							resolve(data);
						},
						complete:()=>{
							uni.hideLoading();
						}
					})
				});
			},
			/**
			 * addCollect() 増
			 * 	db.collection() 从数据库中获取集合，如 collect
			 * 	add({openid,id}) 增加记录
			 * 		data:{openid,id} 记录参数
			 */
			addCollect(openid){
				console.log('添加');
				db.collection('collect')
				.add({
					data:{openid,id:this.shopId}
				});
			},
			/**
			 * delCollect() 删
			 * 	wx.cloud.callFunction({}) 调用微信云开发里的云函数
			 * 		name 函数名，如 delCollect
			 * 		data{openid,id} 根据data移除符合条件的记录
			 */
			delCollect(openid){
				wx.cloud.callFunction({
					name:'delCollect',
					data:{openid,id:shopId}
				})
			},
			/* 模态框 */
			showModal(){
				uni.showModal({
					title:'收藏失败',
					content:'您还没有登录，请先登录',
					success:(res)=>{
						if(res.confirm){
							uni.navigateTo({
								url:'/pages/personal/personal'
							})
						}
					}
				})
			}
		}
	};
</script>

<style>
	.detail_container {
		display: flex;
		flex-direction: column;
		padding-top: 40upx;
		padding-bottom: 86upx;
	}

	.container_up {
		padding-left: 32upx;
		padding-right: 32upx;
	}

	.detail_content {
		display: flex;
		border-bottom: 1px solid #ddd;
		padding-bottom: 20upx;

	}

	.imgContainer {
		border: 1upx solid #ddd;
		padding: 1upx;
		border-radius: 15upx;
		margin-right: 32upx;
		height: 212upx;
	}

	.imgContainer image {
		width: 210upx;
		height: 210upx;
		border-radius: 15upx;
	}

	.store {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.store_title {
		font-weight: bold;
		font-size: 32upx;
	}

	.store_price {
		color: #7b7b7b;
		display: flex;
		flex-direction: row;
		height: 36upx;
		align-items: center;
	}

	.text-tiao {
		font-size: 24upx;
		padding-left: 15rpx;

	}

	.text-price {
		font-size: 26upx;
		font-weight: bold;
		padding-left: 15rpx;
		color: #ff6633;
	}

	.store_taste {
		font-size: 26upx;
		color: #868686;
		font-weight: 200;
	}

	.store_type {
		font-size: 26upx;
		color: #868686;
		font-weight: 200;
	}

	.content-show {
		border-bottom: 1px solid #ddd;
		font-size: 24upx;
	}

	.content-show image {
		width: 24upx;
		height: 24upx;
		padding-right: 12upx;
	}

	.content-show image:nth-child(2) {
		margin-left: 42upx;
	}

	.content-show image:nth-child(3) {
		margin-left: 42upx;
	}

	.content-show image:nth-child(4) {
		margin-left: 60upx;
	}

	.local {
		height: 103upx;
		display: block;
		line-height: 103upx;
	}

	.position {
		display: flex;
		flex-direction: row;
		margin-top: 24upx;
		margin-bottom: 24upx;
	}

	.position image {
		width: 42upx;
		height: 28upx;
		margin-top: 8upx;
		margin-right: 10upx;
	}

	.text-content {}

	.text-pos {
		font-size: 24upx;
		line-height: 32upx;
	}

	/* .text-content text {
  font-size: 30upx;
  color: #111111;
  font-weight: 200;
} */
	.phone-container {
		width: 96upx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		margin-top: 30upx;
		margin-left: 48upx;
		border-left: 1px solid #e1e1e1;
	}

	.phone-container image {
		width: 32upx;
		height: 35upx;
		padding-left: 24upx;
	}

	

	/* 小吃排行 */
	.rank {
		height: 110upx;
		width: 750upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 28upx;
	}

	.rank-img {
		width: 40upx;
		height: 40upx;
		margin-left: 28upx;
	}

	.rank-more {
		width: 17upx;
		height: 28upx;
		margin-left: 210upx;
	}

	/* 团列表 */
	.group-buying {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.group-buying-img {
		width: 40upx;
		height: 40upx;
		margin-left: 28upx;
		margin-top: 28upx;
		position: absolute;
	}

	/* 食物显示 */
	.food-show {
		width: 120upx;
		height: 120upx;
		border-radius: 15upx;
		margin-right: 21upx;
	}

	.show-list-item {
		display: flex;
		flex-direction: row;
		margin-left: 88upx;
		margin-top: 26upx;
		border-bottom: 1px solid #e1e1e1;
		padding-bottom: 17upx;

	}

	.food-detail {
		font-size: 24upx;
		color: #000;
		line-height: 48upx;

	}

	.now-price {
		font-size: 28upx;
		color: #ff6633;
		margin-right: 14upx;
		font-weight: bold;
	}

	.original-price {
		text-decoration: line-through;
		font-size: 24upx;
		color: #777777;
	}

	.text-container {}

	.food-detail text {
		margin-left: 40upx;
	}

	/* 底部样式 */
	.footer {
		display: flex;
		flex-direction: row;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 86upx;
		background: #fcfcfb;
		align-items: center;
		color: #707070;
	}

	.footer view {
		flex: 1;
		display: flex;
		justify-content: center;
		height: 34upx;
		font-size: 28upx;
	}

	.footer view:nth-child(1) {
		border-right: 1px solid;
	}

	.footer image {
		width: 34upx;
		height: 34upx;
		vertical-align: middle;
		margin-right: 10upx;
	}
</style>
