/**
 * <pre>
 * UserInfoManager登录信息管理
 * PageManager页面功能管理
 * </pre>
 * 
 * file:个人资料页显示
 * author:陈宣宇
 * date:2014-07-13
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
			$("#personalUl > li").onbind("touchstart",this.btnDown,this);
			$("#personalUl > li").onbind("touchend",this.itemBtnUp,this);
			$("#systemUl > li").onbind("touchstart",this.btnDown,this);
			$("#systemUl > li").onbind("touchend",this.itemBtnUp,this);
		},
		pageLoad:function(evt){
			//测试调用
			//callbackInitMePage("http://c.hiphotos.baidu.com/image/pic/item/e1fe9925bc315c600eb7011c8fb1cb1349547726.jpg","闹闹");
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
					case "perInfo":
						//跳转到个人页面
						Trafficeye.toPage("objc:??gotoPage::?personal");
					break;
					case "msg":
						//跳转到消息页面
						Trafficeye.toPage("objc:??gotoPage::?message");
					break;
					case "setup":
						//跳转到设置页面
						Trafficeye.toPage("objc:??gotoPage::?setting");
					break;
					case "wechat":
						//跳转到微信页面
						Trafficeye.toPage("objc:??gotoPage::?weixin");
					break;
				}
			}
		},
		/**
		 * 获取个人信息请求服务
		 * url头像地址
		 * name用户名称
		*/
		getPersonalInfo:function(url,name){
			var img = $("#perImg");
			$("#perName").html(name);
			//加载图片
			Trafficeye.imageLoaded(img,url);
		},
		/**
		 * 生成请求地址
		 * server请求服务
		 * options请求参数
		*/
		bulidSendUrl:function(server,options){
			var url = this.SERVERURL + server;
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
		window.callbackInitMePage = function(url,name){
			//根据经纬度获取当前城市信息
			Trafficeye.pageManager.getPersonalInfo(url,name);
		};
	});
}(window));
