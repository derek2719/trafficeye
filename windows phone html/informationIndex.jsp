﻿<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<title>交通资讯</title>
<link rel="stylesheet" href="css/info.css" type="text/css">
</head>
<body>
<div style="background-image:url(images/bar.png);	height:45px	;width:100%;" id="topNav">
			<img src="images/icon_setting.png" width="45px" height="45px"  style="float:left;" id="setting" onmousedown="touchstart_set();" onmouseup="touchend_set();"/>
			<img src="images/icon_refresh.png" width="45px" height="45px" style="float:	right;" id="refresh" 
			onmousedown="touchstart_ref();" onmouseup="touchend_ref();"onClick="pullrefleshAction();"/>
			<div  style="font-size:24px ;color: #FFFFFF;text-align:center;height:45px;line-height:45px;padding-left: 45px" id="test">
				交通资讯
			</div>
</div>	
<div id="wrapper">
	<div id="scroller">
		<div id="pullDown" align="center" >
			<div class="pullBox">
				<span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>
			</div>
		</div>

		<div id="thelist" >
			
		</div>
		
		<div id="pullUp" align="center">
			<div class="pullBox">
				<span class="pullUpIcon"></span><span class="pullUpLabel">向上拖动加载更多...</span>
			</div>
		</div>
	</div>
</div>
<div id="thelistmore"  style="display:none;">
	</div>
</body>
</html>
<script type="text/javascript" src="js/jquery1.9.1.js"></script>
<script type="text/javascript" src="js/iscroll.js"></script>
<script type="text/javascript" src="js/information.js"></script>
</script>