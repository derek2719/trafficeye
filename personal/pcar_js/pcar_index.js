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
            "backpagebtn" : null,
            "ruleride" : null
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
                if(document.getElementById("ruleride").checked){
                    Trafficeye.toPage("pcar_ride.html");
                }else{
                    Trafficeye.trafficeyeAlert("请同意《路况交通眼》拼车服务条款");
                }
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
                // Trafficeye.toPage("pcar_ride.html");
                if(document.getElementById("ruleride").checked){
                    Trafficeye.toPage("pcar_ride.html");
                }else{
                    Trafficeye.trafficeyeAlert("请同意《路况交通眼》拼车服务条款");
                }
            }),Trafficeye.MaskTimeOut);     
        },
        //我的发布
        publish : function(evt) {
            var me = this;
            var elem = $(evt).addClass("curr");
            setTimeout((function(){
                $(elem).removeClass("curr");  
                if(document.getElementById("ruleride").checked){
                    Trafficeye.toPage("pcar_mypublish.html");
                }else{
                    Trafficeye.trafficeyeAlert("请同意《路况交通眼》拼车服务条款");
                }
            }),Trafficeye.MaskTimeOut);     
        },
         //发布拼车信息
         publishInfo: function(evt) {
             var me = this;
             var elem = $(evt).addClass("curr");
             setTimeout((function() {
                 $(elem).removeClass("curr");
                 //清楚缓存信息
                 Trafficeye.offlineStore.remove("publishInfo_week");
                 Trafficeye.offlineStore.remove("publishInfo_time");
                 Trafficeye.offlineStore.remove("publishInfo_startloc");
                 Trafficeye.offlineStore.remove("publishInfo_endloc");
                 Trafficeye.offlineStore.remove("publishInfo_type");
                 Trafficeye.toPage("pcar_publishinfo.html");
             }), Trafficeye.MaskTimeOut);
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
                var data = Trafficeye.str2Json(usersInfoClient);
                var dataClient1 = Trafficeye.str2Json(dataClient);
                //pid,ua,userinfo存入到浏览器本地缓存
                var userinfodata = {
                    "pid" : pid,
                    "ua" : ua,
                    "uid" : data.uid,
                    "userinfo" : data,
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
        
        window.term = function(evt) {
            if (Trafficeye.mobilePlatform.android) {
                window.JSAndroidBridge.gotoServicePage();
            } else if (Trafficeye.mobilePlatform.iphone || Trafficeye.mobilePlatform.ipad) {
                window.location.href=("objc:??gotoServicePage");
            } else {
                alert("调用修改用户信息接口,PC不支持.");
            }
        };
        
        //发布
         window.publishInfo = function(evt) {
             var pm = Trafficeye.pageManager;
             if (pm.init) {
                 pm.publishInfo(evt);
             }
         };
        
        window.initPageManager();
        window.callbackInitPage(1,"{\"badgeNum\":1,\"avatarUrl\":\"\",\"wxNum\":\"123456\",\"level\":1,\"eventNum\":0,\"mobile\":\"\",\"frineds\":0,\"idNum\":\"\",\"totalMilage\":-0,\"nextLevel\":2,\"city\":\"贵州 贵阳市\",\"realName\":\"dong1\",\"ownedBadges\":[{\"name\":\"新人徽章\",\"id\":1,\"obtainTime\":\"2014-05-29 09:59:17\",\"smallImgName\":\"badge_register.png\",\"imgName\":\"badge_big_register.png\",\"desc\":\"注册账号\"}],\"email\":\"wgy53@wgy.wgy\",\"totalBadges\":30,\"totalTrackMilage\":-0,\"fans\":0,\"carNum\":\"1234567\",\"totalCoins\":0,\"username\":\"Wgy53\",\"userType\":\"trafficeye\",\"levelPoint\":30,\"levelPercent\":2,\"uid\":\"40326\",\"birthdate\":\"2014-01-11\",\"gender\":\"M\",\"totalPoints\":31,\"nextLevelPoint\":65,\"mobileValidate\":0,\"qq\":\"567789\",\"description\":\"\",\"userGroup\":0}","I_7.1,i_2.2.6","B3D26DA1-BE69-4DAA-8924-A62CA8705787","{\"lon\":\"0.000000\",\"lat\":\"0.000000\"}");
        }); 
    
 }(window));