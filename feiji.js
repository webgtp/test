/**
 * Created by Lenovo on 2016/10/24.
 */
var GameConfig={
    width:520, //整个游戏宽度，用于判断子弹，飞机是否飞出去了
    height:568, //游戏高度
    board:null,
    fenshu:0,
    fenshuBoard:null, //分数显示面板
    isGameOver:false, //游戏是否结束
    cxkaishi:null,
    kaishi:null
};

var diPlanes=[];

var Game={ //游戏控制器
    myplane:null,
    n:null,//游戏计时器，用于定时出现敌机
    diPlanes:[],

    init:function(){//初始化游戏
        GameConfig.board=$('#feiji');
        GameConfig.board.attr('style','border:1px solid #000;margin:0 auto;position:relative;overflow:hidden;')
        GameConfig.board.css('width',GameConfig.width+'px');
        GameConfig.board.css('height',GameConfig.height+'px');
        GameConfig.kaishi=$('<div style="position:absolute; top:20%;left:43%;text-align:center; width:60px;height:40px;line-height:40px;border:solid 1px #eeeeee;padding:4px;"><input style="width:45px;height:36px;" id="ks" type="button" value="开始"/></div>')
        //加入分数显示面板
        GameConfig.fenshuBoard=$('<div style="position:absolute;top:0;left:0;z-index:10000;">分数：'+GameConfig.fenshu+'</div>')
        GameConfig.board.append(GameConfig.fenshuBoard);
        GameConfig.board.append(GameConfig.kaishi);
    },
    start:function(){//游戏开始
        GameConfig.kaishi.remove();
        this.myplane=Object.create(FeiJi);
        this.myplane.show(GameConfig.height-126,(GameConfig.width-102)/2);
        this.myplane.autoFire();
        this.myplane.moveStep=10;
        this.bindKeyEvent();
        var _self=this;
        this.n=setInterval(function(){
            var p=Object.create(DiJi);
            var rNumber=100*Math.random();
            if(rNumber<70)
                p.type=0;
            if(rNumber>=70&&rNumber<95)
                p.type=1;
            if(rNumber>95)
                p.type=2;
            p.radomShowAndMove();
            diPlanes.push(p);
        },1000);
    },
    bindKeyEvent:function(){
        var _self=this;
        $('body').on('keydown',function(e){
            //alert(e.keyCode);
            switch(e.keyCode){
                case 87:
                    _self.myplane.moveUp();
                    break;
                case 83:
                    _self.myplane.moveDown();
                    break;
                case 65:
                    _self.myplane.moveLeft();
                    break;
                case 68:
                    _self.myplane.moveRight();
                    break;
                case 85:
                    _self.myplane.fire();
                    break;
            }
        });
    },

    restart:function(){
        var _self=this;
        $('#cxks').on('click',function(){
            GameConfig.fenshu=0;
            GameConfig.cxkaishi.remove();
            GameConfig.board.empty();
            GameConfig.fenshuBoard=$('<div style="position:absolute;top:0;left:0;z-index:10000;">分数：'+GameConfig.fenshu+'</div>')
            GameConfig.board.append(GameConfig.fenshuBoard);

            Game.start();

        });
    }, //游戏重新开始
    gameover:function(){
        clearInterval(this.n); //不再产生新敌机
        //去掉当前敌机的移动行为
        for(var i= 0;i<diPlanes.length;i++)
        {
            //让每架敌机不再移动
            clearInterval(diPlanes[i].n);
            diPlanes[i].img.remove();
        }
        diPlanes=[];
        //关闭我方飞机发射子弹
        clearInterval(this.myplane.n);
        GameConfig.cxkaishi=$('<div style="position:absolute;top:30%;left:36%;z-index:10000; border:solid 1px #ccc;padding: 2px;text-align: center;">' +
           '<div style="color:firebrick;text-align:center; border:solid 1px #ccc;padding:4px;">游戏结束，您的得分为：'+GameConfig.fenshu+'' +
            '</div><input id="cxks" type="button" value="重新开始"/></div>');
        GameConfig.board.append(GameConfig.cxkaishi);
       // FeiJi.remove();
         this.restart();
    } //游戏结束
};
//Game.init=function(){};

