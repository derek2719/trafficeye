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
        window.initPageManager();
        window.callbackInitPage(1,"{\"badgeNum\":17,\"avatarUrl\":\"http://mobile.trafficeye.com.cn/media/avatars/10924/image.jpg\",\"wxNum\":\"\",\"level\":17,\"eventNum\":40,\"mobile\":\"15246776856\",\"frineds\":1,\"idNum\":\"\",\"totalMilage\":5573.6,\"nextLevel\":18,\"city\":\"\",\"realName\":\"11211\",\"ownedBadges\":[{\"name\":\"上报 20 件交通事件\",\"id\":21,\"obtainTime\":\"2013-05-17 18:27:50\",\"smallImgName\":\"badge_event_20.png\",\"imgName\":\"badge_big_event_20.png\",\"desc\":\"上报 20 件交通事件\"},{\"name\":\"忠实用户\",\"id\":3,\"obtainTime\":\"2013-04-28 08:01:00\",\"smallImgName\":\"badge_login_7days.png\",\"imgName\":\"badge_big_login_7days.png\",\"desc\":\"连续七日登录\"},{\"name\":\"上报 10 件交通事件\",\"id\":22,\"obtainTime\":\"2013-04-07 15:43:24\",\"smallImgName\":\"badge_event_10.png\",\"imgName\":\"badge_big_event_10.png\",\"desc\":\"上报 10 件交通事件\"},{\"name\":\"上报 5 件交通事件\",\"id\":23,\"obtainTime\":\"2013-03-01 11:14:47\",\"smallImgName\":\"badge_event_5.png\",\"imgName\":\"badge_big_event_5.png\",\"desc\":\"上报 5 件交通事件\"},{\"name\":\"首次上报交通事件\",\"id\":17,\"obtainTime\":\"2013-03-01 11:14:04\",\"smallImgName\":\"badge_event_1.png\",\"imgName\":\"badge_big_event_1.png\",\"desc\":\"首次上报交通事件\"},{\"name\":\"路况贡献 10km\",\"id\":29,\"obtainTime\":\"2013-02-28 15:10:22\",\"smallImgName\":\"badge_track_10km.png\",\"imgName\":\"badge_big_track_10km.png\",\"desc\":\"路况贡献 10km\"},{\"name\":\"路况贡献 3km\",\"id\":30,\"obtainTime\":\"2013-02-21 13:34:59\",\"smallImgName\":\"badge_track_3km.png\",\"imgName\":\"badge_big_track_3km.png\",\"desc\":\"路况贡献 3km\"},{\"name\":\"诚信用户\",\"id\":2,\"obtainTime\":\"2012-11-14 11:01:40\",\"smallImgName\":\"badge_register_complete.png\",\"imgName\":\"badge_big_register_complete.png\",\"desc\":\"个人资料完整度100%\"},{\"name\":\"超能侠\",\"id\":16,\"obtainTime\":\"2012-09-25 11:19:43\",\"smallImgName\":\"\",\"imgName\":\"\",\"desc\":\"累计行驶2000km\"},{\"name\":\"超级骑士\",\"id\":15,\"obtainTime\":\"2012-09-25 10:59:30\",\"smallImgName\":\"badge_milage_1000km.png\",\"imgName\":\"badge_big_milage_1000km.png\",\"desc\":\"累计行驶1000km\"},{\"name\":\"公路侠\",\"id\":9,\"obtainTime\":\"2012-09-25 10:58:16\",\"smallImgName\":\"badge_milage_500km.png\",\"imgName\":\"badge_big_milage_500km.png\",\"desc\":\"累计行驶500km\"},{\"name\":\"公路骑士\",\"id\":8,\"obtainTime\":\"2012-09-14 19:05:15\",\"smallImgName\":\"badge_milage_100km.png\",\"imgName\":\"badge_big_milage_100km.png\",\"desc\":\"累计行驶100km\"},{\"name\":\"轻车熟路\",\"id\":14,\"obtainTime\":\"2012-09-13 19:29:13\",\"smallImgName\":\"badge_milage_50km.png\",\"imgName\":\"badge_big_milage_50km.png\",\"desc\":\"累计行驶50km\"},{\"name\":\"新手上路\",\"id\":7,\"obtainTime\":\"2012-09-01 17:35:31\",\"smallImgName\":\"badge_milage_3km.png\",\"imgName\":\"badge_big_milage_3km.png\",\"desc\":\"累计行驶3km\"},{\"name\":\"一鸣惊人\",\"id\":4,\"obtainTime\":\"2012-08-31 15:05:24\",\"smallImgName\":\"badge_weibo_first.png\",\"imgName\":\"badge_big_weibo_first.png\",\"desc\":\"第一次分享微博\"},{\"name\":\"新人徽章\",\"id\":1,\"obtainTime\":\"2012-08-30 12:09:26\",\"smallImgName\":\"badge_register.png\",\"imgName\":\"badge_big_register.png\",\"desc\":\"注册账号\"},{\"name\":\"上报 50 件交通事件\",\"id\":20,\"obtainTime\":\"2012-03-22 12:00:00\",\"smallImgName\":\"badge_event_50.png\",\"imgName\":\"badge_big_event_50.png\",\"desc\":\"上报 50 件交通事件\"}],\"email\":\"atest23@a.com\",\"totalBadges\":30,\"totalTrackMilage\":163.7,\"fans\":0,\"carNum\":\"\",\"totalCoins\":0,\"username\":\"路况小勇士\",\"userType\":\"trafficeye\",\"levelPoint\":1926,\"levelPercent\":90,\"uid\":\"10924\",\"birthdate\":\"2003-11-14\",\"gender\":\"F\",\"totalPoints\":2193,\"nextLevelPoint\":2222,\"mobileValidate\":0,\"qq\":\"\",\"description\":\"\",\"userGroup\":0}","I_7.1,i_2.2.6","1CF4A942-04BC-4579-832A-CB27F6BBF206","{\"lon\":\"116.389891\",\"lat\":\"39.968322\"}");
    }); 
    
 }(window));