<script>
	export default {
		onLaunch: function() {
			/**
			 * 初始化微信云
			 * 	env 环境id,如 kkb-kn8rp
			 */
			wx.cloud.init({
				env:'cloud1-9gg0n5dm49a16f53'
			});
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		},
		/**
		 * 全局变量
		 * 	userInfo 用户信息
		 */
		globalData:{
			userInfo:null
		}
	}
</script>

<style>
	/*每个页面公共css */
	
	/* 灰色分割线 */
	.line_gray {
		width: 750upx;
		height: 15upx;
		background: #f6f6f6;
		border-top: 1px solid #ddd;
	}
</style>
