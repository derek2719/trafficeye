(function() {
	var global = window[_MYNAMESPACE_];
	//eventUtil的简称
	var eu = global.eventUtil;
	//httpUtil的简称
	var hu = global.httpUtil;
	//offlineStore的简称
	var os = global.offlineStore;
	var pu = global.pageUtil;
	var gsu = global.getServerUrl;
	var pf = global.platform;

	/**
	 * 输入关键字自动补全处理
	 * @param {String} key 关键字
	 * @param {Ojbect} scope 
	 */
	function keyAutoCompleteHandler(key, scope) {
		//组织JSONP请求参数
		var params = {
			inputstr : key,
			searchType : "all"
		}
		var KEYAUTOCOMPLETEURL = gsu.tipUrl();
		hu.sendJsonpRequest(KEYAUTOCOMPLETEURL, params, function(res, data) {
			this.showTipPanel(res);
		}, scope);
	};

	function createLiHtml(data) {
		var htmls = [];
		for (var i = 0, len = data.length; i < len; i++) {
			var name = data[i].name;
			htmls.push("<li>" + name + "</li>");
		}
		return htmls.join("");
	};

	
	//起点输入框自动补全提示
	var startSiteInputId = "startsiteid";
	var startSiteInputElemZ = $("#" + startSiteInputId);
	var startTipPanelElemZ = $("#starttippanelid");
	var startTipUlElemZ = $("#starttipulid");
	//注册清空起点输入框内容事件
	var startSiteCleanBtnElemZ = $("#startsitecleanbtnid");
	eu.addEventListener(startSiteCleanBtnElemZ, "click", function() {
		//清空输入框的内容
		startSiteInputElemZ.val("");
		//清空输入框关键字保留信息
		startSiteAutoCompleteHandler.preKey = null;
		//清空起点保留信息
		startSiteAutoCompleteHandler.hideTipPanel();
	});
	//起点输入框获得焦点
	eu.addEventListener(startSiteInputElemZ, "focus", function(evt, data) {
		startSiteAutoCompleteHandler.start();
		return true;
	});
	//起点输入框失去焦点
	eu.addEventListener(startSiteInputElemZ, "blur", function(evt, data) {
		startSiteAutoCompleteHandler.stop();
		return true;
	});
	eu.addEventListener(startTipPanelElemZ, "click", function(evt) {
		var content = evt.srcElement.innerText;
		if (content) {
			startSiteInputElemZ.val(content);
			startSiteAutoCompleteHandler.hideTipPanel();
			return false;
		}
	});
	var startSiteAutoCompleteHandler = {
		preKey : null,
		timer : null,
		inited : false,
		start : function() {
			var me = this;
			if (me.inited) {
				return;
			}
			me.inited = true;
			me.timer = setInterval(function() {
				var activeId = document.activeElement.id;
				if (activeId == startSiteInputId) {
					me.fireAutoTip();

					var val = startSiteInputElemZ.val();
					if (val) {
						startSiteCleanBtnElemZ.show();
					} else {
						startSiteCleanBtnElemZ.hide();
					}	
				}
			}, 30000);
		},
		fireAutoTip : function() {
			var me = this;
			//判断输入框内容
			var siteKey = startSiteInputElemZ.val();
			if (siteKey != me.preKey) {
				me.preKey = siteKey;
				if (siteKey) {
					keyAutoCompleteHandler(siteKey, me);
				}
			}
		},
		showTipPanel : function(data) {
			if (data.response && data.response.result && data.response.result.infoList) {
				var html = createLiHtml(data.response.result.infoList);
				startTipUlElemZ.html(html);
				startTipPanelElemZ.show();
			}
		},
		hideTipPanel : function() {
			startTipPanelElemZ.hide();
		},
		stop : function() {
			var me = this;
			if (me.timer) {
				clearInterval(me.timer);
				me.timer = null;
				me.inited = false;
			}
		}
	};

	//终点输入框自动补全提示
	var endSiteInputId = "endsiteid";
	var endSiteInputElemZ = $("#" + endSiteInputId);
	var endTipPanelElemZ = $("#endtippanelid");
	var endTipUlElemZ = $("#endtipulid");
	//注册清空起点输入框内容事件
	var endSiteCleanBtnElemZ = $("#endsitecleanbtnid");
	eu.addEventListener(endSiteCleanBtnElemZ, "click", function() {
		//清空输入框的内容
		endSiteInputElemZ.val("");
		//清空输入框关键字保留信息
		endSiteAutoCompleteHandler.preKey = null;
		//清空终点保留信息
		endSiteAutoCompleteHandler.hideTipPanel();
	});
	//终点输入框获得焦点
	eu.addEventListener(endSiteInputElemZ, "focus", function(evt, data) {
		endSiteAutoCompleteHandler.start();
		return true;
	});
	//终点输入框失去焦点
	eu.addEventListener(endSiteInputElemZ, "blur", function(evt, data) {
		endSiteAutoCompleteHandler.stop();
		return true;
	});
	eu.addEventListener(endTipPanelElemZ, "click", function(evt) {
		var content = evt.srcElement.innerText;
		if (content) {
			endSiteInputElemZ.val(content);
			endSiteAutoCompleteHandler.hideTipPanel();
			return false;
		}
	});
	var endSiteAutoCompleteHandler = {
		preKey : null,
		timer : null,
		start : function() {
			var me = this;
			me.timer = setInterval(function() {
				var activeId = document.activeElement.id;
				if (activeId == endSiteInputId) {
					me.fireAutoTip();

					var val = endSiteInputElemZ.val();
					if (val) {
						endSiteCleanBtnElemZ.show();
					} else {
						endSiteCleanBtnElemZ.hide();
					}	
				}
			}, 30000);
		},
		fireAutoTip : function() {
			var me = this;
			//判断输入框内容
			var siteKey = endSiteInputElemZ.val();
			if (siteKey != me.preKey) {
				me.preKey = siteKey;
				if (siteKey) {
					keyAutoCompleteHandler(siteKey, me);
				}
			}
		},
		showTipPanel : function(data) {
			if (data.response && data.response.result && data.response.result.infoList) {
				var html = createLiHtml(data.response.result.infoList);
				endTipUlElemZ.html(html);
				endTipPanelElemZ.show();
			}
		},
		hideTipPanel : function() {
			endTipPanelElemZ.hide();
		},
		stop : function() {
			var me = this;
			if (me.timer) {
				clearInterval(me.timer);
				me.timer = null;
			}
		}
	};

	eu.addEventListener($(document), "click", function() {
		startSiteAutoCompleteHandler.hideTipPanel();
		endSiteAutoCompleteHandler.hideTipPanel();
		return false;
	});

	//注册互换起始点按钮事件
	var changebtnElemZ = $("#changebtnid");
	eu.addEventListener(changebtnElemZ, "mousedown", function() {
		changebtnElemZ.addClass("curr");
	});
	eu.addEventListener(changebtnElemZ, "mouseup", function() {
		changebtnElemZ.removeClass("curr");
	});
	eu.addEventListener(changebtnElemZ, "click", function() {
		var startKey = startSiteInputElemZ.val();
		var endKey = endSiteInputElemZ.val();
		startSiteInputElemZ.val(endKey);
		endSiteInputElemZ.val(startKey);
	});

	//注册点击查询按钮事件
	var bustransferbtnElemZ = $("#bustransferbtnid");
	eu.addEventListener(bustransferbtnElemZ, "click", function(evt, data) {
		//校验起点终点内容
		var startKey = startSiteInputElemZ.val();
		var endKey = endSiteInputElemZ.val();
		if (startKey && endKey) {
			os.set("start", startKey);
			os.set("end", endKey);
			os.set("busstart", "");
			os.set("busend", "");
			pu.toPage("bus_selectsite.html");
		}
	});

	window.toPrePage = function() {
		if (pf.isAndroid) {
			window.JSAndroidBridge.closePage();
		}
		if (pf.isIpad || pf.isIphone) {
			closePage();
		}
	};
}());