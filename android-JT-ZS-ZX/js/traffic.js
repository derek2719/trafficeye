var baseUrl = "http://mobile.trafficeye.com.cn:8000";
//var baseUrl = "http://mobile.trafficeye.com.cn:8008/TrafficeyeSevice_test";
//上bar和下bar的高度之和
var offsetHeight = 100;
var imgOffsetW = 20;
var imgOffsetH = 200;
//轮播图对象集合
var res = [];
var imageUrlRes = [];
var imageObjRes = [];
var isNavTabInited = false;
var saveid = "lunboli0";
var tabIndex = 0;
var density;
var paramJson;
var LunBoObj = function() {
	this.imgId = "";
	this.imgUrl = "";
	this.imgW = 0;
	this.imgH = 0;
	this.city = "";
	this.area = "";
	this.index = 0;
	this.inited = false;
	this.html = "";
	this.tabId = "";
};
var htmlObj;
 window.onscroll = function(){ 
var url = window.location.href;
 	if(url.indexOf("index_list.html")>-1){
 	}else{
 	//window.scrollTo(0,0)
	}
 	 
     }
//每个轮播图片页面对象
function ImageItem(width, height, imgUrl,i) {
    this.width = width;
    this.height = height;
    this.imgUrl = imgUrl;
    this.inited = true;
    this.containerElem = null;
    this.imageParentElem = null;
	 this.i= i;
	 //判断图片是否加载成功
    this.isImageLoaded = false;
};
ImageItem.prototype = {
    //延迟加载图片页面中包含的img元素
    loadImage : function() {
        var me = this;
		if(!me.isImageLoaded){
			$("#lunboImg" + me.i).html("");
			$("#lunboImg" + me.i).append("<b id ='jiazai_"+me.i+"'style='margin:0 auto;position:absolute;top:50%;left:30%;' >正在努力加载中...</b>")
			/*var image = document.createElement("img");
			image.style.background="url(images/blank.gif)";
			image.onload = function(event) {
				if(this.complete){
					$("#jiazai_"+this.id).css("display","none");
					 me.isImageLoaded = true;
				}
			}
			image.onerror = function() {
					$("#jiazai_"+this.id).css("加载数据失败");
				}
				
			image.width = imgW;
			image.height = imgH;
			image.src = me.imgUrl;
			image .id=me.i;
			$("#lunboImg" + me.i).append(image);*/
			var city=me.imgUrl.split('?')[1].split('&')[0].split('=')[1];
			var area=me.imgUrl.split('?')[1].split('&')[1].split('=')[1];
			$.ajax({
				type:'get',
				url:'http://mobiletest.trafficeye.com.cn:18080/TrafficeyeSevice_test/api/v4/trafficIndexChartData',
				data:{
					city:city,
					area:area	
				},
				dataType:'jsonp',
				success:function(data){
					if(data.state.code==0){
						var theData=data.indexData;
						var imgDraw=document.createElement('div');
						imgDraw.id='imgDraw'+me.i;
						imgDraw.style.height='315px';
						$("#lunboImg" + me.i).append(imgDraw);
						draw_charts({'id':'imgDraw'+me.i,'city':city,'place':area,'yData1':theData.index_lastweek,'yData2':theData.index,'maxData':theData.maxValue});//模块ID,城市,区域,上周五数据,今日数据,Y轴最大值//测试数据
						var reDraw=document.createElement('div');
						reDraw.id='reDraw'+me.i;
						reDraw.style.height='315px';
						$("#lunboImg" + me.i).append(reDraw);
						draw_charts({'id':'reDraw'+me.i,'city':city,'place':area,'yData1':theData.index_lastweek,'yData2':theData.index,'maxData':theData.maxValue});//模块ID,城市,区域,上周五数据,今日数据,Y轴最大值//测试数据
						//draw_charts({'id':'imgDraw'+me.i,'city':city,'place':area,'yData1':[0.4,1.3,3,2,1.4,1.9,1,3,0.4,1.3,3,2,1.4,1.9,1,3,0.4,1.3,3,2,1.4,1.9,1,3,1],'yData2':[4,1.3,3,2,1.4,1.9,1,3,0].reverse(),'maxData':theData.maxValue});
					}
					
				},
				error:function(xmlHttpReq,textStatus,errorThrown){
					alert('遇到未知错误');	
				}
				
			});
		}
    }
};

