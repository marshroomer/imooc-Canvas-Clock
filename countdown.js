var WINDOW_WIDTH;   //屏幕宽
var WINDOW_HEIGHT;  //屏幕高
var RADIUS;         //每个小圆的半径长
var MARGIN_TOP;     //每个数字的上边距
var MARGIN_LEFT;    //每个数字的左边距

//const endTime = new Date();                         //设置倒计时结束的时间为当前时间
//endTime.setTime( endTime.getTime() + 3600*1000*2 ); //设置倒计时默认为2小时
var curTime = 0;                                      //当前时间距倒计时的剩余时间

var balls = [];   //存放掉落的小球
var colors = ['#33b5e5','#0099cc','#aa66cc','9933cc','#99cc00','#669900','#ffbb33','ff8800','ff4444','#cc0000']; //存放掉落的小球的颜色

window.onload = function(){

    WINDOW_WIDTH  = document.documentElement.clientWidth-20;           //获取用户屏幕宽
    WINDOW_HEIGHT = document.documentElement.clientHeight-20;          //获取用户屏幕高
    MARGIN_LEFT   = Math.round(WINDOW_WIDTH/10);                       //每个数字的左边距
    MARGIN_TOP    = Math.round(WINDOW_HEIGHT/5);                       //每个数字的上边距
    RADIUS        = Math.round(WINDOW_WIDTH*4/5/107)-1;                //每个小圆的半径长

    var canvas  = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width  = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curTime = getCurrentTime();       //获取当前所剩秒数
    console.log(curTime);
    setInterval(
        function() {
            render(context);          //自定义render函数进行绘制操作
            update();                 //修改数据
        }
        ,20                           //设置动画的刷新时间(单位ms),如果设置20ms刷新一次，一秒1000ms,则动画的帧数为50帧
    );
}

/*update():修改数据
* */
function update(){
    //nextTime获取当前的时间,与setInterval中的时间对比
    //由于动画效果刷新时间很快，本例中，一秒会执行此函数5次，所以每次获取当前时间可能相等也可能不等
    //不等则意味已经时间过了一秒
    var nextTime   = getCurrentTime();
    var nextHour   = parseInt( nextTime/3600 );
    var nextMinute = parseInt( (nextTime-3600*nextHour) /60);
    var nextSecond = nextTime % 60;

    var curHour    = parseInt( curTime/3600 );
    var curMinute  = parseInt( (curTime-3600*nextHour) /60);
    var curSecond  = curTime % 60;

    //只需要判断秒数是否相等即可判断，分别判断每次变化时，变化的是时分秒的个位数还是十位数
    if(nextSecond != curSecond){

        if(parseInt(nextHour/10) != parseInt(curHour/10)){
            addBalls(MARGIN_LEFT,MARGIN_TOP,parseInt(curHour/10));
        }
        if(parseInt(nextHour%10) != parseInt(curHour%10)){
            addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHour%10));
        }

        if(parseInt(nextMinute/10) != parseInt(curMinute/10)){
            addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinute/10));
        }
        if(parseInt(nextMinute%10) != parseInt(curMinute%10)){
            addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinute%10));
        }

        if(parseInt(nextSecond/10) != parseInt(curSecond/10)){
            addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSecond/10));
        }
        if(parseInt(nextSecond%10) != parseInt(curSecond%10)){
            addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSecond%10));
        }

        //将新的实践赋值给curTime
        curTime = nextTime;
    }
    updateBalls();

}

/*updateBalls():修改每个小球的位置，完成小球掉落的特效
* */
function updateBalls(){
    var len = balls.length;             //获取掉落的小球的总个数
    for(var i=0;i < len;i++){
        balls[i].x += balls[i].vx;      //x方向位移f(x) = x + V(x)
        balls[i].y += balls[i].vy;      //y方向位移f(y) = y + V(y)
        balls[i].vy += balls[i].g;      //y方向速度V(y) = V(y) + g  g为重力加速度

        //底部碰撞检测，如果小球掉过底部边框，y方向速度转向，并乘以一个空气摩擦系数，模拟速度的损耗
        if(balls[i].y >= WINDOW_HEIGHT-RADIUS){
            balls[i].y = WINDOW_HEIGHT-RADIUS;      //将小球位置改为‘放‘在底边框上
            balls[i].vy = -balls[i].vy*0.7;
        }
    }

    //性能优化一：将滚出屏幕的小球从balls数组中删除
    var cnt = 0;                            //记录当前是第几个还在屏幕内的小球
    for(var i=0;i < len;i++){
        //判断条件：小球在屏幕内
        if(balls[i].x+RADIUS > 0 && balls[i].x-RADIUS < WINDOW_WIDTH){
            balls[cnt++] = balls[i];        //如果小球在屏幕内，将其在数组的位置移至最前
        }
    }

    //cnt将记录还在屏幕内的小球的总个数，且数组的下标大于cnt的元素为可删除的小球
    while( balls.length > cnt){
        balls.pop();                        //删除滚出屏幕外的小球
    }
}

