 (function(window) { //闭包
    
    function MessageInfoManager() {  
    };
    MessageInfoManager.prototype = {//方法挂载在原型链        
        //生成用户私信列表。在页面右边
        creatUserLettersHtml : function(data) {
            var me = this;
            var htmls = [];
            htmls.push("<li><div class='l mright'>");
            var avaterSrc = "";
            if (!data.avatar) {
                avaterSrc = "images/default.png";
            } else {
                avaterSrc = data.avatar;
            }            
            htmls.push("<img src = '" + avaterSrc + "' alt='' width='40' height='40' /></div>");                 
            htmls.push("<div class='r mright'>");
            htmls.push("<p>" + data.letter_content + "<span>" + data.time + "前</span>");
            htmls.push("</p></div></li>");
            return htmls.join("");
        },
        //生成好友私信列表，在页面左边
        creatFriendLettersHtml : function(data) {
            var me = this;
            var htmls = [];
            var avaterSrc = "";
            if (!data.avatar) {
                avaterSrc = "images/default.png";
            } else {
                avaterSrc = data.avatar;
            } 
            htmls.push("<li><div class='l'>");
            htmls.push("<img src = '" + avaterSrc + "' alt='' width='40' height='40' /></div>");
            htmls.push("<div class='r'>");
            htmls.push("<p>" + data.letter_content + "<span>" + data.time + "前</span>");
            htmls.push("</p></div></li>");
            return htmls.join("");
        },
        //私信生成列表
        getLettersHtml : function(letters) {
           // console.log(letters);
            var data = letters;
            var htmls = [];
            var dataStr = Trafficeye.offlineStore.get("traffic_chat");
            var obj = Trafficeye.str2Json(dataStr);
            var uid = obj.uid;
            var friend_id = obj.friend_id;
            for (var i = 0, len = data.length; i < len; len--) {
                
                if(uid == data[len-1].uid)  {
                    htmls.push(this.creatUserLettersHtml(data[len-1]));
                 } 
                 else {
                    htmls.push(this.creatFriendLettersHtml(data[len-1]));
                 }
                
            }
            return htmls.join("");
        }
    };

    function PageManager() {
        //ID元素对象集合
        this.elems = {
            "username" : null,
            "chatlist" : null,
            "inputtext" : null,
            "backpagebtn" : null,
            "refreshbtn" : null,
            "sendbtn" : null
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
            me.MessageInfoManager = new MessageInfoManager();
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
                backpagebtnElem = me.elems["backpagebtn"],
                refreshbtnElem = me.elems["refreshbtn"];
                backpagebtnElem.onbind("touchstart",me.btnDown,backpagebtnElem);
                backpagebtnElem.onbind("touchend",me.backpagebtnUp,me);
                //刷新按钮
                refreshbtnElem.onbind("touchend",me.refreshbtnUp,me);
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
           me.backPage();
        },
        /**
         * 点击发送消息处理函数
         */
        sendbtnUp : function(evt) {
            var me = this;
            var textContent = me.elems["inputtext"].attr("value");
            var sumbitBtnUp_url = BASE_URL + "create";
            var dataStr = Trafficeye.offlineStore.get("traffic_chat");
            var obj = Trafficeye.str2Json(dataStr);
            var uid = obj.uid;
            var friend_id = obj.friend_id;
            var sumbitBtnUp_data = {"uid" : uid,"friend_id" : friend_id,"letter_content" : textContent};
            if(textContent){
                me.reqSumbitbut(sumbitBtnUp_url, sumbitBtnUp_data);
            }else{
                alert("内容不能为空");
            }

        },
        /**
         * 回复评论请求函数
         */
        reqSumbitbut : function(url, data) {
            var me = this,
                commentslistidElem = me.elems["chatlist"];
            var reqParams = Trafficeye.httpData2Str(data);
            if (url) {
                Trafficeye.httpTip.opened(function() {
                                     me.isStopReq = true;
                                }, me);
                                me.isStopReq = false;
                var reqUrl = url + reqParams;
                $.ajaxJSONP({
                    url : reqUrl,
                    success: function(data){
                        Trafficeye.httpTip.closed();
                        if (data && !me.isStopReq) {
                            var state = data.state.code;
                            if (state == 0) {
                                var commenthtml = me.MessageInfoManager.getLettersHtml(data.letters);
                                    commentslistidElem.html(commenthtml);
                            } else {
                                me.reqMessageInfoFail();
                            }
                        } else {
                            me.reqMessageInfoFail();
                        }
                    }
                })
            } else {
                me.reqMessageInfoFail();
            }
        },
        /**
         * 请求聊天消息信息
         * @param  {String} url 服务URL
         * @param  {JSON Object} data 请求协议参数对象
         */
        reqMessageInfo : function(url, data) {
            var me = this;
            var reqParams = Trafficeye.httpData2Str(data);
            if (url) {
                Trafficeye.httpTip.opened(function() {
                    me.isStopReq = true;
                }, me);
                me.isStopReq = false;
                var reqUrl = url + reqParams;
                $.ajaxJSONP({
                    url : reqUrl,
                    success: function(data){
                        if (data && !me.isStopReq) {
                            me.reqMessageInfoSuccess(data);
                        } else {
                            me.reqMessageInfoFail();
                        }
                    }
                })
            }
        },
        /**
         * 请求聊天信息成功后的处理函数
         * @param  {JSON Object} data
         */
        reqMessageInfoSuccess : function(data) {
            var me = this,     
                chatlistidElem = me.elems["chatlist"];
                Trafficeye.httpTip.closed();
            if (data) {   
                me.setUserName(data.user.name);
                var chathtml = me.MessageInfoManager.getLettersHtml(data.letters); 
                chatlistidElem.html(chathtml);                
            }
        },
        //刷新按钮处理函数
        refreshbtnUp : function(evt) {
            var me = this,
                elem = evt.currentTarget;
            $(elem).removeClass("curr");
            var dataStr = Trafficeye.offlineStore.get("traffic_chat");
            var obj1 = Trafficeye.str2Json(dataStr);
            window.initPageManager(obj1.uid,obj1.friend_id);
        },
        //返回按钮处理函数
        backPage : function() {
            var data = Trafficeye.offlineStore.get("traffic_chat");
            Trafficeye.toPage("timeline.html");
        },
        setUserName : function(username){
            var me = this;
            var usernameElem = me.elems["username"];
            usernameElem.html(username);
        },        
       
        /**
         * 请求聊天消息信息失败后的处理函数
         */
        reqMessageInfoFail : function() {

        }
    };

    //基础URL
    var BASE_URL = "http://mobile.trafficeye.com.cn:"+Trafficeye.UrlPort+"/TrafficeyeCommunityService/sns/v1/letter/";

    $(function(){

        window.initPageManager = function(uid,friend_id){
            var messageInfo_url = BASE_URL + "findList";
            var dataStr = Trafficeye.offlineStore.get("traffic_chat");
            var messageInfo_data = {"uid" : uid ,"friend_id" : friend_id , "page" : "0","count":"10"};
            if(dataStr){
                var obj = Trafficeye.str2Json(dataStr);
                var uid = obj.uid;
                var friend_id = obj.friend_id;
                messageInfo_data = {"uid" : uid ,"friend_id" : friend_id , "page" : "0","count":"10"};
            }
            var pm = new PageManager();
            Trafficeye.pageManager = pm;
            //初始化用户界面
            pm.init();
            //请求聊天消息数据，填充用户界面元素
            pm.reqMessageInfo(messageInfo_url, messageInfo_data);
            //渲染发送按钮，绑定onclick事件
            var sendbtnElem = pm.elems["sendbtn"];
            sendbtnElem.html("<div id = \"sendbtn\" onclick=\"sendbtnUp(this)\";>发送</div>");
        };

        window.sendbtnUp = function(evt) {
             var pm = Trafficeye.pageManager;
            if (pm.init) {
                pm.sendbtnUp(evt);
            }
        };

        var dataStr = Trafficeye.offlineStore.get("traffic_chat");
        var obj1 = Trafficeye.str2Json(dataStr);
        window.initPageManager(obj1.uid,obj1.friend_id);

    }); 
    
    setTimeout('window.location.reload()',20000); //指定20秒刷新一次 

 }(window));