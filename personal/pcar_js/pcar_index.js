 (function(window) {
    function UserInfoManager() {
        this.userinfo = null;
        this.ua = null;
        this.pid = null;
    };
    UserInfoManager.prototype = {
        setInfo : function(data) {
            this.userinfo = data;
        },
        setPid : function(pid) {
            this.pid = pid;
        },
        setUa : function(ua) {
            this.ua = ua;
        }
    };

    function PageManager() {
        //ID元素对象集合
        this.elems = {
            "backpagebtn" : null
        };
        //当点击请求提示框的关闭按钮，意味着中断请求，在关闭提示框后，如果请求得到响应，也不进行下一步业务处理。
        this.isStopReq = false;
        //页面对象是否初始化完成
        this.inited = false;
    };
    PageManager.prototype = {
        /**
         * 初始化页面对象
         */
        init : function() {
            var me = this;
            me.userInfoManager = new UserInfoManager();
            me.initElems();
            me.initEvents();
            me.inited = true;
        },
        /**
         * 初始化页面元素对象
         */
        initElems : function() {
            var me = this,
                elems = me.elems;
                me.elems = Trafficeye.queryElemsByIds(elems);
        },
        
        /**
         * 初始化页面元素事件
         */
        initEvents : function() {
            var me = this,
                backpagebtnElem = me.elems["backpagebtn"];
            //返回按钮
            backpagebtnElem.onbind("touchstart",me.btnDown,backpagebtnElem);
            backpagebtnElem.onbind("touchend",me.backpagebtnUp,me);
        },
        /**
         * 按钮按下事件处理器
         * @param  {Event} evt
         */
        btnDown : function(evt) {
            this.addClass("curr");
        },
        backpagebtnUp : function(evt) {
            var me = this,
                elem = evt.currentTarget;
            $(elem).removeClass("curr");
            var fromSource = Trafficeye.fromSource();
            Trafficeye.toPage(fromSource.sourcepage);
        },
        //跳转到我要搭车，请求要是送人的请求,type为2
        carpool : function(evt) {
            var me = this;
            //把来源信息存储到本地
             var fromSource = {"flag" : "ride","type" : "2"};
             var fromSourceStr = Trafficeye.json2Str(fromSource);
             Trafficeye.offlineStore.set("traffic_pcar_flag", fromSourceStr);
            var elem = $(evt).addClass("curr");
            setTimeout((function(){
                $(elem).removeClass("curr");  
                Trafficeye.toPage("pcar_ride.html");
            }),Trafficeye.MaskTimeOut);     
        },
        //我能送人，跳转到送人的节目，请求是搭车的请求，type为1
        passenger : function(evt) {
            var me = this;
            var fromSource = {"flag" : "away","type" : "1"};
             var fromSourceStr = Trafficeye.json2Str(fromSource);
             Trafficeye.offlineStore.set("traffic_pcar_flag", fromSourceStr);
            var elem = $(evt).addClass("curr");
            setTimeout((function(){
                $(elem).removeClass("curr");  
                Trafficeye.toPage("pcar_ride.html");
            }),Trafficeye.MaskTimeOut);     
        },
        //我的发布
        publish : function(evt) {
            var me = this;
            var elem = $(evt).addClass("curr");
            setTimeout((function(){
                $(elem).removeClass("curr");  
                Trafficeye.toPage(".html");
            }),Trafficeye.MaskTimeOut);     
        }
    };
    
    $(function(){

         // 初始化页面函数
        window.callbackInitPage = function(isLogin,usersInfoClient,ua,pid,dataClient){
            Trafficeye.httpTip.closed();
        
            // alert(isEdit);
            if(isLogin == 0){
                var dataClient1 = Trafficeye.str2Json(dataClient);
                //pid,ua,userinfo存入到浏览器本地缓存
                var userinfodata = {
                    "pid" : pid,
                    "ua" : ua,
                    "uid" : "",
                    "userinfo" : "",
                    "dataclient" : dataClient1
                };
                var dataStr = Trafficeye.json2Str(userinfodata);
                Trafficeye.offlineStore.set("traffic_myinfo", dataStr);
               // Trafficeye.trafficeyeAlert("未登录,请您重新登录");
            }else if(isLogin == 1)//蒙版效果暂不取消，跳转到pre_info.html页面再取消
            {
                
                var dataClient1 = Trafficeye.str2Json(dataClient);
                //pid,ua,userinfo存入到浏览器本地缓存
                var userinfodata = {
                    "pid" : pid,
                    "ua" : ua,
                    "uid" : data.uid,
                    "userinfo" : Trafficeye.str2Json(usersInfoClient),
                    "dataclient" : dataClient1
                };
                var dataStr = Trafficeye.json2Str(userinfodata);
                Trafficeye.offlineStore.set("traffic_myinfo", dataStr);
            }else if(isLogin == 2){
                var userinfodata = {
                    "pid" : pid,
                    "ua" : ua,
                    "uid" : "",
                    "userinfo" : "",
                    "dataclient" : ""
                };
                var dataStr = Trafficeye.json2Str(userinfodata);
                Trafficeye.offlineStore.set("traffic_myinfo", dataStr);
                Trafficeye.httpTip.opened();
                Trafficeye.trafficeyeAlert("正在登录中,请稍后");
            }
        };
        
        // 自动登录成功通知js
        window.callbackAutoLoginDone = function(data){
            Trafficeye.httpTip.closed();
            var myInfo = Trafficeye.getMyInfo();
            //把用户信息写入到本地
            //pid,ua,userinfo存入到浏览器本地缓存
            var userinfodata = {
                "pid" : myInfo.pid,
                "ua" : myInfo.ua,
                "uid" : myInfo.uid,
                "friend_uid" : myInfo.uid,
                "isEdit" : myInfo.isEdit,
                "userinfo" : Trafficeye.str2Json(data)
            };
            var dataStr = Trafficeye.json2Str(userinfodata);
            Trafficeye.offlineStore.set("traffic_myinfo", dataStr);
            // Trafficeye.toPage("pre_info.html");
        };
        
        // 获取SNS平台用户信息，回调函数
        window.callbackGetSNSUserInfo  = function(data){
            // console.log(data);
            Trafficeye.httpTip.closed();
            var ThirdPlatformUserData = Trafficeye.str2Json(data)
            //把第三方账号返回的用户信息写入到本地
            // Trafficeye.offlineStore.set("traffic_ThirdPlatformUserData", Trafficeye.json2Str(data));
            Trafficeye.offlineStore.set("traffic_ThirdPlatformUserData", data);
            // var data1 = Trafficeye.str2Json(Trafficeye.offlineStore.get("traffic_ThirdPlatformUserData"));
            // console.log(data1.sex);
            if(ThirdPlatformUserData.unitId && ThirdPlatformUserData.userType && ThirdPlatformUserData.username){
                // Trafficeye.toPage("pre_thrid_info.html");
            }else{
                Trafficeye.trafficeyeAlert("第三方登录失败,请重试");
            }
        };
        
        window.initPageManager = function() {
            //把来源信息存储到本地
             var fromSource = {"sourcepage" : "pcar_index.html","currpage" : "pcar_index.html","prepage" : "pcar_index.html"}
             var fromSourceStr = Trafficeye.json2Str(fromSource);
             Trafficeye.offlineStore.set("traffic_fromsource", fromSourceStr);

            var pm = new PageManager();

            Trafficeye.pageManager = pm;
            //初始化用户界面
            pm.init();
            //启动等待动画，等待客户端回调函数            
            Trafficeye.httpTip.opened();
        };
        
        window.publish = function(evt) {
             var pm = Trafficeye.pageManager;
            if (pm.init) {
                pm.publish(evt);
            }
        };
        
        window.passenger = function(evt) {
             var pm = Trafficeye.pageManager;
            if (pm.init) {
                pm.passenger(evt);
            }
        };
        
        window.carpool = function(evt) {
             var pm = Trafficeye.pageManager;
            if (pm.init) {
                pm.carpool(evt);
            }
        };
        window.initPageManager();
    }); 
    
 }(window));