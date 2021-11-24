<template>
	<view class="shops">
		<text class="shops-title">{{title}}</text>
		<!-- 商铺列表：点击跳转详情页detail?id -->
		<navigator 
		class="love_item" 
		v-for="(shop,ind) in list" 
		:key="ind"
		:url="'/pages/detail/detail?id='+shop.id"
		>
			<!-- 左侧图片 -->
			<view class="img_wrapper">
				<image 
				mode="aspectFill" 
				class="love_image" 
				:src="'cloud://cloud1-9gg0n5dm49a16f53.636c-cloud1-9gg0n5dm49a16f53-1308384218/'+shop.image_path" 
				/>
			</view>
			<!-- 右侧文字内容 -->
			<view class="list_right">
				<!-- 标题 -->
				<view class="list_title">{{shop.title}}</view>
				<!-- 星级和价位 -->
				<view class="list_price">
					<!-- 星级 -->
					<Star :score="shop.score"></Star>
					<!-- 价位 -->
					<text class="text-price">￥{{shop.price}}/人</text>
				</view>
				<!-- 具体位置 -->
				<view class="list_local">{{shop.specific}}</view>
				<!-- 标签列表 -->
				<view class="list_tag" v-if="shop.labelArr">
					<text class="tag_ele" v-for="(item,key) in shop.labelArr" :key="key">{{item}}</text>
				</view>
			</view>
		</navigator>
		<!-- 加载更多 -->
		<view class="loading" v-show="loading">加载中...</view>
	</view>
</template>

<script>
	import Star from './Star.vue';
	
	export default {
		props: ['title','list','loading'],
		data() {
			return {};
		},
		components: {Star},
	};
</script>

<style>
	.shops{
		padding: 28upx 28upx 0 28upx;
	}
	.shops-title{
		font-size: 30upx;
		color: #7c7c7c;
	}
	.love_item {
		display: flex;
		min-height: 200upx;
		flex-direction: row;
		border-bottom: 4upx solid #f0f0f0;
		padding-top: 20upx;
		padding-bottom: 20upx;
		align-items: center;
	}
	.img_wrapper {
		width: 155upx;
		height: 155upx;
		
	}
	.love_image {
		width: 100%;
		height: 100%;
		border: 2px solid #f0f0f0;
	}
	
	.list_right {
		width: 539upx;
		min-height: 160upx;
		overflow: hidden;
		margin-left: 24upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.list_title {
		font-weight: bold;
		font-size: 28upx;
		overflow: hidden;
		height: 36upx;
		text-overflow:ellipsis;
		white-space: nowrap;
		
	}
	
	.list_price {
		display: flex;
		font-size: 20upx;
	}
	.text-price{
		padding-left: 9rpx;
	}
	
	.list_local {
		font-size: 20upx;
		color: #666666;
	}
	
	.list_tag {
		display: flex;
		flex-direction: row;
	}
	
	.tag_ele{
		display: flex;
		font-size: 20upx;
		color: #333;
		border: 1px solid #ddd;
		border-radius: 6upx;
		width: 108upx;
		height: 41upx;
		justify-content: center;
		align-items: center;
		margin-right: 8upx;
	}
	.loading {
		text-align: center;
		font-size: 24upx;
		line-height: 70upx;
	}
</style>