/**
 * 设置首页请求参数
 */
function initByParam(obj) {
	if (obj) {
		obj = $.parseJSON(obj);
		var area = obj.area;
		var width = obj.width;
		var height = obj.height;
		var exrtra = obj.exrtra;
			//baseUrl = obj.url;
			density = obj.density;
		var paramStr = "settingArea=" + area + "&width=" + width + "&height=" + height;
		initIndex(paramStr);
		
	}
};
/**
 * 根据请求参数 请求数据 并显示页面
 */
function initIndex(paramStr) {
	paramJson = getJsonByParamStr(paramStr);
	if (!paramJson.settingArea) {
		return;
}
//分析参数对象并创建轮播图对象
var results = paramJson.settingArea.split(",");
for (var i = 0, len = results.length; i < len; i++) {
	var result = results[i].split("-");
	if (result.length > 0) {
		var city = result[0];
		var area = result[1];
		var obj = new LunBoObj();
		obj.city = city;
		obj.area = area;
		obj.index = i;
		res.push(obj);
	}
}
//自适应视野大小
var containerSize = setContainer(paramJson.width, paramJson.height);
//完善轮播图对象属性
 imgW = containerSize.width - imgOffsetW;
 imgH = containerSize.height - imgOffsetH;
//生成静态结构
for (var i = 0; i < res.length; i++) {
	$.trim(res[i].area)

	var str = "北京市交通委员会(www.bjjtw.gov.cn)发布的公开数据";
	var heplpage = "beijing";
	if ($.trim(res[i].city) == "深圳") {
		str = "深圳市交通委员会(szmap.sutpc.com)发布的公开数据";
		heplpage = "shenzhen";
	}else if($.trim(res[i].city) == "杭州"){
				str = "杭州市综合交通研究中心(www.hzjtydzs.com)发布的公开数据"
				heplpage = "hangzhou";
			}else if($.trim(res[i].city) == "上海"){
				str = "上海市城乡建设和交通发展研究院(www.jtcx.sh.cn)"
				heplpage = "shanghai";
			};;
	htmlObj = generalLunboHtmlIndex(res[i].city, res[i].area, i, str, heplpage,paramJson.width, paramJson.height);
	obj.imgId = htmlObj.imgId;
	obj.html = htmlObj.html;
	//把轮播图DOM结构添加到轮播图组件容器中
	$("#indexCon").append(obj.html);
	//创建Tab DOM结构
	var tabHtml;
	/*if (!isNavTabInited) {
		tabObj = generalTabHtml(tabIndex, true);
		isNavTabInited = true;
	} else {
		tabObj = generalTabHtml(tabIndex, false);
	}*/
	tabObj = generalTabHtml(tabIndex);
	tabIndex++;

	//把Tab结构加入到轮播图导航组件中
	$("#tabNav").append(tabObj.html);
	obj.tabId = tabObj.id;
	var url = baseUrl + "/api2/v3/trafficIndexpic?cityname=" + $.trim(res[i].city) + "&area=" + $.trim(res[i].area) + "&width=" + Math.floor(imgW*density) + "&height=" + Math.floor(imgH*density);
	imageUrlRes.push(url);
	var item = new ImageItem(imgW, imgH, imageUrlRes[i],i);
	imageObjRes.push(item);
	$("#" + htmlObj.imgId).css("width", imgW).css("height", imgH);
};
if (typeof(localStorage.cid)=="undefined") {
		localStorage.cid=0;
};
run(localStorage.cid);
getData();
//请求网络,获取指数数据
//reflesh();


};
/**
 * 分析参数字符串返回JSON对象
 * @param  {String} str 参数字符串
 * @return {Object}
 * @example
 * var str = "str1=111&str2=222";
 * var json = getJsonByParamStr(str);
 */
