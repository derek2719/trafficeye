// JavaScript Document
(function($){
var testUrl='http://mobiletest.trafficeye.com.cn:18080';
var baseUrl='http://mobile.trafficeye.com.cn:8000';
var currentPoint;
$(function(){
	getNowTime();
	setInterval(getNowTime,1000);
	$('#go_place .items').tap(function(){
		var iW=$(window).width()-$(this).width()-23;
		$(this).next('.go_show').width(iW+5);
		if(!$(this).hasClass('focus')){
			$(this).addClass('focus');
			$(this).next('.go_show').animate({'right':-iW-5},200,'ease',function(){
				$(this).animate({'right':-iW},'fast');
			});	
		}else{
			var _this=$(this);
			$(this).next('.go_show').animate({'right':0},200,'ease',function(){
				_this.removeClass('focus');
			});	
		};
	});//回家,回单位效果
	document.getElementById('home_area').onclick=document.getElementById('company_area').onclick=function(){
		window.location.href='trip_set.html';
	};
	$('#back').bind('touchstart',touchStart_back);
	$('#back').bind('touchend',touchEnd_back);//返回
	$('#refresh').bind('touchstart',touchStart_ref);
	$('#refresh').bind('touchend',touchEnd_ref);//刷新		
	currentPoint && init();
	//callbackInitCustomPage('116.928524','39.302399');//测试
});	
function init(){
	currentPoint=localStorage.getItem('currentPoint');
	getData(currentPoint);
};//初始化页面数据
window.callbackInitCustomPage=function(current_lon,current_lat){
	localStorage.setItem('currentPoint',current_lon+','+current_lat);
	init();	
};
function getData(sPoint){
	var homeData=JSON.parse(localStorage.getItem('homePoint'));	
	var companyData=JSON.parse(localStorage.getItem('companyPoint'));
	var bSign=false;//绑定事件标示符	
	homeData && (ajaxData($('#home_area'),homeData.point));
	companyData && (ajaxData($('#company_area'),companyData.point));
	function ajaxData(obj,ePoint){
		$.ajax({
			type:'get',
			url:testUrl+'/api/v4/routequery',
			dataType:"jsonp",
			data:{
				spoint:sPoint,
				epoint:ePoint
			},
			contentType:"application/json",
			error: function(XMLHttpRequest,message){
				alert('遇到错误'+message);
			},
			success:function(data){
				//console.log(JSON.stringify(data));
				if(data.state.code==0){
					var htmls='';
					htmls+='<p class="dataList">';
					htmls+='<span>'+data.distsum+'公里</span>';
					htmls+=' | ';
					htmls+='<span>'+data.duration+'分钟</span>';
					htmls+=' | ';
					htmls+='<span>'+data.arrival+'到达</span>';
					htmls+='</p>';
					htmls+='<img src="'+data.imgUrl+'" style="width:85%;">';
					obj.html(htmls);
					if($('#home_area').children('img').length!=0 && !bSign){
						$('#home_area')[0].onclick=function(){
							//alert(ePoint);
							goMapPage(currentPoint,ePoint);
						};//点击跳转地图
						bSign=true;
					}else if($('#company_area').children('img').length!=0){
						$('#company_area')[0].onclick=function(){
							goMapPage(currentPoint,ePoint);
						};//点击跳转地图
					};
					
				}else if(data.state.code==-9){
					alert(data.state.desc);
				}else{
					alert('遇到未知错误');
				};
			}	
		});
	};
	//请求回家/单位路况
};//获取数据
function goMapPage(sPoint,ePoint){
	if (navigator.userAgent.match(/android/i)) {
		window.JSAndroidBridge.customRouteGotoMap(sPoint.split(',')[0],sPoint.split(',')[1],ePoint.split(',')[0],ePoint.split(',')[1]);
	} else if (navigator.userAgent.match(/iphone/i) || navigator.userAgent.match(/ipad/i)) {
		window.location.href=("objc:??customRouteGotoMap::?"+sPoint.split(',')[0]+":?"+sPoint.split(',')[1]+":?"+ePoint.split(',')[0]+":?"+ePoint.split(',')[1]);
	} else {
		alert("调用修改用户信息接口,PC不支持.");
	}
}//跳转地图
function getNowTime(){
	var time=new Date();
	$('#nowTime').text(time.getHours()+':'+time.getMinutes());
};
function touchStart_back(){
	this.src='trip_img/icon_back_pressed.png';
};
function touchEnd_back(){
	this.src='trip_img/icon_back.png';
	if (navigator.userAgent.match(/android/i)) {
		window.JSAndroidBridge.gotoPrePage();
	} else if (navigator.userAgent.match(/iphone/i) || navigator.userAgent.match(/ipad/i)) {
		window.location.href=("objc:??gotoPrePage");
	} else {
		alert("调用修改用户信息接口,PC不支持.");
	}
};
function touchStart_ref(){
	this.src='trip_img/icon_refresh_pressed.png';
};
function touchEnd_ref(){
	this.src='trip_img/icon_refresh.png';
	window.location.reload();
};
})(Zepto);
