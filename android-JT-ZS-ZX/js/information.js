var myScroll,
pullDownEl, pullDownOffset,
pullUpEl, pullUpOffset,
generatedCount = 0;
var moreel;
var morelen = 0;
var end = false;
var isSuccess = true;
(function () {
	$(function () {
		//init("beijing|1");
		init(window.inforSetting.setInit());
		document.getElementById("back").addEventListener('touchstart', touchstart_back);
		document.getElementById("back").addEventListener('touchend', touchend_back);
		document.getElementById("refresh").addEventListener('touchstart', touchstart_ref);
		document.getElementById("refresh").addEventListener('touchend', touchend_ref);
		document.getElementById("setting").addEventListener('touchstart', touchstart_set);
		document.getElementById("setting").addEventListener('touchend', touchend_set);

	});
})();

function pullDownAction() {
	setTimeout(function () { // <-- Simulate network congestion, remove setTimeout from production!
		var el,
		div,
		i,
		br,
		hr;
		el = document.getElementById('thelist');
		el.innerHTML = "";
		for (i = 0; i < morelen; i++) {
			div = document.createElement('div');
			br = document.createElement('br');
			hr = document.createElement('hr');
			div.className = "info";
			if (moreel.children[i] != undefined && moreel.children[i].innerHTML != "") {
				div.innerHTML = moreel.children[i].innerHTML;
				el.appendChild(div, el.childNodes[0]);
				el.appendChild(br, el.childNodes[0]);
				el.appendChild(hr, el.childNodes[0]);
			}
		}

		myScroll.refresh(); // Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}
function pullrefleshAction() {
	pageNo = 1;
	getinfo(3);
	setTimeout(function () { // <-- Simulate network congestion, remove setTimeout from production!
		var el,
		div,
		i,
		br,
		hr;
		el = document.getElementById('thelist');
		el.innerHTML = "";
		for (i = 0; i < morelen; i++) {
			div = document.createElement('div');
			br = document.createElement('br');
			hr = document.createElement('hr');
			div.className = "info";
			if (moreel.children[i] != undefined && moreel.children[i].innerHTML != "") {
				div.innerHTML = moreel.children[i].innerHTML;
				el.appendChild(div, el.childNodes[0]);
				el.appendChild(br, el.childNodes[0]);
				el.appendChild(hr, el.childNodes[0]);
			}
		}
		myScroll.refresh(); // Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}

function pullUpAction() {
	setTimeout(function () { // <-- Simulate network congestion, remove setTimeout from production!

		el = document.getElementById('thelist');
		for (i = 0; i < morelen; i++) {
			div = document.createElement('div');
			br = document.createElement('br');
			hr = document.createElement('hr');
			div.className = "info";
			if (moreel.children[i] != undefined && moreel.children[i].innerHTML != "") {
				div.innerHTML = moreel.children[i].innerHTML;
				el.appendChild(div, el.childNodes[i]);
				el.appendChild(br, el.childNodes[i]);
				el.appendChild(hr, el.childNodes[i]);
			}

		}
		myScroll.refresh(); // Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}

function loaded() {
	setTimeout(function () {
		getinfo(1);
	}, 200);
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');
	pullUpOffset = pullUpEl.offsetHeight;
	myScroll = new iScroll('wrapper', {
			useTransition : true,
			topOffset : pullDownOffset,
			onRefresh : function () {
				if (pullDownEl.className.match('loading')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				} else if (pullUpEl.className.match('loading')) {
					pullUpEl.className = '';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '向上拖动获取更多...';
				}
			},
			onScrollMove : function () {
				if (this.y > 5 && !pullDownEl.className.match('flip')) {
					pullDownEl.className = 'flip';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
					this.minScrollY = 0;
				} else if (this.y < 5 && pullDownEl.className.match('flip')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
					this.minScrollY = -pullDownOffset;
				} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
					pullUpEl.className = 'flip';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '向上拖动加载更多...';
					this.maxScrollY = this.maxScrollY;
				} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
					pullUpEl.className = '';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '向上拖动加载更多...';
					this.maxScrollY = pullUpOffset;
				}
			},
			onScrollEnd : function () {
				if (pullDownEl.className.match('flip')) {
					pageNo = 1;
					getinfo(3);
					pullDownEl.className = 'loading';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
					pullDownAction(); // Execute custom function (ajax call?)
				} else if (pullUpEl.className.match('flip')) {
					pageNo = pageNo + 1;
					$("#thelistmore").empty();
					getinfo(2);
					pullUpEl.className = 'loading';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
					pullUpAction(); // Execute custom function (ajax call?)

				}
			}
		});
	setTimeout(function () {
		document.getElementById('wrapper').style.left = '0';
	}, 800);
}

document.addEventListener('touchmove', function (e) {
	e.preventDefault();
}, true);

document.addEventListener('DOMContentLoaded', function () {
	setTimeout(loaded, 200);
}, false);

function getinfo(parm) {
	//请求网络，获取指数数据
	$.ajax({
		url : "http://mobile.trafficeye.com.cn:8000/sns/v3/MessageInfoJsonp",
		type : 'get',
		data : {
			city : city,
			pageNo : pageNo
		},
		//timeout:3000,
		dataType : 'jsonp',
		jsonp : 'callback',
		error : function (XMLHttpRequest, textStatus, errorThrown) {
			isSuccess = false;
			alert("网络不给力，数据请求失败！");

		},
		success : function (result) {
			isSuccess = true;
			var info = result.html;
			if (parm == 1) {
				$("#thelistmore").empty();
				$("#thelistmore").append(info);
				$("#thelist").empty();
				$("#thelist").append(info);
			} else if (parm == 3) {
				$("#thelistmore").empty();
				$("#thelistmore").append(info);
				if (info != "") {
					alert("更新成功！");
				}
			} else if (parm == 2) {
				if (info == "") {
					alert("已经到最后一页了！");
					end = true;
				} else {
					$("#thelistmore").empty();
					$("#thelistmore").append(info);
				}

			}
			moreel = document.getElementById('thelistmore');
			morelen = moreel.children.length;
		}
	});
}
var pageNo = 1;
var city = "beijing";
//初始化页面
function init(parms) {
	if (parms) {
		city = parms.split("|")[0];
		pageNo = 1;
		var mao = parms.split("|")[1]
			if (mao != "") {
				window.location.hash = mao;
			}
	}

}
function touchstart_back(e) {
	$("#back").attr("src", "images/icon_back.png");
}

function touchend_back(e) {
	$("#back").attr("src", "images/icon_back_pressed.png");
	window.inforSetting.gotoPrePage();
}
function touchstart_set(e) {
	$("#setting").attr("src", "images/icon_setting_pressed.png");
}

function touchend_set(e) {
	$("#setting").attr("src", "images/icon_setting.png");
	window.inforSetting.setting();
}
function touchstart_ref(e) {
	$("#refresh").attr("src", "images/icon_refresh_pressed.png");
}

function touchend_ref(e) {
	$("#refresh").attr("src", "images/icon_refresh.png");
}