function getJsonByParamStr(str) {
	var params = str.split("&");
	var param, key, val, paramJson = {};
	for (var i = 0, len = params.length; i < len; i++) {
		param = params[i].split("=");
		key = param[0];
		val = param[1];
		if (key) {
			paramJson[key] = val;
		}
	}
	return paramJson;
};
/**
 * 设置页面宽高
 */
function setContainer(width, height) {
	var trafficContainerJQ = $("#trafficContainer");
	var trafficContainerW = width || 320;
	var trafficContainerH ='auto'/*height || 360*/;
	//设置背景容器的大小
	trafficContainerJQ.css("width", trafficContainerW)/*.css("height", trafficContainerH)*/;
	//设置背景图片的大小
	var myDate = new Date();
	var hour = myDate.getHours()
	
	return {
		width : trafficContainerW,
		height : trafficContainerH
	};
};

/**
 * 生成tab页DOM结构()
 */
function generalTabHtml(index) {
	var id = "lunboli" + index;
	var html = "<li id='" + id + "' ";
	if (typeof(localStorage.cid)=="undefined"||res.length==1) {
		localStorage.cid=0;
		html += "class='active'";
	};
	if(localStorage.transformid>res.length){
		localStorage.cid=0;
		html += "class='active'";
	}
	if (index==localStorage.cid) {
		html += "class='active'";
	}
	html += "></li>";
	return {
		id : id,
		html : html
	}
};

/**
 * 生成交通实时信息DOM结构
 */
function generalLunboHtmlIndex(city, area, index, str, heplpage,width,height) {
	var lunboImgId = "lunboImg" + index;
	var htmls = [];
	htmls.push("<div class='wgay'>");
	htmls.push("<div class='t'>");
	htmls.push("<div class='add' id='city_" + index + "'>" + city + " </div>");
	htmls.push("<div class='d'><div id='area_" + index + "'>" + area + " </div>");
	htmls.push("<div id ='degree_" + index + "'> -- </div></div>");
	htmls.push("<div class='p'>平均速度:" + "<span id ='speed_" + index + "'> -- </span>" + "km/h<br/>" + "<span id ='month_" + index + "'> -- </span>" + "月" + "<span id ='day_" + index + "'> -- </span>" + "日" + " " + "<span id ='time_" + index + "'> -- </span>" + "</div>");
	htmls.push("<div class='s'>" + "<span id ='trafficindex_" + index + "'> -- </span>" + "</div>");
    htmls.push("<div class='b'>");
	htmls.push("<img id='share_" + index + "'  class='img3' src='images/icon_share.png' >");
	//htmls.push("<img id='list_" + index + "' class='img4' src='images/icon_detail.png' onclick='godetail("+city+","+width+","+height+")'> ");
	htmls.push("<img id='list_" + index + "' class='img4' src='images/icon_detail.png' onclick=\"godetail('" + city + "'," + width + "," + height + ")\"> ");
	htmls.push("<img id='help_" + index + "' class='img5' src='images/icon_help.png' onclick=\"javaScript:location.href='index_help_" + heplpage + ".html';window.localStorage.pre='index.html';\" >");
	htmls.push("</div></div>");
    
	htmls.push("<div class='wimg' id='");
	htmls.push(lunboImgId);
	htmls.push("'>");
	htmls.push("<b d ='jiazai_"+index+"' style='margin:0 auto;position:absolute;top:50%;left:30%;' >正在努力加载中...</b>");
	htmls.push("</div>");
	htmls.push("<div class='ly'>数据来源:" + str + "</div>");
	htmls.push("<script type='text/javascript'>	"+
	"$(function() {document.getElementById('share_" + index + "').addEventListener('touchstart', function() {"+
	"$('#share_" + index + "').attr('src','images/icon_share_pressed.png');});"+
	"document.getElementById('share_" + index + "').addEventListener('touchend', function() {"+
	"window.share.shareMethod($('#city_" + index + "').text()+' '+$('#area_" + index + "').text());"+
	"$('#share_" + index + "').attr('src','images/icon_share.png');});});");
	
	htmls.push("$(function() {document.getElementById('list_" + index + "').addEventListener('touchstart', function() {"+
	"$('#list_" + index + "').attr('src','images/icon_detail_pressed.png');});"+
	"document.getElementById('list_" + index + "').addEventListener('touchend', function() {"+
	"$('#list_" + index + "').attr('src','images/icon_detail.png');});});");

	htmls.push("$(function() {document.getElementById('help_" + index + "').addEventListener('touchstart', function() {"+
	"$('#help_" + index + "').attr('src','images/icon_help_pressed.png');});"+
	"document.getElementById('help_" + index + "').addEventListener('touchend', function() {"+
	"$('#help_" + index + "').attr('src','images/icon_help_pressed.png');});});");
	htmls.push("</script>");
	return {
		imgId : lunboImgId,
		html : htmls.join("")
	};
};