/*addBalls(): 将当前变化的一位数字所包含的小球（之后要掉落的小球）存放在Array balls中
* @param int x    变化数字的x坐标起点
* @param int y    变化数字的y坐标起点
* @param int num  变化数字的值
* */
function addBalls(x,y,num){
    for(var i=0;i < digit[num].length ;i++)
        for(var j=0;j < digit[num][i].length ;j++) {
            if (digit[num][i][j] == 1) {
                    //新建一个aball对象存放组成数字的各个小球的信息
                    var aball = {
                        x : x+(2*j+1)*(RADIUS+1),                           //小球的x起始坐标
                        y : y+(2*i+1)*(RADIUS+1),                           //小球的y起始坐标
                        vx : 4*Math.pow(-1,parseInt(1000*Math.random())),   //小球的起始x速度
                        vy : -10,                                           //小球的起始y速度
                        g : 1+3*Math.random().toFixed(1),                   //小球的掉落加速度
                        color : colors[Math.floor((colors.length)*Math.random())]   //小球的颜色
                    }
                    balls.push(aball);      //将小球push到数组balls中
            }
        }
}

/*
* getCurrentTime():获取当前时间，最终显示的是倒计时效果
* */
// function getCurrentTime(){
//     var curDate = new Date();                               //获取当前的时间
//     var ret = endTime.getTime() - curDate.getTime();        //getTime获取距1970的毫秒，ret获取距倒计时的时间的毫秒数
//     ret = Math.round(ret)/1000;                             //将毫秒数转化为秒数，再化为整数
//
//     return ret>0 ? ret : 0;                                 //如果倒计时结束，返回0，否则返回剩余的秒数
// }

/*
* getCurrentTime():获取当前时间，最终显示的是当前的时间
* */
function getCurrentTime(){
    var curDate = new Date();                               //获取当前的时间
    var ret = curDate.getHours()*3600 + curDate.getMinutes()*60 + curDate.getSeconds();

    return ret;
}

/*render()函数：绘制数字
* @context ext cansas的上下文环境
* */
function render(ext){

    ext.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    var hour   = parseInt( curTime / 3600 );
    var minute = parseInt( (curTime - hour*3600)/60 );
    var second = curTime % 60;

    //自定义renderDigit绘制单个数字
    renderDigit(MARGIN_LEFT                ,MARGIN_TOP,parseInt(hour/10)  ,ext);  //小时
    renderDigit(MARGIN_LEFT + 15*(RADIUS+1),MARGIN_TOP,parseInt(hour%10)  ,ext);
    renderDigit(MARGIN_LEFT + 30*(RADIUS+1),MARGIN_TOP,10                 ,ext);  //冒号
    renderDigit(MARGIN_LEFT + 39*(RADIUS+1),MARGIN_TOP,parseInt(minute/10),ext);  //分钟
    renderDigit(MARGIN_LEFT + 54*(RADIUS+1),MARGIN_TOP,parseInt(minute%10),ext);
    renderDigit(MARGIN_LEFT + 69*(RADIUS+1),MARGIN_TOP,10                 ,ext);  //冒号
    renderDigit(MARGIN_LEFT + 78*(RADIUS+1),MARGIN_TOP,parseInt(second/10),ext);  //秒钟
    renderDigit(MARGIN_LEFT + 93*(RADIUS+1),MARGIN_TOP,parseInt(second%10),ext);

    //绘制掉落的小球
    var len = balls.length;
    for(var i=0;i < len;i++){
        ext.fillStyle = balls[i].color;
        ext.beginPath();
        ext.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
        ext.closePath();
        ext.fill();
    }
}

/*renderDigit():绘制单个数字
* @int x        绘制起点的x坐标
* @int y        绘制起点的y坐标
* @int num      要绘制的数字
* @context ext  canvas的上下文环境
* */
function renderDigit(x,y,num,ext){
    ext.fillStyle = 'rgb(0,102,153)';

    for(var i=0;i < digit[num].length ;i++)
        for(var j=0;j < digit[num][i].length ;j++){
            if(digit[num][i][j] == 1){
                ext.beginPath();

                //要绘制的圆的圆心计算为
                // x = x + j*2*(R+1) + (R+1)
                // y = y + i*2*(R+1) + (R+1)
                ext.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
                ext.closePath();
                ext.fill();
            }
        }
}