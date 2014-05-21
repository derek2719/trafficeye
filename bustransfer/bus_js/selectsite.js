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

	var loadingElemZ = $("#loadingid");

	/**
	 * 关键字搜索
	 * @param {String} key 关键字
	 * @param {Ojbect} scope 
	 */
	function keyQueryHandler(key, pn, scope) {
		//组织JSONP请求参数
		var params = {
			adcode : 110000,
			key : key,
			searchtype : "poi,road,cross",
			language : 0,
			pageNumber : pn,
			pageCount : 10
		}
		var KEYQUERYURL = gsu.keyQueryUrl();
		
		loadingElemZ.show();

		hu.sendJsonpRequest(KEYQUERYURL, params, function(res, data) {
			this.showResult(res);
		}, scope);
	};

	function createItemHtml(name, address, tel, resultDataIndex, resultDataIndexIndex, flag) {
		var htmls = [];
		htmls.push("<li onclick=setSite(" + resultDataIndex + "," + resultDataIndexIndex + "," + flag + ") >");
		htmls.push("<h2>" + name + "</h2>");
		if (address) {
			htmls.push("<p>地址：" + address + "</p>");
		}
		if (tel) {
			htmls.push("<p>电话：" + tel + "</p>");
		}
		htmls.push("</li>");
		return htmls.join("");
	};

	var osStartKey = os.get("start");
	var osEndKey = os.get("end");

	var selectTitleElemZ = $("#selecttitleid");
	var selectContainerElemZ = $("#selectcontainerid");
	var showStartResultHandler = {
		resultData : [],
		resultHtmls : [],
		totalCount : 0,
		pageCount : 0,
		reqQueryKey : function(key, pn) {
			var me = this;
			selectTitleElemZ.html("选择起点");
			selectContainerElemZ.html("");
			var index = pn - 1;
			if (me.resultData[index] && me.resultHtmls[index]) {
				selectContainerElemZ.html(me.resultHtmls[index]);
			} else {
				keyQueryHandler(key, pn, me);
			}
		},
		showResult : function(data) {
			loadingElemZ.hide();
			var me = this;
			console.log(data);
			var result = data.response.result;
			if (result) {
				var pageCount = me.count(result.totalCount);
				me.pageCount = pageCount;
				var keyRes = result.keyresult;
				if (keyRes && keyRes.length > 0) {
					var index = result.pageNumber - 1;
					me.resultData[index] = keyRes;
					var htmls = [];
					htmls.push("<ul class='h-list-t'>");
					for (var i = 0, len = keyRes.length; i < len; i++) {
						var html = createItemHtml(keyRes[i].name, keyRes[i].address, keyRes[i].tel, index, i, 1);
						htmls.push(html);
					}
					htmls.push("</ul>");
					htmls.push(me.createPerNextBtn(index));
					var resultHtml = htmls.join("");
					me.resultHtmls[index] = resultHtml;
					selectContainerElemZ.html(resultHtml);
				}
			}
		},
		createPerNextBtn : function(index) {
			var htmls = [];
			htmls.push("<div class='footerPage'>");
			if (index > 0) {
				htmls.push("<div class='Page_pre' onclick='preNextBtnHandler(" + (index - 1) + ",1)'>上一页</div>");
			}
			if (index < (this.pageCount - 1)) {
				htmls.push("<div class='Page_next' onclick='preNextBtnHandler(" + (index - 0 + 1) + ",1)'>下一页</div>");
			}
			htmls.push("</div>");
			return htmls.join("");
		},
		count : function(total) {
			if (total > 0) {
				return Math.ceil(total / 10);
			}
		}
	};
	showStartResultHandler.reqQueryKey(osStartKey, 1);

	var showEndResultHandler = {
		resultData : [],
		resultHtmls : [],
		totalCount : 0,
		pageCount : 0,
		reqQueryKey : function(key, pn) {
			var me = this;
			selectTitleElemZ.html("选择终点");
			selectContainerElemZ.html("");
			var index = pn - 1;
			if (me.resultData[index] && me.resultHtmls[index]) {
				selectContainerElemZ.html(me.resultHtmls[index]);
			} else {
				keyQueryHandler(key, pn, me);
			}
		},
		showResult : function(data) {
			loadingElemZ.hide();
			var me = this;
			var result = data.response.result;
			if (result) {
				var pageCount = me.count(result.totalCount);
				me.pageCount = pageCount;
				var keyRes = result.keyresult;
				if (keyRes && keyRes.length > 0) {
					var index = result.pageNumber - 1;
					me.resultData[index] = keyRes;
					var htmls = [];
					htmls.push("<ul class='h-list-t'>");
					for (var i = 0, len = keyRes.length; i < len; i++) {
						var html = createItemHtml(keyRes[i].name, keyRes[i].address, keyRes[i].tel, index, i, 2);
						htmls.push(html);
					}
					htmls.push("</ul>");
					htmls.push(me.createPerNextBtn(index));
					var resultHtml = htmls.join("");
					me.resultHtmls[index] = resultHtml;
					selectContainerElemZ.html(resultHtml);
				}
			}
		},
		createPerNextBtn : function(index) {
			var htmls = [];
			htmls.push("<div class='footerPage'>");
			if (index > 0) {
				htmls.push("<div class='Page_pre' onclick='preNextBtnHandler(" + (index - 1) + ",2)'>上一页</div>");
			}
			if (index < (this.pageCount - 1)) {
				htmls.push("<div class='Page_next' onclick='preNextBtnHandler(" + (index - 0 + 1) + ",2)'>下一页</div>");
			}
			htmls.push("</div>");
			return htmls.join("");
		},
		count : function(total) {
			if (total > 0) {
				return Math.ceil(total / 10);
			}
		}
	};

	var startNameElemZ = $("#startnameid");
	var endNameElemZ = $("#endnameid");
	window.setSite = function (resultDataIndex, resultDataIndexIndex, flag) {
		if (flag == 1) {
			var data = showStartResultHandler.resultData[resultDataIndex][resultDataIndexIndex];
			startNameElemZ.html("起点：" + data.name);
			var lonLat = data.geom.coordinates[0];
			var res = data.name + "," + lonLat;
			os.set("busstart", res);
			showEndResultHandler.reqQueryKey(osEndKey, 1);
		} else if (flag == 2) {
			var data = showEndResultHandler.resultData[resultDataIndex][resultDataIndexIndex];
			endNameElemZ.html("终点：" + data.name);
			var lonLat = data.geom.coordinates[0];
			var res = data.name + "," + lonLat;
			os.set("busend", res);
			pu.toPage("bus_transfer.html");
		}
		return false;
	};

	window.preNextBtnHandler = function (index, flag) {
		if (flag == 1) {
			showStartResultHandler.reqQueryKey(osStartKey, index + 1);
		} else if (flag == 2) {
			showEndResultHandler.reqQueryKey(osEndKey, index + 1);
		}
	};

	window.toHomePage = function() {
		pu.toPage("bus_index.html");
	};
}());