/**
 * 执行网页轮换效果
 */
function run(index) {
	imageObjRes[index].loadImage();
	var elem = document.getElementById("mySwipe");
	Swipe(elem, {
		startSlide :localStorage.cid,
		continuous : false,
		disableScroll : false,
		//auto:3000,
		callback : function(index) {
			
			var id = "lunboli" + index;
			
			$("#lunboli" + localStorage.cid).removeClass("active");
			$("#" + saveid).removeClass("active");
			$("#" + id).addClass("active");
			saveid = id;
			localStorage.cid = index;
		},
        //transitionEnd用于整体轮播图动画结束后触发的回调函数
        transitionEnd: function(index, element) {
            imageObjRes[index].loadImage();
        }
	});
}
/**
 * 请求指数数据 并显示
 */
function getData() {
	if(htmlObj==null){
		alert("数据未加载完成,请稍候刷新!");
		return;
	}
	if (!paramJson.settingArea) {
		return;
	}
	var date = new Date();
	var items = [];
	//alert(paramJson.settingArea);
	//请求网络,获取指数数据
	$.ajax({
		
		url : baseUrl +"/api2/v3/trafficIndexJsonp",
		type : 'GET',
		//async : false,
		data : {
			cityname : $.trim(paramJson.settingArea),
			areaname : true
		},beforeSend: function(XMLHttpRequest){
			//alert("请求发出啦!------"+date.getTime() );
		},
		dataType : 'jsonp',
		jsonp : 'callback',
		//timeout:3000,
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("暂时没有数据!");
			//alert("请求失败啦!------"+date.getTime() );
		},

		success : function(result) {
		//alert("请求成功啦!------"+date.getTime() );
			$.each(result.trafficIndexList, function(i, item) {
				items.push(item);
			});
			for (var i = 0; i < res.length; i++) {
				for (var j = 0; j < items.length; j++) {

					var item = items[j];
					if ($.trim(res[i].area) == $.trim(item.area)) {
						var obj = res[i];
						obj.imgW = imgW;
						obj.imgH = imgH;
						$("#degree_" + i).text("").append(item.degree);
						$("#speed_" + i).text("").append(item.speed);
						$("#month_" + i).text("").append(item.publishedDate.split("-")[1]);
						$("#day_" + i).text("").append(item.publishedDate.split("-")[2]);
						$("#time_" + i).text("").append(item.publishedTime);
						$("#trafficindex_" + i).text("").append(item.index);
						obj.imgId = htmlObj.imgId;
						obj.html = htmlObj.html;
					}
				}
			}
			//alert("数据更新成功!");
		}
	});
	 
}
function reflesh() {
	if(htmlObj==null){
		alert("数据未加载完成,请稍候刷新!");
		return;
	}
	if (!paramJson.settingArea) {
		return;
	}
	var date = new Date();
	var items = [];
	//请求网络,获取指数数据
	$.ajax({
		url : baseUrl +"/api2/v3/trafficIndexJsonp",
		type : 'GET',
		//async : false,
		data : {
			cityname : $.trim(paramJson.settingArea),
			areaname : true
		},
		
		dataType : 'jsonp',
		jsonp : 'callback',
		//timeout:3000,
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("暂时没有数据!");
			//alert("请求失败啦!------"+date.getTime() );
		},

		success : function(result) {
		//alert("请求成功啦!------"+date.getTime() );
			$.each(result.trafficIndexList, function(i, item) {
				items.push(item);
			});

			for (var i = 0; i < res.length; i++) {
				for (var j = 0; j < items.length; j++) {

					var item = items[j];
					//alert(item);
					if ($.trim(res[i].area) == $.trim(item.area)) {
						var obj = res[i];
						obj.imgW = imgW;
						obj.imgH = imgH;
						//alert(imgW+"-"+imgH);
						$("#test").html("width=" + Math.floor(imgW*density) + "&height=" + Math.floor(imgH*density));
						$("#degree_" + i).text("").append(item.degree);
						$("#speed_" + i).text("").append(item.speed);
						$("#month_" + i).text("").append(item.publishedDate.split("-")[1]);
						$("#day_" + i).text("").append(item.publishedDate.split("-")[2]);
						$("#time_" + i).text("").append(item.publishedTime);
						$("#trafficindex_" + i).text("").append(item.index);
						obj.imgId = htmlObj.imgId;
						obj.html = htmlObj.html;
						
					}
				}
			}
			imageObjRes[localStorage.cid].isImageLoaded=false;
			imageObjRes[localStorage.cid].loadImage();
			alert("数据更新成功!");
		}
	});
}
//-------------------------------------------indexList-----------------------------------
/**
 * 初始化调用
 */
