<template>
	<view class="content">
		<!-- 地区选择和个人中心 -->
		<view class="title_content">
			<!-- 点击跳转城市页city?address
					address 当前的城市位置 
			 -->
			<navigator class="area_name" url="../city/city">
				{{address}}
			</navigator>
			<image class="downIcon" src="/static/images/down.png" />
			<!-- 点击跳转用户中心页 personal -->
			<navigator class="people" url="/pages/personal/personal">
				<image class="people-img" src="/static/images/people.png" />
			</navigator>
		</view>
		<!-- 目录 -->
		<view class="menu_content">
			<view class="menu_item">
				<image src="/static/images/eat.png" />
				<text>美食</text>
			</view>
			<view class="menu_item">
				<image src="/static/images/ktv.png" />
				<text>KTV</text>
			</view>
			<view class="menu_item">
				<image src="/static/images/foot.png" />
				<text>足疗/按摩</text>
			</view>
			<view class="menu_item">
				<image src="/static/images/hotel.png" />
				<text>酒店</text>
			</view>
			<view class="menu_item">
				<image src="/static/images/improve.png" />
				<text>丽人/美发</text>
			</view>
		</view>
		<!-- 灰线 -->
		<view class="line_gray"></view>
		<!-- 
			ShopList 猜你喜欢
				title 标题,"猜你喜欢"
				:list 商铺列表
				:loading 数据是否加载中
		 -->
		<ShopList title="猜你喜欢" :list="shops" :loading="loading"></ShopList>

	</view>
</template>

