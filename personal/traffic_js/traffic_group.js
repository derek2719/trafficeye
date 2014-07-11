/**
 * <pre>
 * UserInfoManager登录信息管理
 * PageManager页面功能管理
 * </pre>
 * 
 * file:交通聚合页显示
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
		iScrollX:null,
		iScrollY:[],
		//服务地址
		SERVERURL:null,
		lon:0,
		lat:0,
		//页面宽度
		bodyWidth:0,
		//页面高度
		bodyHeight:0,
		//密度
		ratio:1,
		//保存当前城市code,因为不是当前城市,简图没有周边
		currentCityCode:"101010100",
		//当前显示的城市下标,从0开始
		cityIndex:0,
		//当前选择的城市
		cityList:[],
		//[城市简图,交通简图,天气,交通指数,交通资讯,打车指数,打车建议地图,打车热图]
		cityModule:{
			"101010100":[1,1,1,1,1,1,1,1],"101230101":[1,1,1,0,0,0,0,0],"101210101":[1,1,1,1,0,0,0,0],
			"101190101":[1,1,1,0,0,0,0,0],"101210401":[1,1,1,0,0,0,0,0],"101120201":[1,1,1,0,0,0,0,0],
			"101020100":[1,1,1,1,0,1,1,0],"101280601":[1,1,1,1,1,0,0,0],"101070101":[1,1,1,0,0,0,0,0],
			"101090101":[1,1,1,0,0,0,0,0],"101200101":[1,1,1,0,0,0,0,0],"101060101":[1,1,1,0,0,0,0,0],
			"101250101":[1,1,1,0,0,0,0,0],"101040100":[1,1,1,0,0,0,0,0],"101280701":[1,1,1,0,0,0,0,0],
			"101280101":[1,1,1,0,0,0,0,0],"101270101":[1,1,1,0,0,0,0,0],"101281701":[1,1,1,0,0,0,0,0],
			"101281601":[1,1,1,0,0,0,0,0],"101280800":[1,1,1,0,0,0,0,0],"101210901":[1,1,0,0,0,0,0,0],
			"101230201":[1,1,0,0,0,0,0,0],"101190401":[1,1,0,0,0,0,0,0],"101030100":[1,1,0,0,0,0,0,0],
			"101210701":[1,1,0,0,0,0,0,0],"101190201":[1,1,0,0,0,0,0,0]
		},
		//需要请求哪些服务,生成页面dom的时候,把调用函数保存起来[[第一页][第二页]]
		cityServer:[],
		//标识是否请求了服务,5分钟需要刷新一次
		sendServer:[],
		//保存简图上一次显示的图片url
		mapOldUrl:{},
		//保存打车热图,位置图
		taxiImgUrl:{},
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
			//返回按钮按下弹起
			//this.$backbtn.onbind("touchstart",this.btnDown,this);
			//this.$backbtn.onbind("touchend",this.pageBack,this);
			//编辑
			//this.$editbtn.onbind("touchstart",this.btnDown,this);
			//this.$editbtn.onbind("touchend",this.editBtnUp,this);
		},
		pageLoad:function(evt){
			var w = $(window).width();
			var h = $(window).height();
			this.ratio = window.devicePixelRatio || 1;
			this.bodyWidth = w;
			this.bodyHeight = h;

			//测试调用
			//callbackInitTrafficPage("116.37313","39.835876","101010100_101020100_101210101");
		},
		
		//手指move
		pageMove:function(evt){
			this.moved = true;
			evt.preventDefault();

			//clearTimeout(this.tout);
			//$("li.curr").removeClass("curr");
		},
		//返回按钮
		pageBack: function(evt){
			
		},
		//btn down 效果
		btnDown:function(evt){
			evt.preventDefault();
			this.moved = false;
			var ele = evt.currentTarget;
			$(ele).addClass("curr");
		},
		//城市简图按钮事件
		trafficMapTypeBtnUp:function(evt){
			var ele = evt.currentTarget;
			$(ele).removeClass("curr");
			if(!this.moved){
				var $ele = $(ele);
				var b = $ele.hasClass("selected");
				if(!b){
					$ele.siblings("a").removeClass("selected");
					$ele.addClass("selected");
					var id = ele.id.split("_") || [];
					var type = id[0];
					switch(type){
						case "cityMap":
							this.getCityMapImg();
						break;
						case "peripheryMap":
							this.getPeripheryMapImg();
						break;
						case "trafficMap":
							this.getTrafficMapImgImg();
						break;
					}
				}
			}
		},
		/**
		 * 注册打车位置/热图按钮事件
		*/
		taxiIndexBtnUp:function(evt){
			var ele = evt.currentTarget;
			$(ele).removeClass("curr");
			if(!this.moved){
				var $ele = $(ele);
				var b = $ele.hasClass("selected");
				if(!b){
					$ele.siblings("a").removeClass("selected");
					$ele.addClass("selected");
					var id = ele.id.split("_") || [];
					var type = id[0];
					var code = this.cityList[this.cityIndex];
					switch(type){
						case "taxiLocation":
							this.getTaxiImg(code,5,"taxiLocation");
						break;
						case "taxiHot":
							this.getTaxiImg(code,4,"taxiHot");
						break;
					}
				}
			}
		},
		/**
		 * 初始化滚动插件
		*/
		initiScroll:function(){
			if(this.iScrollX == null){
				//动态调整滚动插件宽高,
				var w = this.bodyWidth;
				var h = this.bodyHeight + "px";
				var count = this.cityList.length;
				$("#viewport").css({"width":w + "px","height":h});
				$("#scroller").css({"width":w * count + "px","height":h});
				$(".slide").css({"width":w + "px","height":h});
				$(".scroller").css({"width":w + "px"});
				
				this.iScrollX = new IScroll('#wrapper',{
					scrollX: true,
					momentum:false,
					snap:true,
					snapSpeed:600,
					scope:this
				});

				this.iScrollX.on('scrollEnd',function(){
					var scope = this.options.scope;
					var index = scope.cityIndex;
					
					var pageX = this.currentPage.pageX;
					if(index != pageX){
						scope.sendCityServer(pageX);

						//初始化纵向滚动
						var code = scope.cityList[pageX];
						Trafficeye.toPage("objc:??setCurrentCity::?" + code);

						var iScrollY = scope.iScrollY[pageX];
						if(iScrollY == null){
							iScrollY = new IScroll("#city_" + code,{
								scrollbars:false
							});
							scope.iScrollY[pageX] = iScrollY;
						}
					}
				});
				
				//初始化第一个城市纵向滚动
				var code = this.cityList[this.cityIndex];
				var iScrollY = new IScroll("#city_" + code,{
					scrollbars:false
				});
				this.iScrollY[this.cityIndex] = iScrollY;
				//通知平台显示城市
				Trafficeye.toPage("objc:??setCurrentCity::?" + this.currentCityCode);
			}
		},
		/**
		 * 查询定时器,5分钟更新一次数据
		*/
		sendServerTime:function(){
			var t = this;
			var time = 5 * 60 * 1000;
			this.tout = setTimeout(function(){
				var index = t.cityIndex;
				//重置当前显示城市请求标识
				t.sendServer[index] = 1;

				t.sendCityServer(index);

				//回调自己重新计时
				t.sendServerTime();
			},time);
		},
		/**
		 * 根据经纬度获取城市信息
		 * lon当前GPS经度
		 * lat当前GPS纬度
		*/
		getCurrentCity:function(lon,lat,city){
			this.lon = lon;
			this.lat = lat;
			//var citys = city.split("_");
			//this.buildVisibleCityHtml(citys);

			//return;

			//根据经纬度去请求当前城市信息
			var options = {};
			options.lon = lon;
			options.lat = lat;
			var reqUrl = this.bulidSendUrl("adminZoneQuery",options);
			
			//var reqUrl = 'http://119.254.195.135:8080/AdminZoneQuery_trafficeye/q?callback=?&lon=' + lon + '&lat=' + lat;
			//console.log(reqUrl);
			//显示loading
			Trafficeye.httpTip.opened();

			$.ajaxJSONP({
				url:reqUrl,
				context:this,
				success:function(data){
					var state = data.state.code - 0;
					if(state === 0){
						var code = data.code;
						//保存当前城市code
						this.currentCityCode = code;

						var citys = city.split("_");
						//判断当前城市是否有服务
						var module = this.cityModule[code] || "";
						if(module != ""){
							//判断当前城市是否再选择城市之内
							var b = citys.indexOf(code);
							if(b == -1){
								//如果不存在,就添加到最开始
								citys.unshift(code);
							}
						}
						//根据城市数据生成页面结构
						this.buildVisibleCityHtml(citys);
					}
					else{
						var citys = city.split("_");
						this.buildVisibleCityHtml(citys);
					}
				}
			});
		},
		/**
		 * 生成选择城市的dom结构
		 * citys已选择城市,数据格式["101010100","101230101","101210101"];
		*/
		buildVisibleCityHtml:function(citys){
			var page = [];
			for(var i = 0,len = citys.length; i < len; i++){
				var city = citys[i];
				//获取该城市支持的模块
				var module = this.cityModule[city];
				if(module != null){
					//初始化页面模块请求服务数组
					this.cityList.push(city);
					this.sendServer.push(city);
					var sendFun = [];
					
					var html = [];
					//添加滚动结构
					html.push('<div class="slide">');
					html.push('<div id="city_' + city + '" class="wrapper_content">');
					html.push('<div class="scroller">');

					//城市简图
					var m1 = module[0];
					//交通简图(城市简图中的交通简图选项)
					var m2 = module[1];
					//天气
					var m3 = module[2];
					//交通指数
					var m4 = module[3];
					//交通资讯
					var m5 = module[4];
					//打车指数
					var m6 = module[5];
					//打车建议地图(打车指数)
					var m7 = module[6];
					//打车热图(打车指数)
					var m8 = module[7];
					if(m1 === 1){
						//包含城市简图
						var hl = this.getCityMapHtml(m2,city);
						html.push(hl);
						sendFun.push(this.getCityMapImg);
					}
					if(m3 === 1){
						//包含天气
						var hl = this.getWeatherHtml(city);
						html.push(hl);
						sendFun.push(this.getWeather);
					}
					if(m4 === 1){
						//包含交通指数
						var hl = this.getTrafficIndexHtml(city);
						html.push(hl);
						sendFun.push(this.getTrafficIndex);
					}
					if(m5 === 1){
						//包含交通资讯
						var hl = this.getTrafficInfoHtml(city);
						html.push(hl);
						sendFun.push(this.getTrafficInfo);
					}
					if(m6 === 1){
						//包含打车指数
						var hl = this.getTaxiIndexHtml(m7,m8,city);
						html.push(hl);
						sendFun.push(this.getTaxiIndex);
					}
					html.push('</div></div></div>');
					page.push(html.join(""));

					this.cityServer.push(sendFun);
				}
				else{
					//console.log(city);
				}
			}
			//加载页面结构
			$("#scroller").html(page.join(""));

			//初始化iscroll
			this.initiScroll();

			//获取第一个城市服务端数据
			this.sendCityServer(0);

			//开启刷新定时器
			//this.sendServerTime();
		},
		/**
		 * 并发请求城市交通数据
		 * index第几个城市从0开始
		*/
		sendCityServer:function(index){
			//console.log("aa" + index)
			//保存请求城市下标
			this.cityIndex = index;
			//首先判断当前显示城市是否已请求数据,如果等于0就标识已经请求过一次了
			var send = this.sendServer[index];
			if(send !== 0){
				var len = this.cityServer.length;
				if(len > 0){
					//console.log("bb" + index)
					var sf = this.cityServer[index];
					for(var i = 0,sLen = sf.length; i < sLen; i++){
						sf[i].apply(this,arguments);
					}

					//修改请求标识
					this.sendServer[index] = 0;
				}
			}
		},
		/**
		 * 获取城市简图html
		 * m2是否支持交通简图
		 * id等于城市编码,用来标识dom唯一ID
		*/
		getCityMapHtml:function(m2,id){
			var w = parseInt(this.bodyWidth * 0.725) || 232;
			var h = parseInt(w * 0.75) || 163;
			var html = [];
			html.push('<div class="map_1">');
			html.push('<div id="trafficMapType' + id + '" class="map_r">');
			html.push('<a id="cityMap_' + id + '" class="qs selected">全市简图</a>');
			if(id == this.currentCityCode){
				html.push('<a id="peripheryMap_' + id + '" class="zb">周边简图</a>');
				if(m2 === 1){
					html.push('<a id="trafficMap_' + id + '" class="jt">交通地图</a>');
				}
			}
			html.push('</div>');
			html.push('<div id="trafficMapImgDiv' + id + '" class="map_l">');
			html.push('<img id="cityMapImg' + id + '" src="traffic_img/default.jpg" width="' + w + '" height="' + h + '" />');
			html.push('</div></div>');
			return html.join("");
		},
		/**
		 * 获取城市简图服务请求
		 * 请求图片类型,1：全市简图,2：周边简图,3：周边路况图,4：打车热图,5：打车建议位置图,6:交通指数
		*/
		getCityMapImg:function(){
			var code = this.cityList[this.cityIndex];
			var options = {};
			options.width = parseInt(this.bodyWidth * this.ratio * 0.725) || 232;
			options.type = 1;
			options.code = code;
			var reqUrl = this.bulidSendUrl("combinedPage",options);
			//console.log(reqUrl);
			//显示历史简图
			var url = this.mapOldUrl["cityMap" + code] || "traffic_img/default.jpg";
			$("#cityMapImg" + code).attr("src",url);

			$.ajaxJSONP({
				url:reqUrl,
				context:this,
				success:function(data){
					var state = data.state.code - 0;
					if(state === 0){
						var imgUrl = data.url || "";
						if(imgUrl != ""){
							//保存url
							this.mapOldUrl["cityMap" + code] = imgUrl;
							//获取图片dom
							var img = $("#cityMapImg" + code);
							//加载图片
							Trafficeye.imageLoaded(img,imgUrl);
						}
						else{
							Trafficeye.trafficeyeAlert("没有返回全市简图地址");
						}
						//注册按钮事件,交通简图事件
						$("#trafficMapType" + code + " > a").rebind("touchstart",this.btnDown,this);
						$("#trafficMapType" + code + " > a").rebind("touchend",this.trafficMapTypeBtnUp,this);
					}
					else{
						var msg = data.state.desc + "(" + state + ")";
						Trafficeye.trafficeyeAlert(msg);
					}
				}
			});
		},
		/*
		 * 获取周边简图
		*/
		getPeripheryMapImg:function(){
			var code = this.cityList[this.cityIndex];
			var options = {};
			options.width = parseInt(this.bodyWidth * this.ratio * 0.725) || 232;
			options.type = 2;
			options.code = code;
			var reqUrl = this.bulidSendUrl("combinedPage",options);
			//console.log(reqUrl);
			//显示历史简图
			var url = this.mapOldUrl["peripheryMap" + code] || "traffic_img/default.jpg";
			$("#cityMapImg" + code).attr("src",url);

			$.ajaxJSONP({
				url:reqUrl,
				context:this,
				success:function(data){
					var state = data.state.code - 0;
					if(state === 0){
						var imgUrl = data.url || "";
						if(imgUrl != ""){
							//保存url
							this.mapOldUrl["peripheryMap" + code] = imgUrl;
							//获取图片dom
							var img = $("#cityMapImg" + code);
							//加载图片
							Trafficeye.imageLoaded(img,imgUrl);
						}
						else{
							Trafficeye.trafficeyeAlert("没有返回简图地址");
						}
					}
					else{
						var msg = data.state.desc + "(" + state + ")";
						Trafficeye.trafficeyeAlert(msg);
					}
				}
			});
		},
		/*
		 * 获取周边路况简图
		*/
		getTrafficMapImgImg:function(){
			var code = this.cityList[this.cityIndex];
			var options = {};
			options.width = parseInt(this.bodyWidth * this.ratio * 0.725) || 232;
			options.type = 3;
			options.code = code;
			var reqUrl = this.bulidSendUrl("combinedPage",options);
			//console.log(reqUrl);
			//显示历史简图
			var url = this.mapOldUrl["trafficMap" + code] || "traffic_img/default.jpg";
			$("#cityMapImg" + code).attr("src",url);

			$.ajaxJSONP({
				url:reqUrl,
				context:this,
				success:function(data){
					var state = data.state.code - 0;
					if(state === 0){
						var imgUrl = data.url || "";
						if(imgUrl != ""){
							//保存url
							this.mapOldUrl["trafficMap" + code] = imgUrl;
							//获取图片dom
							var img = $("#cityMapImg" + code);
							//加载图片
							Trafficeye.imageLoaded(img,imgUrl);
						}
						else{
							Trafficeye.trafficeyeAlert("没有返回简图地址");
						}
					}
					else{
						var msg = data.state.desc + "(" + state + ")";
						Trafficeye.trafficeyeAlert(msg);
					}
				}
			});
		},
		/**
		 * 获取天气html结构
		*/
		getWeatherHtml:function(id){
			var html = [];
			html.push('<div class="map_2_box"><div class="map_2"><h3 class="map_bt">天气</h3>');
			html.push('<div id="weather' +id + '" class="weather-warp"><div class="tdiv">');
			html.push('<h4><img src="traffic_img/day/54.png" width="60" height="60"/><span></span></h4>');
			html.push('<div class="tdivr"><span class="h">-°</span><span class="l">-°</span>');
			html.push('</div><div class="clear"></div></div>');
			html.push('<div class="bdiv"><div  class="bdivl">');
			html.push('明天<img src="traffic_img/day/54.png" width="30" height="30"/>');
			html.push('<span class="h">-°</span><span class="gline"> / </span><span class="l">-°</span>');
			html.push('</div><div class="bdivr">');
			html.push('后天<img src="traffic_img/day/54.png" width="30" height="30"/>');
			html.push('<span class="h">-°</span><span class="gline"> / </span><span class="l">-°</span>');
			html.push('</div><div class="clear"></div></div></div></div></div>');
			return html.join("");
		},
		getWeather:function(){
			var code = this.cityList[this.cityIndex];
			var options = {};
			options.code = code;
			var reqUrl = this.bulidSendUrl("getWeather",options);
			//console.log(reqUrl)
			$.ajaxJSONP({
				url:reqUrl,
				context:this,
				success:function(data){
					var state = data.state.code - 0;
					if(state === 0){
						this.getWeatherCallback(data,code);
					}
					else{
						var msg = data.state.desc + "(" + state + ")";
						Trafficeye.trafficeyeAlert(msg);
					}
				}
			});
		},
		getWeatherCallback:function(data,code){
			var obj = data.weatherInfo;
			var todayImg = obj.t1WeatherImg || "";
			var todayTemp = obj.t1Temperature || "-";
			var todayMaxTemp = obj.t1MaxTemperature || "-";
			var todayMinTemp = obj.t1MinTemperature || "-";
			var todayDesc = obj.t1WeatherDesc || "";
			var mornImg = obj.t2WeatherImg;
			var mornMaxTemp = obj.t2MaxTemperature || "-";
			var mornMinTemp = obj.t2MinTemperature || "-";
			var afterImg = obj.t3WeatherImg;
			var afterMaxTemp = obj.t3MaxTemperature || "-";
			var afterMinTemp = obj.t3MinTemperature || "-";

			var html = [];
			html.push('<div class="tdiv">');
			html.push('<h4>' + todayTemp + '°<img src="' + todayImg + '" width="60" height="60"/><span>' + todayDesc + '</span></h4>');
			html.push('<div class="tdivr">');
			html.push('<span class="h">' + todayMaxTemp + '°</span>');
			html.push('<span class="l">' + todayMinTemp + '°</span>');
			html.push('</div><div class="clear"></div></div>');
			html.push('<div class="bdiv"><div class="bdivl">');
			html.push('明天<img src="' + mornImg + '" width="30" height="30"/>');
			html.push('<span class="h">' + mornMaxTemp + '°</span><span class="gline"> / </span><span class="l">' + mornMinTemp + '°</span>');
			html.push('</div><div class="bdivr">');
			html.push('后天<img src="' + afterImg + '" width="30" height="30"/>');
			html.push('<span class="h">' + afterMaxTemp + '°</span><span class="gline"> / </span><span class="l">' + afterMinTemp + '°</span>');
			html.push('</div><div class="clear"></div></div>');

			var dom = $("#weather" + code);
			dom.html(html.join(''));
		},
		/**
		 * 获取交通指数图片html
		*/
		getTrafficIndexHtml:function(id){
			var w = parseInt(this.bodyWidth - 20) || 300;
			var h = parseInt(w * 0.75) || 160;
			var html = [];
			html.push('<div class="map_2_box">');
			html.push('<div class="map_2">');
			html.push('<h3 class="map_bt">交通指数</h3>');
			html.push('<div>');
			html.push('<img id="trafficIndexImg' + id + '" src="traffic_img/default.jpg" width="' + w + '" height="' + h + '" />');
			html.push('</div></div></div>');
			return html.join('');
			
		},
		getTrafficIndex:function(){
			var code = this.cityList[this.cityIndex];
			var options = {};
			options.width = parseInt(this.bodyWidth * this.ratio - 20) || 300;
			options.type = 6;
			options.code = code;
			var reqUrl = this.bulidSendUrl("combinedPage",options);
			//console.log(reqUrl);
			$.ajaxJSONP({
				url:reqUrl,
				context:this,
				success:function(data){
					var state = data.state.code - 0;
					if(state === 0){
						var imgUrl = data.url || "";
						if(imgUrl != ""){
							//获取图片dom
							var img = $("#trafficIndexImg" + code);
							//加载图片
							Trafficeye.imageLoaded(img,imgUrl);
						}
						else{
							Trafficeye.trafficeyeAlert("没有返回交通指数图片地址");
						}
					}
					else{
						var msg = data.state.desc + "(" + state + ")";
						Trafficeye.trafficeyeAlert(msg);
					}
				}
			});
		},
		/**
		 * 获取交通资讯数据
		*/
		getTrafficInfoHtml:function(id){
			var w = parseInt(this.bodyWidth * 0.35) || 106;
			var h = parseInt(w * 0.75) || 70;
			var html = [];
			html.push('<div class="map_2_box">');
			html.push('<div id="trafficInfo' + id + '" class="map_2">');
			html.push('<h3 class="map_bt">交通资讯</h3>');
			html.push('<div class="zixun">');
			html.push('<img src="traffic_img/default.jpg" width="' + w + '" height="' + h + '" />');
			html.push('<h3>路况播报</h3>');
			html.push('<p></p></div>');
			html.push('<p class="jiaot"><span></span></p>');
			html.push('</div></div>');
			return html.join('');
		},
		getTrafficInfo:function(){
			var code = this.cityList[this.cityIndex];
			var options = {};
			options.width = parseInt(this.bodyWidth * this.ratio * 0.35) || 106;
			options.code = code;
			var reqUrl = this.bulidSendUrl("trafficMessage",options);
			//console.log(reqUrl);
			/*
			$.ajaxJSONP({
				url:reqUrl,
				context:this,
				success:function(data){
					//debugger
					//Trafficeye.httpTip.closed();
					this.trafficInfoCallback(data,code);
				}
			});
			*/
		},
		trafficInfoCallback:function(data,code){
			//交通资讯数据
			var info = {
				img:"http://a2.att.hudong.com/56/76/20300000258678134865761607541.jpg",
				title:"路况播报001",
				content:"目前阿拉丁快捷阿拉分开阿拉善房贷款逻辑,目前阿拉丁快捷阿拉分开阿拉善房贷款逻辑",
				address:"背景交通",
				time:"06-23 23:34"
			};
			var w = parseInt(this.bodyWidth * this.ratio * 0.35) || 106;
			var h = parseInt(w * 0.75) || 70;

			var title = info.title || "路况播报";
			var content = info.content || "";
			var address = info.address || "交通北京";
			var time = info.time || "";
			var html = [];
			html.push('<h3 class="map_bt">交通资讯</h3>');
			html.push('<div class="zixun">');
			html.push('<img id="trafficInfoImg' + code + '" src="traffic_img/default.jpg" width="' + w + '" height="' + h + '" />');
			html.push('<h3>' + title + '</h3>');
			html.push('<p>' + content + '</p></div>');
			html.push('<p class="jiaot">' + address + '<span>' + time + '</span></p>');
			
			var dom = $("#trafficInfo" + code);
			dom.html(html.join(''));

			//异步加载交通资讯图片
			var img = $("#trafficInfoImg" + code);
			var url = info.img || "";
			Trafficeye.imageLoaded(img,url);
		},
		/**
		 * 获取打车指数html
		*/
		getTaxiIndexHtml:function(m7,m8,id){
			var w = parseInt(this.bodyWidth) || 320;
			var h = parseInt(w * 0.75) || 163;
			var html = [];
			html.push('<div class="map_2_box">');
			html.push('<div class="map_2"><h3 class="map_bt">打车指数</h3>');
			html.push('<div class="dche">');
			html.push('当前位置打车指数：');
			html.push('<div id="taxiIndex' + id + '" class="score"></div>');
			html.push('</div></div>');

			if(m7 === 1 || m8 === 1){
				html.push('<div class="map_2_img">');
				html.push('<img id="taxiIndexImg' + id + '" src="traffic_img/default.jpg" width="' + w + '" height="' + h + '" />');
				html.push('<div id="taxiIndexBtn' + id + '" class="imgbtn">');
				if(m7 === 1){
					html.push('<a href="#" id="taxiLocation_' + id + '" class="dc" >建议打车位置</a>');
					
					this.taxiImgUrl["taxiLocation" + id] = "traffic_img/default.jpg";
				}
				if(m8 === 1){
					html.push('<a href="#" id="taxiHot_' + id + '" class="rq" >上下客热图</a>');

					this.taxiImgUrl["taxiHot" + id] = "traffic_img/default.jpg";
				}
				html.push('</div></div></div>');
			}
			return html.join('');
		},
		getTaxiIndex:function(){
			var code = this.cityList[this.cityIndex];
			var options = {};
			options.width = parseInt(this.bodyWidth * this.ratio) || 320;
			options.code = code;
			var reqUrl = this.bulidSendUrl("taxiIndex",options);
			// console.log(reqUrl);
			$.ajaxJSONP({
				url:reqUrl,
				context:this,
				success:function(data){
					var state = data.state.code - 0;
					if(state === 0){
						this.taxiIndexCallback(data,code);
					}
					else{
						var msg = data.state.desc + "(" + state + ")";
						Trafficeye.trafficeyeAlert(msg);
					}
				}
			});
		},
		taxiIndexCallback:function(data,code){
			var obj = {};
			obj.level = data.index;
			var html = [];
			//星级
			var star = this.bulidStarHtml(obj);
			var dom = $("#taxiIndex" + code);
			dom.html(star);

			//请求打车位置图/热图
			var taxiLocationImg = this.taxiImgUrl["taxiLocation" + code] || "";
			var taxiHotImg = this.taxiImgUrl["taxiHot" + code] || "";
			if(taxiLocationImg !== ""){
				//请求打车位置图
				this.getTaxiImg(code,5,"taxiLocation");
				//按钮显示高亮
				$("#taxiLocation_" + code).addClass("selected");
			}
			else{
				//如果没有打车位置图,判断一下有没有打车热图
				if(taxiHotImg !== ""){
					//请求打车热图
					this.getTaxiImg(code,4,"taxiHot");
					//按钮显示高亮
					$("#taxiHot_" + code).addClass("selected");
				}
			}

			//如果有两个选项,注册按钮事件
			if(taxiLocationImg !== "" && taxiHotImg !== ""){
				var taxiIndexBtn = $("#taxiIndexBtn" + code + " > a");
				taxiIndexBtn.onbind("touchstart",this.btnDown,this);
				taxiIndexBtn.onbind("touchend",this.taxiIndexBtnUp,this);
			}
		},
		getTaxiImg:function(code,type,imgId){
			//4：打车热图,5：打车建议位置图
			var options = {};
			options.width = parseInt(this.bodyWidth * this.ratio) || 320;
			options.type = type;
			options.code = code;
			var reqUrl = this.bulidSendUrl("combinedPage",options);
			//console.log(reqUrl)
			//显示历史打车位置/热图
			var url = this.taxiImgUrl[imgId + code] || "traffic_img/default.jpg";
			$("#taxiIndexImg" + code).attr("src",url);

			$.ajaxJSONP({
				url:reqUrl,
				context:this,
				success:function(data){
					var state = data.state.code - 0;
					if(state === 0){
						var imgUrl = data.url || "";
						if(imgUrl != ""){
							this.taxiImgUrl[imgId + code] = imgUrl;
							//获取图片dom
							var img = $("#taxiIndexImg" + code);
							//加载图片
							Trafficeye.imageLoaded(img,imgUrl);
						}
						else{
							Trafficeye.trafficeyeAlert("没有返回打车位置/热图图片地址");
						}
					}
					else{
						var msg = data.state.desc + "(" + state + ")";
						Trafficeye.trafficeyeAlert(msg);
					}
				}
			});
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
			//var reqUrl = "http://mobile.trafficeye.com.cn:8000/user/v4/update?ua=A_4.0.4,a_2.3.1&pid=864737010861021&uid=43943&username=aaaaaa&callback=?&timer=1404782256288";
			return reqUrl;
		},
		/**
		 * 生成星级html
		*/
		bulidStarHtml:function(obj){
			var html = [];
			var level = obj.level/10 - 0;
			//如果大于5,做5处理
			level = level > 5 ? 5 : level;
			var star = 1;
			//默认5个空星
			var starArr = ['<div class="empty"></div>','<div class="empty"></div>','<div class="empty"></div>','<div class="empty"></div>','<div class="empty"></div>'];
			while(star <= level){
				starArr[star - 1] = '<div class="full"></div>';
				star++;
			}
			if((star - 1) != level){
				starArr[star - 1] = '<div class="half"></div>';
			}
			html.push(starArr.join(''));
			return html.join('');
		}
	};

	//页面加载完成执行函数
	$(function(){
		Trafficeye.pageManager = new PageManager();
		//页面初始化平台回调函数,返回经纬度,选择城市数据citys = 10101010_101020100
		window.callbackInitTrafficPage = function(lon,lat,citys){
			//根据经纬度获取当前城市信息
			Trafficeye.pageManager.getCurrentCity(lon,lat,citys);
			//生成页面结构
			//Trafficeye.pageManager.buildVisibleCityHtml(citys);
			// callbackInitTrafficPage("116.37313","39.835876","101010100");
			// callbackInitTrafficPage("116.37313","39.835876","101010100_101020100_101210101");

			
		};
	});
}(window));
