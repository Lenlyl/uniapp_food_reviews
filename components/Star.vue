<template>
	<view class="starContainer">
		<image class="star-img" v-for="(item,key) in starArr" :key="key" :src="'/static/images/b-'+item+'.png'" />
	</view>
</template>

<script>
	export default {
		props: ["score"],
		data() {
			return {};
		},
		components: {},
		computed: {
			starArr: function() {
				let scoreArr = [];
				let score=this.score / 2;
				let scoreOn = Math.min(Math.round(score),5);
				//全星；
				for (let i = 0; i < scoreOn; i++) {
					scoreArr.push("on");
				}
				// 处理半星；
				if (0 < score % 1 && score % 1 < 0.5) {
					scoreArr.push("half");
				}
				// 处理灰星；
				const grayLen=5-scoreArr.length
				for(let i=0;i<grayLen;i++){
					scoreArr.push("off");
				}
				return scoreArr;
			}
		}
	};
</script>

<style>
	.star-img {
		width: 25upx;
		height: 25upx;
	}
</style>
