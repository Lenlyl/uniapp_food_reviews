const Tool={
	collectModal:function(){
		uni.showModal({
		  title: '收藏失败',
		  content: '您尚未登录小程序，请先登录！',
		  confirmText: '确定',
		  cancelText: '取消',
		  success: function(res) {
			if (res.confirm) {
			  uni.navigateTo({
			  	url: "/pages/personal/personal"
			  })
			} else if (res.cancel) {
			  console.log('用户点击次要操作')
			}
		  }
		})
	}
}
export Tool;