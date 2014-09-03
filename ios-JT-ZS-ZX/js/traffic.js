var baseUrl = "http://mobile.trafficeye.com.cn:8000";
var testUrl='http://mobiletest.trafficeye.com.cn:18080/TrafficeyeSevice_test';
//var baseUrl = "http://mobile.trafficeye.com.cn:8008/TrafficeyeSevice_test";
//上bar和下bar的高度之和
var window_h = document.documentElement.clientHeight;
var window_w = document.documentElement.clientWidth;
var target_scroll_top=0;
var offsetHeight = 100;
var imgOffsetW = 20;
var imgOffsetH = 180;
var density=2.0;
//轮播图对象集合
var res = [];
var imageUrlRes = [];
var imageObjRes = [];
var isNavTabInited = false;
var saveid = "lunboli0";
var tabIndex = 0;
var paramJson;
var LunBoObj = function() {
	this.imgId = "";
	this.city = "";
	this.area = "";
	this.index = 0;
	this.inited = false;
	this.html = "";
	this.tabId = "";
};
var htmlObj;
//每个轮播图片页面对象
function ImageItem(i) {
    this.inited = true;
    this.containerElem = null;
    this.imageParentElem = null;
	this.i= i;
	 //判断图片是否加载成功
    //this.isImageLoaded = false;
};
ImageItem.prototype = {
    //延迟加载图片页面中包含的img元素
    loadCharts : function() {
        var me = this;
		var city=$.trim(paramJson.split(',')[me.i].split('-')[0]);
		var city_code=$.trim(paramJson.split(',')[me.i].split('-')[1]);
		var area=$.trim(paramJson.split(',')[me.i].split('-')[2]);
		var area_code=$.trim(paramJson.split(',')[me.i].split('-')[3]);
		var typeIndex=$.trim(paramJson.split(',')[me.i].split('-')[4])
		//console.log(city+','+city_code+','+area+','+area_code+','+typeIndex);
		if(typeIndex==1||typeIndex==2){
			newCharts(me,city,city_code,area,area_code,typeIndex);
		}
		if(typeIndex==0||typeIndex==1){
			oldCharts(me,city,city_code,area,area_code);
		};
	}
};
function oldCharts(me,city,city_code,area,area_code){
	$("#lunboImg" + me.i).html("");
			$("#lunboImg" + me.i).append("<b id ='jiazai_"+me.i+"'style='margin:0 auto;position:absolute;top:50%;left:30%;' >正在努力加载中...</b>");
	document.getElementById('share_'+me.i).addEventListener('touchstart',function() {
		window.scrollTo(0,target_scroll_top);
	},false);//分享当前指数图	
	$.ajax({
		type:'get',
		url:testUrl+'/api/v4/trafficIndexChartData',
		data:{
			city:city,
			area:area	
		},
		dataType:'jsonp',
		success:function(data){
			//alert(JSON.stringify(data));
			if(data.state.code==0){
				var theData=data.indexData;
				//console.log(JSON.stringify(theData));
				$("#degree_" +me.i).text("").append(theData.degree);
				$("#speed_" +me.i).text("").append(theData.speed);
				$("#month_" +me.i).text("").append(theData.publishedTime.split(" ")[0].split('-')[1]);
				$("#day_" +me.i).text("").append(theData.publishedTime.split(" ")[0].split('-')[2]);
				$("#time_" +me.i).text("").append(theData.publishedTime.split(" ")[1]);
				$("#trafficindex_" +me.i).text("").append(theData.index[theData.index.length-1]);
					
				var imgDraw=document.createElement('div');
				imgDraw.id='imgDraw'+me.i;
				imgDraw.style.height=window_h-190+'px';
				$("#lunboImg" + me.i).append(imgDraw);
				draw_charts({'id':'imgDraw'+me.i,'city':city,'place':area,'yData1':theData.index_lastweek,'yData2':theData.index,'maxData':theData.maxValue});//模块ID,城市,区域,上周五数据,今日数据,Y轴最大值//测试数据
			$('#mySwipe').height($('.wgay').eq(me.i).height());
			}else if(data.state.code==-9){
				alert(data.state.dest);	
			};
			
		},
		error:function(xmlHttpReq,textStatus,errorThrown){
			alert('加载数据失败!请稍后重试');	
		}
		
	});
};
function newCharts(me,city,city_code,area,area_code,typeIndex){
	document.getElementById('reshare_'+me.i).addEventListener('touchstart',function() {
		window.scrollTo(0,0);
	},false);//分享当前指数图	
	$("#relunboImg" + me.i).html("");
	$("#relunboImg" + me.i).append("<b id ='jiazai_"+me.i+"'style='margin:0 auto;position:absolute;top:50%;left:30%;' >正在努力加载中...</b>");
	$.ajax({
		type:'get',
		url:testUrl+'/api/v4/ctrafficIndexChartData',
		data:{
			code:city_code,
			area:area_code	
		},
		dataType:'jsonp',
		success:function(data){
			//console.log(JSON.stringify(data));
			if(data.state.code==0){
				var theData=data.indexData;
				//console.log(JSON.stringify(theData));
				$("#redegree_" +me.i).text("").append(theData.degree);
				$("#respeed_" +me.i).text("").append(theData.speed);
				$("#remonth_" +me.i).text("").append(theData.publishedTime.split(" ")[0].split('-')[1]);
				$("#reday_" +me.i).text("").append(theData.publishedTime.split(" ")[0].split('-')[2]);
				$("#retime_" +me.i).text("").append(theData.publishedTime.split(" ")[1]);
				$("#retrafficindex_" +me.i).text("").append(theData.index[theData.index.length-1]);


				var reDraw=document.createElement('div');
				reDraw.id='reDraw'+me.i;
				reDraw.style.height=window_h-190+'px';
				if(typeIndex==1){
					reDraw.style.height=window_h-180+'px';
				};
				$("#relunboImg" + me.i).append(reDraw);
				draw_charts_copy({'id':'reDraw'+me.i,'city':city,'place':area,'yData1':theData.index_lastweek,'yData2':theData.index,'maxData':theData.maxValue});//模块ID,城市,区域,上周五数据,今日数据,Y轴最大值//测试数据
		$('#mySwipe').height($('.wgay').eq(me.i).height());
			}
			
		},
		error:function(xmlHttpReq,textStatus,errorThrown){
			alert('加载数据失败!请稍后重试');	
		}
		
	});//设置第二张指数图
};
/**
 * 设置首页请求参数
 */
