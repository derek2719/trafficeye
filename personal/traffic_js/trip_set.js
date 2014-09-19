// JavaScript Document
;(function($){
	$(function(){
		initData();
		$('#back').bind('touchstart',touchStart_back);
		$('#back').bind('touchend',touchEnd_back);//返回
		$('#refresh').bind('touchstart',touchStart_ref);
		$('#refresh').bind('touchend',touchEnd_ref);//刷新
	});
	function touchStart_back(){
		this.src='trip_img/icon_back_pressed.png';
	};
	function touchEnd_back(){
		this.src='trip_img/icon_back.png';
		history.go(-1);
	};
	function touchStart_ref(){
		this.src='trip_img/icon_refresh_pressed.png';
	};
	function touchEnd_ref(){
		this.src='trip_img/icon_refresh.png';
		window.location.reload();
	};
})(Zepto);
function initData(){
	if(localStorage.homePoint){
		var homeName=JSON.parse(localStorage.homePoint).locationName;
		document.getElementById('set_home').innerHTML=homeName;	
	}	
	if(localStorage.companyPoint){
		var companyName=JSON.parse(localStorage.companyPoint).locationName;
		document.getElementById('set_company').innerHTML=companyName;	
	}	
};//初始化数据
function fnLocation(type){
	if (navigator.userAgent.match(/android/i)) {
		window.JSAndroidBridge.chooseLocation(type);
		//alert('android设备');
		//if(type=='home'){callbackChooseLocation(type,"116.433158","39.909705","安华桥伦洋大厦")};
		//if(type=='company'){callbackChooseLocation(type,"116.328524","39.902399","天安门东站C东南口")};
		
		
	} else if (navigator.userAgent.match(/iphone/i) || navigator.userAgent.match(/ipad/i)) {
		window.location.href=("objc:??chooseLocation::?"+type);
		//if(type=='home'){callbackChooseLocation(type,"116.433158","39.909705","安华桥伦洋大厦")};
		//if(type=='company'){callbackChooseLocation(type,"116.328524","39.902399","天安门东站C东南口")};
		//alert('苹果设备');
	} else {
		alert("调用修改用户信息接口,PC不支持.");
		//callbackChooseLocation("home","116.40168","39.9077","天安门东站C东南口");
	}
};//调用地图选点接口
function callbackChooseLocation(type,lon,lat,address){
	var myHome=document.getElementById('set_home'),
		company=document.getElementById('set_company');
	if(type == "home")
	{
		var homePoint = {
		 point : lon+","+lat,
		 locationName : address
		};
		var sHomePoint=JSON.stringify(homePoint);
		localStorage.setItem('homePoint',sHomePoint);//保存家信息至本地
		myHome.innerHTML=homePoint.locationName;
	}
	if(type == "company"){
		var companyPoint = {
		 point : lon+","+lat,
		 locationName : address
		};
		var sCompanyPoint=JSON.stringify(companyPoint);
		localStorage.setItem('companyPoint',sCompanyPoint);//保存单位信息至本地
		company.innerHTML=companyPoint.locationName;
	}
};//本地回调函数pcar_publishinfo.html
