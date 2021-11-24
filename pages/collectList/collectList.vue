<template>
	<view>
		<ShopList title='收藏列表' :list="shops" :loading="loading"></ShopList>
	</view>
</template>

<script>
	/* 引入ShopList 店铺列表组件 */
	import ShopList from '../../components/ShopList.vue';
	
	/* 全局对象 */
	const {globalData}=getApp();
	
	/* 获取数据库 */
	const db = wx.cloud.database();
	
	export default {
		data() {
			return {
				loading:false,
				shops: []
			}
		},
		components: {ShopList},
		onShow() {
			const {userInfo}=globalData;
			const openid=uni.getStorageSync('openid');
			this.showCollection(openid,userInfo);
		},
		methods:{
			async showCollection(openid,userInfo){
				let collect = await db
					.collection("collect")
					.where({
						openid
					})
					.get();
					
				let ids = [];
				collect.data.forEach(item => {
					ids.push(item.id);
				});
				
				db.collection("favorLex")
				.where({
					id: db.command.in(ids)
				})
				.get({
					success:(res)=>{
						this.shops = res.data;
					}
				});
				
			}
		}
	};
</script>


