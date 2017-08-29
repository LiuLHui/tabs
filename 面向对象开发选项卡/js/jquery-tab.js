(function ($) {

     function Tab (tab) {

        //保存下this 就能在其他地方调用this
        var _this = this;

        //保存单个tab组件
        this.tab = tab;
        //默认配置参数

        this.config = {

            //用来定义鼠标的触发类型，是click还是mouseover
            "triggerType": "mouseover",
            //用来定义内容切换效果 是直接切换还是淡入淡出效果
            "effect": "default",
            //用来定义tab是否自动切换 当指定了时间间隔就表示自动切换并且切换时间为指定时间间隔
            "auto": false
        };

        //如果配置参数存在，就扩展默认的配置参数
        if (this.getConfig()) {
            // 传进来的参数放后面，会覆盖前面的默认配置 this.config
            $.extend(this.config, this.getConfig());
        }

        //保存tab标签列表，对应的内容列表 传进来的就是外面的整个显示区域，然后配置给tab保存
        //然后就查找相应的 li 跟展示区域的div；
        this.tabItems = this.tab.find("ul.tab-nav li");
        this.contentItems = this.tab.find("div.content-wrap div.content-item");


        //保存配置默认参数
        var config = this.config;
        //根据传进来的事件类型 判断绑定的是click还是mouseover类型 
        //如果是click 就绑定click
        if (config.triggerType === "click") {
            this.tabItems.on(config.triggerType, function () {
                //把当前事件触发对象this 传进去 执行invoke方法
                 debugger 
                _this.invoke($(this));
            });
            //如果穿进来的是mouseover 就绑定mouseover
        } else if (config.triggerType === "mouseover" || config.triggerType != "click") {
            this.tabItems.mouseover(function () {
                 _this.invoke($(this));
            });
        }

        //自动切换功能 当配置了时间，就根据时间间隔自动切换
        if (config.auto) {
            //定义全局定时器
            this.timer = null;
            //定义计数器
            this.loop = 0;
            this.autoPlay();
            //给tab加个hover事件 鼠标移入 关掉定时器
            this.tab.hover(function(){
                //这里的this是要是指向tab的 要用timer 所以要用上面定义的this变量_this
                clearInterval(_this.timer)
            },function(){
                _this.autoPlay();
            })

        }

    };

    Tab.prototype = {
        //自动间隔时间切换
        autoPlay: function () {
            var _this = this, // 保存一下全局this
                tabItems = this.tabItems, // 临时保存tab列表
                tabLength = tabItems.length, //tab的个数
                config = this.config; //默认配置参数

            this.timer = setInterval(function () {
                _this.loop++;
                //假设loop等于或者大于tab的个数就变成0 返回第一位
                if (_this.loop >= tabLength) {
                    _this.loop = 0;
                }
                //找到tab当前的列表 触发一下传进来的事件
                tabItems.eq(_this.loop).trigger(config.triggerType);

            }, config.auto) //传进来的auto时间         
        },

        // 事件驱动函数

        invoke: function (currentTab) {
            //保存一下 调用方法的this指向


            // 问题
            // 调用的时候 this指向调用对象
            //  那如何取得上面类里面的this 调用的时候改变的this 会不会改变
            //  方法里面的this指向
            // console.log(this)


            /*2
             * 要执行Tab的选中状态 当前选中的加上active
             * 切换对应的tab内容 根据配置参数的effect的值 是default还是传进来的参数
             */

            // 保存一下index 然后将对应的index内容区域显示
            var index = currentTab.index();

            // tab 选中状态

            currentTab.addClass("active").siblings().removeClass();

            //切换对应的内容区域，因为切换效果不一样 所以要判断是默认切换呢 还是按照传进来的参数切换

            var effect = this.config.effect;
            
            var conItems = this.contentItems;

            //判断effect是什么效果
            //防止用户输入错误 如果不等于fade就执行默认
            if (effect === "default" || effect != "fade") {
                conItems.eq(index).addClass("current").siblings().removeClass("current");
            } else if (effect === "fade") {
                conItems.eq(index).fadeIn().siblings().fadeOut();
            };

            // 注意： 如果配置了自动切换 要将index的值要跟loop同步起来 判断一下有没有配置值
            if (this.config.auto) {
                // 定时器上的loop的值 就会自动++ 轮播下一个了。
                this.loop = index;
            }

        },
        //获取配置参数
        getConfig: function () {
            //获取一下tab element节点上的data-config
            var config = this.tab.attr("data-config");

            //确保有配置参数
            if (config && config != "") {
                return $.parseJSON(config);
            } else {
                return null;
            }
        }

    };
    //把实例化类定义一个方法 接收传进来的组件
    Tab.init = function(tabs){
        var _this = this;
        tabs.each(function(){
            new _this($(this))
        })
    };

    
    //注册成jquery方法
    $.fn.extend({
        //注册成tab方法
        tab:function(){
            
            this.each(function(){
                //把当前获取的集合传入Tab类
                new Tab($(this))
            })
            return this
        }
    })

    window.Tab = Tab;
})(jQuery)