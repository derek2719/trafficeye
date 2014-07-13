/**
 * <pre>
 * UserInfoManager登录信息管理
 * PageManager页面功能管理
 * </pre>
 * 
 * file:个人资料页显示
 * author:陈宣宇
 * date:2014-07-06
 */

(function(window){
	function UserInfoManager(){
		this.userinfo = null;
		this.ua = null;
		this.pid = null;
	};
	UserInfoManager.prototype={
		setInfo:function(data){
			this.userinfo = data;
		},
		setPid:function(pid){
			this.pid = pid;
		},
		setUa:function(ua){
			this.ua = ua;
		}
	};

	function PageManager(){
		this.init.apply(this,arguments);
	}
	PageManager.prototype = {
		constructor:PageManager,
		moved:false,
		init: function(){
			//保存请求URL
			//this.SERVERURL = Trafficeye.BASE_RIDE_URL + "/api/v4/";
			this.SERVERURL = "http://mobiletest.trafficeye.com.cn:18080/TrafficeyeSevice_test" + "/api/v4/";

			$(window).onbind("load",this.pageLoad,this);
			$(window).onbind("touchmove",this.pageMove,this);
			this.bindEvent();
		},
		bindEvent:function(){
			// 跳转页面 调用方法
			// toPage("objc:??gotoPage::?sigra")
			// 切换城市调用方法
			// toPage("objc:??setCurrentCity::?10101010")
			
			//返回按钮事件
			//$("#backBtn").onbind("touchstart",this.btnDown,this);
			//$("#backBtn").onbind("touchend",this.pageBack,this);

			//个人资料选项事件
			$("#hUl > li").onbind("touchstart",this.btnDown,this);
			$("#hUl > li").onbind("touchend",this.itemBtnUp,this);
			$("#vUl > li").onbind("touchstart",this.btnDown,this);
			$("#vUl > li").onbind("touchend",this.itemBtnUp,this);
		},
		pageLoad:function(evt){
			//测试调用
			//callbackInitTrafficPage("116.37313","39.835876","101010100_101020100_101210101");
		},
		pageMove:function(evt){
			this.moved = true;
			//evt.preventDefault();

			//clearTimeout(this.tout);
			//$("li.curr").removeClass("curr");
		},
		pageBack: function(evt){
			
		},
		/**
		 * btn down 效果
		*/
		btnDown:function(evt){
			//evt.preventDefault();
			this.moved = false;
			var ele = evt.currentTarget;
			$(ele).addClass("curr");
		},
		/**
		 * 个人中心各栏目点击事件
		*/
		itemBtnUp:function(evt){
			var ele = evt.currentTarget;
			$(ele).removeClass("curr");
			if(!this.moved){
				var id = ele.id;
				switch(id){
					case "community":
						//跳转到社区页面
						Trafficeye.toPage("objc:??gotoPage::?community");
					break;
					case "survey":
						//跳转到有奖调查页面
						Trafficeye.toPage("objc:??gotoPage::?survey");
					break;
					case "bus":
						//跳转到公交页面
						Trafficeye.toPage("objc:??gotoPage::?bus");
					break;
					case "car":
						//跳转到拼车页面
						Trafficeye.toPage("objc:??gotoPage::?sharecar");
					break;
					case "weibo":
						//跳转到微博页面
						Trafficeye.toPage("objc:??gotoPage::?weibo");
					break;
				}
			}
		},
		/**
		 * 获取个人信息请求服务
		*/
		getPersonalInfo:function(){

			/*
			//根据经纬度去请求当前城市信息
			var options = {};
			var reqUrl = this.bulidSendUrl("adminZoneQuery",options);
			
			//console.log(reqUrl);
			//显示loading
			Trafficeye.httpTip.opened();
			$.ajaxJSONP({
				url:reqUrl,
				context:this,
				success:function(data){}
			});
			*/

			//var url = "http://c.hiphotos.baidu.com/image/pic/item/e1fe9925bc315c600eb7011c8fb1cb1349547726.jpg";
			//var img = $("#perImg");
			//加载图片
			//Trafficeye.imageLoaded(img,url);
		},
		getPersonalInfoCallback:function(){

		},
		/**
		 * 生成请求地址
		 * server请求服务
		 * options请求参数
		*/
		bulidSendUrl:function(server,options){
			var url = this.SERVERURL + server;
			if(server == "adminZoneQuery"){
				url = "http://mobile.trafficeye.com.cn:8092/AdminZoneQuery_trafficeye/q";
			}
			//个人信息
			var myInfo = Trafficeye.getMyInfo();
			var data = {
				"ua":myInfo.ua,
				"pid":myInfo.pid,
				"uid":myInfo.uid,
				"lon":this.lon,
				"lat":this.lat
			};
			//添加服务参数
			for(var k in options){
				data[k] = options[k];
			}
			//格式化请求参数
			var reqParams = Trafficeye.httpData2Str(data);
			var reqUrl = url + reqParams;
			return reqUrl;
		}
	};

	//页面加载完成执行函数
	$(function(){
		Trafficeye.pageManager = new PageManager();
		//页面初始化平台回调函数,返回经纬度,选择城市数据citys = 10101010_101020100
		//window.callbackInitTrafficPage = function(lon,lat,citys){
			//根据经纬度获取当前城市信息
			//Trafficeye.pageManager.getCurrentCity(lon,lat,citys);
			//生成页面结构
			//Trafficeye.pageManager.buildVisibleCityHtml(citys);
			// callbackInitTrafficPage("116.37313","39.835876","101010100");
			// callbackInitTrafficPage("116.37313","39.835876","101010100_101020100_101210101");
			
		//};
	});
}(window));