<script>
	/* 引入ShopList 店铺列表组件 */
	import ShopList from '../../components/ShopList.vue'

	/* QQMapWX 引入腾讯地图SDK，qqmap-wx-jssdk.js */
	import QQMapWX from '../../utils/qqmap-wx-jssdk.js'

	/* 百度地图 */
	import bmap from '../../utils/bmap-wx.min.js'

	/**
	 * 实例化腾讯地图 https://lbs.qq.com/dev/console/key/manage
	 * 	key 秘钥
	 */
	const map = new QQMapWX({
		key: 'LNJBZ-6NZKP-5LCDZ-LYPAP-FOQIJ-UUB4C'
	})

	var BMap = new bmap.BMapWX({
		ak: 'cs0CSQenrxn198myYyoDIfwNBXZITnWX'
	});

	/* wx.cloud.database() 获取当前云环境的数据库 */
	const db = wx.cloud.database();

	/* getApp()获取全局变量{globalData} */
	const {
		globalData
	} = getApp();

	export default {
		/* 数据
			address 当前地址,默认'加载中……'
			shops 店铺列表，默认[]
			loading 是否正在加载，默认false
			page 当前页，用于上拉加载，默认0
		 */
		data() {
			return {
				address: '加载中…',
				shops: [],
				loading: false,
				page: 0,
				loadOff: true,
			};
		},
		/* 组件 */
		components: {
			ShopList
		},
		/**
		 * 页面加载Î
		 * 	getUserInfo() 尝试使用js 获取用户信息
		 * 		将获取结果更新到全局
		 * 	从本地获取openid		
		 * 		若openid 不存在
		 * 			getOpenidByFn()获取openid 并存储到本地
		 */
		onLoad() {
			// this.getUserInfo()
			// 	.then((userInfo) => {
			// 		console.log(userInfo)
			// 		if (userInfo) {
			// 			globalData.userInfo = userInfo;
			// 		} else {
			// 			uni.showModal({
			// 				title:'请先登录!'
			// 			})
			// 		}
			// 	});

			const openid = uni.getStorageSync('openid');
			if (!openid) {
				this.getOpenid()
					.then((openid) => {
						uni.setStorageSync('openid', openid);
					});
			}
		},

		/**
		 * 页面显示 
		 * 	获取全局数据里的地址address
		 * 	若地址存在
		 * 		更新address 数据
		 * 		shops 置空
		 * 		page 归零
		 * 		updateShops() 更新店铺列表
		 * 	若地址不存在
		 * 		getLocation() 获取当前位置
		 * 			then() 解构经纬度latitude,longitude，返回analysis() 反解析经纬度后的地址
		 * 			then() 
		 * 				更新address 数据
		 * 				将address写入全局
		 * 				updateShops更新店铺列表
		 */
		onShow() {
			this.getLocation()
				.then(res => {
					this.getPostion(res)
						.then(city => {
							console.log(city)
							this.address = city;
							globalData.address = city;
			
							if(this.shops.length == 0){
								this.getShops()
									.then(data => {
										console.log(data);
										this.shops = data;
									});
							}
						});
				});
		},

		/**
		 * 上拉加载
		 * 	updateShops更新店铺列表
		 */
		onReachBottom() {
			this.loadOff && this.updateShops();
		},

		methods: {
			/**
			* 通过js 方法获取用户信息，保存到全局
			* 	getSetting() 获取用户授权
			* 		authSetting['scope.userInfo'] 用户信息授权
			* 			uni.getUserInfo() 获取用户信息{userInfo}
				https://uniapp.dcloud.io/api/other/setting?id=getsetting
				https://uniapp.dcloud.io/api/plugins/login?id=getuserinfo
			*/
			getUserInfo() {

			},
			/**
			 * 通过云函数获取openid，缓存到本地
			 * 	wx.cloud.callFunction({}) 请求云函数
			 * 		name 函数名，login
			 * 		success 成功回调
			 * 		fail 失败回调
			 */
			getOpenid() {
				return new Promise((resolve, reject) => {
					wx.cloud.callFunction({
						name: "login",
						success: ({
							result: {
								openid
							}
						}) => {
							console.log(openid, 'openid');
							resolve(openid);
						},
						fail: err => {
							console.log(err)
							reject(err);
						},
						complete: () => {
							resolve();
						}
					})
				})
			},
			/* uni.getLocation() 获取当前经纬度
				https://uniapp.dcloud.io/api/location/location
			 */
			getLocation() {
				return new Promise((resolve, reject) => {
					uni.getLocation({
						success(res) {
							// console.log(res);
							resolve(res);
						},
						fail(err) {
							console.log(err)
							reject(err)
						},
						complete(res) {
							reject(res)
						}
					})
				})
			},
			/**
			 * map.reverseGeocoder({}) 反解析经纬度
			 * 	location{latitude,longitude} 经纬度
			 * 	success 成功回调
			 * 		获取城市 result.result.address_component.city
			 * 		https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
			 */
			getPostion({
				latitude,
				longitude
			}) {

				// var success = function(data) { 
				// 	console.log('百度地图',data);
				// } 
				return new Promise((resolve, reject) => {

					// BMap.regeocoding({
					// 	success: success
					// }); 

					map.reverseGeocoder({
						location: {
							latitude,
							longitude
						},
						success: ({
							result: {
								address_component: {
									city
								}
							}
						}) => {
							resolve(city);
						},
						fail(err) {
							console.log(err)
							reject(err)
						},
						complete(res) {
							reject(res)
						}
					})
				});
			},
			/**
			 * 更新店铺列表
			 * 	this.getShops() 获取店铺列表
			 * 		parseShops(res)解析店铺列表
			 * 		若店铺数量不为0：
			 * 			将现有店铺列表和新获取的店铺列表合并
			 * 			page++
			 */
			updateShops() {
				this.getShops()
					.then(data => this.parseShops(data))
					.then(data => {
						// console.log(data);
						if (data.length) {
							this.shops = [...this.shops, ...data];
							this.page++;

							if (data.length < 5) {
								this.loadOff = false;
							}
						}
					})
			},
			/* 根据城市名称获取热门店铺 
				loading true
				start 数据搜索的起始位
				collection(str) 获取数据集合 favorLex
					where({}) 基于place查询数据
					skip(int) 从哪个索引位置开始查询数据
					limit(int) 获取多少条记录
					get() 获取所有满足其上游的所有条件的数据，返回Promise 对象
						success 返回{data} 数据
						complete loading false
			*/
			getShops() {
				console.log('-----getShops----');
				this.loading = true;
				const num = 5;
				const start = this.page * num;
				return new Promise((resolve) => {
					db.collection('favorList')
						.where({
							place: this.address
						})
						.skip(start)
						.limit(num)
						.get({
							success: (res) => {
								resolve(this.parseShops(res.data));
							},
							complete: () => {
								this.loading = false;
							}
						})
				});
			},
			/* 对获取的店铺列表的数据进行加工 */
			parseShops(data) {
				data.forEach(item => {
					if (item.label) {
						item['labelArr'] = item.label.split(',').splice(0, 4);
					} else {
						item['labelArr'] = null;
					}
					if (item.image_path === null) {
						item.image_path = 'mdata/img/404.jpg'
					}
				})
				return data;
			},
		},
	};
</script>

<style>
	.home_container {
		width: 750upx;
		height: 300upx;
		background: red;
	}

	.title_content {
		width: 750upx;
		height: 80upx;
		background: #00acec;
		color: #fff;
		font-size: 24upx;
		padding-top: 24upx;
	}

	.bar_title {
		color: white;
		margin-top: 60upx;
		margin-left: 34.5upx;
		font-size: 28upx;
	}

	.area_name {
		float: left;
		margin-left: 36upx;
		margin-right: 9upx;
	}

	.downIcon {
		width: 18upx;
		height: 10upx;
	}

	.people {
		float: right;
		margin-right: 28upx;
	}

	.people-img {
		width: 48upx;
		height: 48upx;
	}

	.menu_content {
		width: 750upx;
		height: 198upx;
		display: flex;
		flex-direction: row;
	}

	.menu_item {
		flex: 1;
		text-align: center;
	}

	.menu_item image {
		width: 88upx;
		height: 88upx;
		margin: 20upx 20upx;
	}

	.menu_item text {
		font-size: 24upx;
	}
</style>