function initByParam(obj) {
	if (obj) {
		obj = $.parseJSON(obj);
		var allData = obj.area;
			//baseUrl = obj.url;
			//density = obj.density;
		initIndex(allData);
		
	}
};
/**
 * 根据请求参数 请求数据 并显示页面
 */
function initIndex(paramStr) {
	paramJson = paramStr;
	if (!paramJson) {
		return;
	}
//分析参数对象并创建轮播图对象
	var results = paramJson.split(',');
	//console.log(results)
	for (var i = 0, len = results.length; i < len; i++) {
		var result = results[i].split("-");
		if (result.length > 0) {
			var obj = new LunBoObj();
			obj.city = result[0];
			obj.city_code = result[1];
			obj.area = result[2];
			obj.area_code = result[3];
			obj.typeIndex = result[4];
			res.push(obj);
		}
	}
	//生成静态结构
	for (var i = 0; i < res.length; i++) {
		var typeIndex=$.trim(res[i].typeIndex);
		var heplpage = "beijing";
		if ($.trim(res[i].city) == "深圳") {
			heplpage = "shenzhen";
		}else if($.trim(res[i].city) == "杭州"){
					heplpage = "hangzhou";
				}else if($.trim(res[i].city) == "上海"){
					heplpage = "shanghai";
				};
		htmlObj = generalLunboHtmlIndex(res[i].city,res[i].city_code, res[i].area, i, heplpage,typeIndex);
		obj.imgId = htmlObj.imgId;
		obj.html = htmlObj.html;
		//把轮播图DOM结构添加到轮播图组件容器中
		$("#indexCon").append(obj.html);
		//创建Tab DOM结构
		var tabHtml;
		tabObj = generalTabHtml(tabIndex);
		tabIndex++;
	
		//把Tab结构加入到轮播图导航组件中
		$("#tabNav").append(tabObj.html);
		obj.tabId = tabObj.id;
		var item = new ImageItem(i);
		imageObjRes.push(item);
	};
	alert(localStorage.cid+','+'加载完结构了!');
	if (typeof(localStorage.cid)=="undefined") {
			localStorage.cid=0;
	};
	//请求网络,获取指数数据
	window.addEventListener('scroll',function(){
		target_scroll_top=document.body.offsetHeight-document.documentElement.clientHeight;
	});
	window.addEventListener('load',function(){
		window.scrollTo(0,0);
	});
	alert('加载数据前!');
	run(localStorage.cid);
	alert('加载数据后!');
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
function generalLunboHtmlIndex(city,city_code, area, index, heplpage,typeIndex) {
	var htmls = [];
	var theH=window_h-190;
	if(typeIndex==1){
		theH=window_h-180;
	};
	htmls.push("<div class='wgay' style='width:"+window_w+"px;'>");
	if(typeIndex==1||typeIndex==2){
		var relunboImgId = "relunboImg" + index;
		htmls.push("<div class='t'>");
		htmls.push("<div class='add' id='recity_" + index + "'>" + city + " </div>");
		htmls.push("<div class='d'><div id='rearea_" + index + "'>" + area + " </div>");
		htmls.push("<div id ='redegree_" + index + "'> -- </div></div>");
		htmls.push("<div class='dataSource'>四维指数</div>");
		htmls.push("<div class='p'>平均速度:" + "<span id ='respeed_" + index + "'> -- </span>" + "km/h<br/>" + "<span id ='remonth_" + index + "'> -- </span>" + "月" + "<span id ='reday_" + index + "'> -- </span>" + "日" + " " + "<span id ='retime_" + index + "'> -- </span>" + "</div>");
		htmls.push("<div class='s'>" + "<span id ='retrafficindex_" + index + "'> -- </span>" + "</div>");
		htmls.push("<div class='b'>");
		htmls.push("<img id='reshare_" + index + "'  class='img3' src='images/icon_share.png' >");
		htmls.push("<img id='relist_" + index + "' class='img4' src='images/icon_detail.png' onclick=\"godetail('" + city + "','" + city_code + "','" + typeIndex + "')\"> ");
		htmls.push("<img id='rehelp_" + index + "' class='img5' src='images/icon_help.png' onclick=\"javaScript:location.href='index_help_" + heplpage + ".html';window.localStorage.pre='index.html';\" >");
		htmls.push("</div></div>");
		
		htmls.push("<div class='wimg' style='height:"+theH+"px;' id='");
		htmls.push(relunboImgId);
		htmls.push("'>");
		htmls.push("<b d ='rejiazai_"+index+"' style='margin:0 auto;position:absolute;top:50%;left:30%;' >正在努力加载中...</b>");
		htmls.push("</div>");
		htmls.push("<script type='text/javascript'>	"+
               "$(function() {document.getElementById('reshare_" + index + "').addEventListener('touchstart', function() {"+
               "$('#reshare_" + index + "').attr('src','images/icon_share_pressed.png');});"+
               "document.getElementById('reshare_" + index + "').addEventListener('touchend', function() {"+
               "share($('#city_" + index + "').text()+' '+$('#area_" + index + "').text());  "+
               "$('#reshare_" + index + "').attr('src','images/icon_share.png');});});");
		
		htmls.push("$(function() {document.getElementById('relist_" + index + "').addEventListener('touchstart', function() {"+
		"$('#relist_" + index + "').attr('src','images/icon_detail_pressed.png');});"+
		"document.getElementById('relist_" + index + "').addEventListener('touchend', function() {"+
		"$('#relist_" + index + "').attr('src','images/icon_detail.png');});});");
	
		htmls.push("$(function() {document.getElementById('rehelp_" + index + "').addEventListener('touchstart', function() {"+
		"$('#rehelp_" + index + "').attr('src','images/icon_help_pressed.png');});"+
		"document.getElementById('rehelp_" + index + "').addEventListener('touchend', function() {"+
		"$('#rehelp_" + index + "').attr('src','images/icon_help_pressed.png');});});");
		htmls.push("</script>");//第二张图的dom
	};
	if(typeIndex==0||typeIndex==1){
		var str = "北京交委";
		if (city== "深圳") {
			str = "深圳交委";
		}else if(city== "杭州"){
			str = "杭州交委"
		}else if(city== "上海"){
			str = "上海交委"
		};
		var T_css='';
		var lunboImgId = "lunboImg" + index;
		htmls.push("<div class='t'>");
		htmls.push("<div class='add' id='city_" + index + "'>" + city + " </div>");
		htmls.push("<div class='d'><div id='area_" + index + "'>" + area + " </div>");
		htmls.push("<div id ='degree_" + index + "'> -- </div></div>");
		htmls.push("<div class='dataSource' style='background:#F89E4C;'>"+str+"</div>");
		htmls.push("<div class='p'>平均速度:" + "<span id ='speed_" + index + "'> -- </span>" + "km/h<br/>" + "<span id ='month_" + index + "'> -- </span>" + "月" + "<span id ='day_" + index + "'> -- </span>" + "日" + " " + "<span id ='time_" + index + "'> -- </span>" + "</div>");
		htmls.push("<div class='s'>" + "<span id ='trafficindex_" + index + "'> -- </span>" + "</div>");
		htmls.push("<div class='b'>");
		htmls.push("<img id='share_" + index + "'  class='img3' src='images/icon_share.png' >");
		htmls.push("<img id='list_" + index + "' class='img4' src='images/icon_detail.png' onclick=\"godetail('" + city + "','" + city_code + "','" + typeIndex + "')\"> ");
		htmls.push("<img id='help_" + index + "' class='img5' src='images/icon_help.png' onclick=\"javaScript:location.href='index_help_" + heplpage + ".html';window.localStorage.pre='index.html';\" >");
		htmls.push("</div></div>");
		
		htmls.push("<div class='wimg' style='height:"+(window_h-190)+"px;' id='");
		htmls.push(lunboImgId);
		htmls.push("'>");
		htmls.push("<b d ='jiazai_"+index+"' style='margin:0 auto;position:absolute;top:50%;left:30%;' >正在努力加载中...</b>");
		htmls.push("</div>");
		htmls.push("<script type='text/javascript'>	"+
               "$(function() {document.getElementById('share_" + index + "').addEventListener('touchstart', function() {"+
               "$('#share_" + index + "').attr('src','images/icon_share_pressed.png');});"+
               "document.getElementById('share_" + index + "').addEventListener('touchend', function() {"+
               "share($('#city_" + index + "').text()+' '+$('#area_" + index + "').text());  "+
               "$('#share_" + index + "').attr('src','images/icon_share.png');});});");
		
		htmls.push("$(function() {document.getElementById('list_" + index + "').addEventListener('touchstart', function() {"+
		"$('#list_" + index + "').attr('src','images/icon_detail_pressed.png');});"+
		"document.getElementById('list_" + index + "').addEventListener('touchend', function() {"+
		"$('#list_" + index + "').attr('src','images/icon_detail.png');});});");
	
		htmls.push("$(function() {document.getElementById('help_" + index + "').addEventListener('touchstart', function() {"+
		"$('#help_" + index + "').attr('src','images/icon_help_pressed.png');});"+
		"document.getElementById('help_" + index + "').addEventListener('touchend', function() {"+
		"$('#help_" + index + "').attr('src','images/icon_help_pressed.png');});});");
		htmls.push("</script></div>");//第一张图的dom
	};
	
	
	return {
		imgId : lunboImgId,
		html : htmls.join("")
	};
};


/**
 * 执行网页轮换效果
 */
function run(index) {
	imageObjRes[index].loadCharts();
	//imageObjRes[index].reLoadCharts();
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
            imageObjRes[index].loadCharts();
        }
	});
}
function reflesh(){
	window.scrollTo(0,0);
	window.location.reload('get');	
};
/**
 * 请求指数数据 并显示
 */