var MoveImage={ //动图类
    url:'', //图片地址
    img:null, //图片元素对象
    top:0, //图片元素上边距
    left:0, //图片元素下边距
    moveStep:1, //每次移动像素，默认移动一个像素
    show:function(top,left) {//显示动图
        this.top = top;
        this.left = left;
        this.img = new Image();
        this.img.src = this.url;
        var _self=this;
        $(_self.img).attr('style','position:absolute;')
        _self.setPosition();
        GameConfig.board.append(_self.img);
    },
    setPosition:function(){ //将图片对象移动到当前坐标
        $(this.img).css('top',this.top+'px');
        $(this.img).css('left',this.left+'px');
    },
    moveLeft:function(){//左移动
        if(this.left>=this.moveStep){
            this.left=this.left-this.moveStep;
            this.setPosition();
        }
    },
    moveRight:function(){//右移动
        if(this.left<=GameConfig.width-this.img.width-this.moveStep){
            this.left=this.left+this.moveStep;
            this.setPosition();
        }
    },
    moveUp:function(){//上移动
        if(this.top>=this.moveStep){
            this.top=this.top-this.moveStep;
            this.setPosition();
        }
    },
    moveDown:function(){//下移动
        if(this.top<=GameConfig.height-this.img.height-this.moveStep){
            this.top=this.top+this.moveStep;
            this.setPosition();
        }
    },
    remove:function(){//从父容器中移除
        this.img.remove();
    },
    isHit:function(o){
        var px= o.left<=this.left?this.left:o.left;
        var py= o.top<=this.top?this.top:o.top;
        if (px >= o.left && px <= o.left + o.img.width && py >= o.top && py <= o.top + o.img.height && px >= this.left && px <= this.left + this.img.width && py >= this.top && py <= this.top + this.img.height) {
            return true;
        } else {
            return false;
        }
    }
};
//ES5才支持Object.create
//也就是说低版本IE浏览器需要引入es5-shim
var ZiDan=Object.create(MoveImage); //子弹类
ZiDan.url='img/shoot/bullet1.png';
ZiDan.img=$('<img src="'+ZiDan.url+'"/>');
ZiDan.moveSpeed=10; //移动一个像素的时间，单位毫秒
ZiDan.n=null;
ZiDan.autoMoveUp=function(top,left){//自动向上移动，如果超出范围，自动消失
    this.show(top,left);
    var _self=this;
    this.n=setInterval(function(){
        _self.moveUp();
        for(var i=0;i<diPlanes.length;i++)
        {
            if(_self.isHit(diPlanes[i])){
                clearInterval(_self.n); //移除计时器
                _self.remove(); //让子弹自身消失
                diPlanes[i].hit(); //调用敌机对象的掉血方法
            }
        }
        if(_self.top<_self.moveStep)
        {
            clearInterval(_self.n);
            _self.remove();
        }
    },this.moveSpeed);
};

//我方飞机
var FeiJi=Object.create(MoveImage);
FeiJi.url='img/shoot/hero1.png';
FeiJi.n=null;
FeiJi.ziDanInterval=300;
FeiJi.moveLeft=function(){//左移动
    if(this.left>=this.moveStep-(this.img.width/2)){
        this.left=this.left-this.moveStep;
        this.setPosition();
    }
};
FeiJi.moveRight=function(){//右移动
    if(this.left<=GameConfig.width-(this.img.width/2)-this.moveStep){
        this.left=this.left+this.moveStep;
        this.setPosition();
    }
};
FeiJi.fire=function(){ //开火
    var z=Object.create(ZiDan);
    z.moveStep=3;
    z.autoMoveUp(this.top- 11,this.left+(102/2)- (5)/2);
};
FeiJi.autoFire=function(){ //持续自动开火
    var _self=this;
    FeiJi.n=setInterval(function(){
        _self.fire();
    },FeiJi.ziDanInterval);
};
    FeiJi.remove=function(){
    console.log(FeiJi)
    alert(1);
    };
//敌方飞机
var DiJi=Object.create(MoveImage);
DiJi.type=0; //0小敌机，1中敌机，2大敌机
DiJi.moveSpeed=1;
DiJi.n=null;
DiJi.hp=1;
DiJi.moveDown=function(){
    if(this.top<=GameConfig.height){
        this.top=this.top+this.moveStep;
        this.setPosition();
        if(this.isHit(Game.myplane)){
            Game.gameover();
        }
    }
};
DiJi.hit=function(){ //敌机被子弹击中掉血
    if(this.hp>1)
        this.hp--;
    else{
        switch(this.type){
            case 0:
                GameConfig.fenshu+=1;
                break;
            case 1:
                GameConfig.fenshu+=15;
                break;
            case 2:
                GameConfig.fenshu+=30;
                break;
        }
        GameConfig.fenshuBoard.text('分数：'+GameConfig.fenshu);
        this.remove();
    }
};
DiJi.remove=function(){
    if(diPlanes.indexOf(this)>-1)
        diPlanes.splice(diPlanes.indexOf(this),1);
    this.img.remove();
    clearInterval(this.n);

};
DiJi.radomShowAndMove=function(){ //随机出现以及移动
    var left=0;
    var top=0;
    //根据type生成对应的飞机图片
    switch(this.type){
        case 0:
            this.url='img/shoot/enemy1.png';
            left=(GameConfig.width-57)*Math.random();
            top=-43;
            break;
        case 1:
            this.url='img/shoot/enemy2.png';
            left=(GameConfig.width-69)*Math.random();
            top=-99;
            this.moveSpeed=15;
            this.hp=5;
            break;
        case 2:
            this.url='img/shoot/enemy3_n1.png';
            left=(GameConfig.width-169)*Math.random();
            top=-258;
            this.moveSpeed=50;
            this.hp=20;
            break;
    }
    //使用父类中的show方法显示

    this.show(top,left);
    //使用计时器，调用父类的方法实现从上到下的移动
    var _self=this;
    this.n=setInterval(function(){
        _self.moveDown();
        if(_self.top>=GameConfig.height)
        {
            clearInterval(_self.n);
            _self.remove();
        }
    },this.moveSpeed);
};

$(function(){
    Game.init();
   $('#ks').on('click',function(){
    Game.start();
   });
});