var pic="http://mobile.trafficeye.com.cn:8088/GraphicService_trafficeye/v1/getPic/";
//上bar和下bar的高度之和
var imgOffsetW = 20;
var imgOffsetH = 220;
//轮播图对象集合
var res = [];
var imageUrlRes = [];
var area=[];
var isNavTabInited = false;
var saveid = "lunboli0";
var tabIndex = 0;
var paramJson;
var density = 1;
var LunBoObj = function() {
	this.imgId = "";
	this.imgUrl = "";
	this.imgW = 0;
	this.imgH = 0;
	this.city = "";
	this.code = "";
	this.area = "";
	this.index = 0;
	this.inited = false;
	this.html = "";
	this.tabId = "";
};
var city="";
var htmlObj;
//每个轮播图片页面对象
function ImageItem(width, height, imgUrl,i,id) {
    this.width = width;
    this.height = height;
    this.imgUrl = imgUrl;
    this.inited = true;
    this.imgId = id;
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
			var image = new Image();
			$("#lunboImg" + me.i).html("");
			$("#lunboImg" + me.i).append("<b id ='jiazai_"+me.imgId+"'style='margin:0 auto;position:absolute;top:50%;left:30%;' >正在努力加载中...</b>")
			image.onload = function(event) {	
			if(this.complete){
				me.isImageLoaded = true;
				
			}
			}
			image.onerror = function() {
				var id = this.id;
				$("#jiazai_"+id.split("_")[1]).html("加载数据失败");	
					
				}
			image.width = me.width;
			image.height = me.height;
			image.id="pic_"+me.imgId;
			image.src = me.imgUrl;
			//alert(me.imgUrl);
			$("#lunboImg" + me.i).html("").append(image);
			
		}
    }
};
/**
 * 设置首页请求参数
 */
function initByParam(obj) {
	if (obj) {
	//alert(obj);
		obj = $.parseJSON(obj);
		 area= obj.area;
		var width = document.documentElement.clientWidth;
		var height = document.documentElement.clientHeight;
		var exrtra = obj.exrtra;
			//pic = obj.url;
			
		var paramStr = "width=" + width + "&height=" + height;
		initIndex(paramStr);
		
	}
};
/**
 * 根据请求参数 请求数据 并显示页面
 */
function initIndex(paramStr) {
	paramJson = getJsonByParamStr(paramStr);
	if (area.length==0) {
		return;
}
//分析参数对象并创建轮播图对象
for (var i = 0, len = area.length; i < len; i++) {
		var obj = new LunBoObj();
		obj.city = area[i].city;
		obj.name =  area[i].route_name;
		obj.id =  area[i].route_id;
		obj.timep =  area[i].timep;
		obj.code= area[i].city_code;
		res.push(obj);
		city= city+area[i].city_code+",";
}
//自适应视野大小
var containerSize = setContainer(paramJson.width, paramJson.height);
//完善轮播图对象属性
 imgW = containerSize.width-imgOffsetW;
 imgH = containerSize.height - imgOffsetH;
//生成静态结构
for (var i = 0; i < res.length; i++) {
	//alert(res[i].code);
	$.trim(res[i].name);
	htmlObj = generalLunboHtmlIndex(res[i].city, res[i].name, i,paramJson.width, paramJson.height,res[i].timep,res[i].id,res[i].code);
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
	
	$("#" + htmlObj.imgId).css("width", imgW).css("height", imgH);
	$("#timep_"+res[i].id).text(res[i].timep);
	$("#lunboImg" + i).css("text-align","center");
	var url ="";
	if("000000000"==res[i].code){
		url = pic+res[i].id+"?width="+Math.floor(imgW*density)+"&height="+Math.floor(imgH*density);
	}else{
		 url = pic+res[i].code+"/"+res[i].id+"?width="+Math.floor(imgW*density)+"&height="+Math.floor(imgH*density);
	}
	
	var imgObj = new ImageItem(imgW,  imgH, url,i,area[i].route_id);
		imageUrlRes.push(imgObj);
};
getTime();
if (typeof(localStorage.transformid)=="undefined") {
		localStorage.transformid=0;
};
run(localStorage.transformid);
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
	var trafficContainerH = height || 360;
	//设置背景容器的大小
	trafficContainerJQ.css("width", trafficContainerW).css("height", trafficContainerH);
	//设置背景图片的大小
	$("#trafficBgImg").css("width", trafficContainerW).css("height", trafficContainerH).css("display", "");
	$("#mySwipe").css("top", -trafficContainerH);
	return {
		width : trafficContainerW,
		height : trafficContainerH
	};
};

/**
 * 生成tab页DOM结构（）
 */