function init() {
		var width = localStorage.width;
		var height = localStorage.height;
		//自适应视野大小
		var containerSize = setContainerList(width, height);
		if (width > 0) {
			$("#listContainer").css("width", width + "px");
		}
		generalLunboHtmlList();

	};
/**
 * 初始化页面宽高
 */
function setContainerList(width, height) {
		var trafficContainerJQ = $("#trafficContainer");
		var trafficContainerW = width || 320;
		var trafficContainerH = height || 360;
		//设置背景容器的大小
		trafficContainerJQ.css("width", trafficContainerW).css("height", trafficContainerH);
		//设置背景图片的大小
		//$("#indexCon").css("top", -trafficContainerH);
		$("#shadow").css("height", trafficContainerH);
		var myDate = new Date();
		var hour = myDate.getHours()
		return {
			width : trafficContainerW,
			height : trafficContainerH
		};
	};
var myScroll = null;
/**
 * 生成交通实时信息DOM结构
 */
function generalLunboHtmlList() {
	var city = $.trim(localStorage.city);
	var helppage = "beijing";
	if (city == "深圳") {
		helppage = "shenzhen";
	}else if(city == "杭州"){
		helppage = "hangzhou";
	}else if(city == "上海"){
		helppage = "shanghai";
	}
	var htmls = [];
	var time = "";
	//htmls.push("<div class='bg' id='shadow'>");
	htmls.push("<div class='t'>");
	htmls.push("<div class='add' id='city'>");
	htmls.push(city);
	htmls.push("</div>");
	htmls.push("<div class='d2'id='time'>");
	htmls.push("</div>");
	htmls.push("<div class='p'> </div>");
	htmls.push("<div class='c'><ul>");
	htmls.push("<img id='share'  class='img4' src='images/icon_share.png' >");
	htmls.push("<img id='help' class='img5' src='images/icon_help.png' onclick=\"javaScript:location.href='index_help_" + helppage + ".html';window.localStorage.pre='index_list.html';\" >");
	htmls.push("</ul></div></div>");
	
	htmls.push("<div class='waiting' id='waiting'>");
	htmls.push("<b  style='margin:0 auto;position:absolute;top:35%;left:30%;' >正在努力加载中...</b>");
	htmls.push("</div>");
	
	var html = htmls.join("")
	$("#shadow").append(html);
	
	$.ajax({
		url : baseUrl+"/api2/v3/trafficIndexJsonp",
		type : 'GET',
		async : false,
		data : {
			cityname : city,
			areaname : false
		},
		dataType : 'jsonp',
		jsonp : 'callback',
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("error:" + errorThrown);
		},

		success : function(result) {
		var htmls1 = [];
			var str = "北京市交通委员会(www.bjjtw.gov.cn)发布的公开数据";
			if (city == "深圳") {
				str = "深圳市交通委员会(szmap.sutpc.com)发布的公开数据";
			}else if(city == "杭州"){
				str = "杭州市综合交通研究中心(www.hzjtydzs.com)发布的公开数据"
			}else if(city == "上海"){
				str = "上海市城乡建设和交通发展研究院(www.jtcx.sh.cn)"
			};
			$.each(result.trafficIndexList, function(i, item) {
				if (!time) {
					time = item.publishedDate.substring(5) + " " + item.publishedTime
				};
				var bgcolor = "#008000";
				var textcolor = "white";
				if (item.degree == "畅通") {
					bgcolor = "#008000";

				} else if (item.degree == "基本畅通"||item.degree == "较畅通") {
					bgcolor = "#00FF00";
					textcolor = "black";
				} else if (item.degree == "轻度拥堵"||item.degree == "拥挤") {
					textcolor = "black";
					if (item.cityName == "北京"||item.cityName == "上海") {
						bgcolor = "#FFFF00";
					} else {
						bgcolor = "#FF6600";
					};

				} else if (item.degree == "中度拥堵") {
					textcolor = "black";
					bgcolor = "#FF6600";
				} else if (item.degree == "严重拥堵"||item.degree == "堵塞") {
					bgcolor = "#CC0000";
				} else if (item.degree == "拥堵") {
					bgcolor = "#CC0000";
				} else if (item.degree == "缓行") {
					textcolor = "black";
					bgcolor = "#FFFF00";
				}
				;
		
				htmls1.push("<div  style='background: " + bgcolor + "; opacity: .60;display:block ;margin:0px;padding:0px;border-bottom:1px #ccc solid;border-left:1px #ccc solid;border-right:1px #ccc solid;font-size: 13px ;height:24px'>	<span style='text-align:center;float:left;margin-left: 8px;width:130px;color:" + textcolor + "'>" + item.area + " </span><span  style='margin-left: 10px;color:" + textcolor + ";'> " + item.index + " </span><span style='margin-left: 20px;color:" + textcolor + ";'>  " + item.degree + "</span><span style='float:right;margin-right:15px;color:" + textcolor + ";'> " + item.speed + "km/h </span></div>");

			});
			
			// htmls1.push("<div class='ly2' >数据来源:" + str + "</div>");
			htmls1.push("<script type='text/javascript'>	" + "$(function() {document.getElementById('share').addEventListener('touchstart', function() {$('#share').attr('src','images/icon_share_pressed.png');});" + "document.getElementById('share').addEventListener('touchend', function() {" + "window.share.shareMethod($('#city').text());$('#share').attr('src','images/icon_share.png');});});");


			htmls1.push("$(function() {document.getElementById('help').addEventListener('touchstart', function() {" + "$('#help').attr('src','images/icon_help_pressed.png');});" + "document.getElementById('help').addEventListener('touchend', function() {" + "$('#help').attr('src','images/icon_help.png');});});");
			htmls1.push("</script>");
			var html = htmls1.join("")
			// $("#shadow").append(html);
			$("#listRes").html(html);
			$("#time").html(time);
			$("#datasource").html("数据来源:" + str );
			$("#waiting").hide();
			
			if (!myScroll) {
				myScroll = new IScroll('#listContainer', {mouseWheel:true});
			}
			setTimeout(function () {
		        myScroll.refresh();
		    }, 10);
		}
	});

};
(function() {
	$(function(){
		var url = window.location.href;
		if(url.indexOf("index.html")>-1){
		initByParam(window.indexInt.indexIntMethod());
		//initByParam("{\"area\":\"上海-总路网(快速路)\",\"width\":360,\"height\":515,\"url\":\"http:\/\/mobile.trafficeye.com.cn:8000\",\"density\":\"2.0\"}");
		}else{
			init();
		}
	$(".wgay *").css("color","#181818");
	$(".wgay").css("background","none");
	});
})();