//-------------------------------------------indexList-----------------------------------
/**
 * 初始化调用
 */
function init() {
		//自适应视野大小
		generalLunboHtmlList();
		setContainerList()
	};
/**
 * 初始化页面宽高
 */
function setContainerList() {
		//设置背景图片的大小
		$("#shadow").css("height", $(window).height()-44);
		$('#listContainer').height($(window).height()-44-60);
	};
var myScroll = null;
/**
 * 生成交通实时信息DOM结构
 */
function generalLunboHtmlList() {
	var city = $.trim(localStorage.city);
	var city_code=$.trim(localStorage.city_code);
	var typeIndex=$.trim(localStorage.typeIndex);
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
	htmls.push("<script type='text/javascript'>	" + "$(function() {document.getElementById('share').addEventListener('touchstart', function() {$('#share').attr('src','images/icon_share_pressed.png');});" + "document.getElementById('share').addEventListener('touchend', function() {" + "share($('#city').text()+' '+$('#area').text()); $('#share').attr('src','images/icon_share.png');});});");

	htmls.push("$(function() {document.getElementById('help').addEventListener('touchstart', function() {" + "$('#help').attr('src','images/icon_help_pressed.png');});" + "document.getElementById('help').addEventListener('touchend', function() {" + "$('#help').attr('src','images/icon_help.png');});});");
	htmls.push("</script>");
	
	var html = htmls.join("")
	$("#shadow").append(html);
	
	//alert(typeIndex);
	if(typeIndex==0||typeIndex==1){
		//alert('不该执行');
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
				var str = "北京市交通委员会";
				if (city == "深圳") {
					str = "深圳市交通委员会";
				}else if(city == "杭州"){
					str = "杭州市综合交通研究中心"
				}else if(city == "上海"){
					str = "上海市城乡建设和交通发展研究院"
				};
				htmls1.push('<h3 class="zsTit">'+str+'</h3>');
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
					};
					
			
					htmls1.push("<div  style='background: " + bgcolor + "; opacity: .60;display:block ;margin:0px;padding:0px;border-bottom:1px #ccc solid;border-left:1px #ccc solid;border-right:1px #ccc solid;font-size: 13px ;height:24px'>	<span style='text-align:center;float:left;margin-left: 8px;width:130px;color:" + textcolor + "'>" + item.area + " </span><span  style='margin-left: 10px;color:" + textcolor + ";'> " + item.index + " </span><span style='margin-left: 20px;color:" + textcolor + ";'>  " + item.degree + "</span><span style='float:right;margin-right:15px;color:" + textcolor + ";'> " + item.speed + "km/h </span></div>");
	
				});//老数据列表
				
				var html = htmls1.join("")
				// $("#shadow").append(html);
				$("#listRes").html(html);
				$("#time").html(time);
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
	if(typeIndex==1||typeIndex==2){
		$.ajax({
		url : testUrl+"/api/v4/ctrafficIndexList",
		type : 'GET',
		data : {
			code : city_code
		},
		dataType : 'jsonp',
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("error:" + errorThrown);
		},

		success : function(result) {
			if(result.state.code==0){
				var htmls1 = [];
				htmls1.push('<h3 class="zsTit">四维路况指数</h3>');
				var time=result.publishedTime.split(' ')[0].substring(5)+' '+result.publishedTime.split(' ')[1].substring(0,5)
				//console.log(JSON.stringify(result.trafficIndexList));
				$.each(result.trafficIndexList, function(i, item) {
					var bgcolor = "#008000";
					var textcolor = "#000";
					
					if(item.degree=='畅通'){
						bgcolor='rgb(0,136,0)';
					}else if(item.degree=='基本畅通'){
						bgcolor='rgb(153,220,0)';
					}else if(item.degree=='缓慢'){
						bgcolor='rgb(255,255,1)';
					}else if(item.degree=='拥堵'){
						bgcolor='rgb(255,187,0)';
					}else if(item.degree=='严重拥堵'){
						bgcolor='rgb(254,2,1)';
					}else if(item.degree=='路网瘫痪'){
						bgcolor='rgb(139,1,1)';
						textcolor = "#fff";
					};
			
					htmls1.push("<div  style='background: " + bgcolor + "; opacity: .60;display:block ;margin:0px;padding:0px;border-bottom:1px #ccc solid;border-left:1px #ccc solid;border-right:1px #ccc solid;font-size: 13px ;height:24px'>	<span style='text-align:center;float:left;margin-left: 8px;width:130px;color:" + textcolor + "'>" + item.area + " </span><span  style='margin-left: 10px;color:" + textcolor + ";'> " + item.index + " </span><span style='margin-left: 20px;color:" + textcolor + ";'>  " + item.degree + "</span><span style='float:right;margin-right:15px;color:" + textcolor + ";'> " + item.speed + "km/h </span></div>");
	
				});//新数据列表
				
				var html = htmls1.join("")
				$("#listRes").html($("#listRes").html()+html);
				$("#time").html()==''&&($("#time").html(time));
				$("#waiting")&&($("#waiting").hide());
				if (!myScroll) {
					myScroll = new IScroll('#listContainer', {mouseWheel:true});
				}
				setTimeout(function () {
					myScroll.refresh();
				}, 10);
			}else if(result.state.code==-9){
				alert('遇到未知错误');	
			};
		}
	});
	};
	

};
function share(shareText){
    shareTextEncode1 = encodeURI(shareText);
    
    shareTextEncode2 = encodeURI(shareTextEncode1);
    window.location.href="objc://"+"share:"+":/"+shareTextEncode2;
}
function gohelp(heplpage) {
	window.localStorage.pre = "index.html";
	window.location.href = "index_help_" + heplpage + ".html";
};
(function() {
 window.Traffic = {};
    Traffic.initByParam = initByParam;

 	$(function(){

		var url = window.location.href;
		if(url.indexOf("index.html")!=-1){
      
		//initByParam('{"area":"北京-110000-全路网-110000-1,北京-110000-昌平区-110114-2,上海-310000-老北站-000000-0,成都-510100-全市-510100-2,上海-310000-上海火车站-000000-0,上海-310000-金桥-310000-0,上海-310000-沪太-000000-0,上海-310000-瑞金医院-000000-0","width":320,"height":465,"url":"http://mobile.trafficeye.com.cn:8000/"}');
		//initByParam('{"area":"上海-310000-瑞金医院-000000-0,北京-110000-海淀区-110108-1","width":320,"height":465,"url":"http://mobile.trafficeye.com.cn:8000/"}')
		}else{
			init();
		}
		
		
	}); 
	
})();