function generalTabHtml(index) {
	var id = "lunboli" + index;
	var html = "<li id='" + id + "' ";
	if (typeof(localStorage.transformid)=="undefined") {
		localStorage.transformid=0;
		html += "class='active'";
	};
	if(localStorage.transformid>res.length){
		localStorage.transformid=0;
		html += "class='active'";
	}
	if (index==localStorage.transformid) {
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
function generalLunboHtmlIndex(city, area, index,width,height,timep,id,code) {
	var lunboImgId = "lunboImg" + index;
	var htmls = [];
	htmls.push("<div class='wgay'>");
	htmls.push("<div class='t'>");
	htmls.push("<div style='height:30px; width:100%;'> <span class='area'><strong id='area_" + index + "'>"+area+"</strong></span><span class='city' ><strong id='city_" + index + "'>"+city+"</strong></span></div>");
	htmls.push("<div  class='aa'><div style=' height:30px; line-height:30px; padding-left:50x;'>发布时间：<span class ='timep_" + code + "'>---</span> 	</div>");
	htmls.push("<img  id='share_" + id + "' src='images/icon_share.png' class='img1' onmousedown=\"mDown_share($(this))\" onmouseup=\"mUp_share($(this),'"+city+"','"+area+"')\"/></div></div>");
	htmls.push("<div class='wimg' id='");
	htmls.push(lunboImgId);
	htmls.push("'>");
	htmls.push("<b id ='jiazai_"+id+"'style='margin:0 auto;position:absolute;top:50%;left:30%;' >正在努力加载中...</b>");
	htmls.push("</div>");
	htmls.push("<div class='ly'></div>");
	return {
		imgId : lunboImgId,
		html : htmls.join("")
	};
};


/**
 * 执行网页轮换效果
 */
/**
 * 执行网页轮换效果
 */
function run(index) {
imageUrlRes[index].loadImage();
	var elem = document.getElementById("mySwipe");
	Swipe(elem, {
		startSlide :localStorage.transformid,
		continuous : false,
		disableScroll : false,
		//auto:3000,
		callback : function(index) {
			
			var id = "lunboli" + index;
			
			$("#lunboli" + localStorage.transformid).removeClass("active");
			$("#" + saveid).removeClass("active");
			$("#" + id).addClass("active");
			saveid = id;
			localStorage.transformid = index;
		},
        //transitionEnd用于整体轮播图动画结束后触发的回调函数
        transitionEnd: function(index, element) {
            imageUrlRes[index].loadImage();
        }
	});
}
window.onscroll = function(){ 
 	 window.scrollTo(0,0)
    }
function reflesh(){
	city="";
	 imageUrlRes[localStorage.transformid].isImageLoaded=false;
	imageUrlRes[localStorage.transformid].loadImage();
	 getTime();
	//alert("更新成功！");
}
function getTime(){
	var items = [];
	//请求网络，获取指数数据
	$.ajax({
		url : "http://mobile.trafficeye.com.cn:8000/api2/v3/cityTimepJsonp",
		type : 'get',
		async : false,
		data : {
			city : city.substring(0,city.length-1)
		},
		dataType : 'jsonp',
		jsonp : 'callback',
		timeout:3000,
		error : function(XMLHttpRequest, textStatus, errorThrown) {
		alert("网络不给力,数据请求超时！");
		},

		success : function(result) {
			$.each(result.trafficTimep, function(i, item) {
				items.push(item);
			});
			for (var j = 0; j < items.length; j++) {

					var item = items[j];
					$(".timep_"+item.cityid).text(item.timep)
			}
		}
	});	

}
function mDown_share(index) {
	index.attr("src", "images/icon_share_pressed.png");
}

function mUp_share(index,city,area) {
	index.attr("src", "images/icon_share.png");
	if(area){
	window.external.notify("showShare@"+"#路况交通眼#"+city+" "+area+" 简图");
	}else{
	window.external.notify("showShare@"+"#路况交通眼#"+city+" 简图");
	}
		
}
function mDown_set() {

	$("#setting").attr("src", "images/icon_setting_pressed.png");
}

function mUp_set() {
	$("#setting").attr("src", "images/icon_setting.png");
	window.external.notify("go_to_setting");
}
function mDown_refresh() {

	$("#refresh").attr("src", "images/icon_refresh_pressed.png");
}

function mUp_refresh() {
	$("#refresh").attr("src", "images/icon_refresh.png");
	reflesh();	
}
(function() {
	$(function(){
		density = window.screen.availWidth
				/ document.documentElement.clientWidth;
				window.external.notify("html_load_comleted");
			//initByParam("{\"area\":[{\"city\":\"北京\",\"city_code\":\"000000000\",\"route_id\":\"1\",\"route_name\":\"北京西站\"},{\"city\":\"北京\",\"city_code\":\"101010100\",\"route_id\":\"S100071\",\"route_name\":\"全市路况\",\"timep\":\"03:50\"}],\"width\":400,\"height\":460,\"url\":\"http:\/\/mobile.trafficeye.com.cn:8000\/api2\/v2\/pics\/\",\"density\":\"2.0\"}");
	});
})();