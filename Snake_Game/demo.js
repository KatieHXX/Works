//点击开始游戏->startPage->开始游戏
//随机出现食物，出现三节蛇
//按下上下左右->改变方向
//判断是否吃到食物->食物消失，蛇长+1
//判断游戏结束，并弹出框




var loserScore = document.getElementById('loserScore');
var lose = document.getElementById('lose');
var content=document.getElementById('content');
var startPage=document.getElementById('startPage');
var scoreBox = document.getElementById('score');
var close = document.getElementById('close');
var startP = document.getElementById('startP');
var startBtn = document.getElementById('startBtn');
var con = document.getElementById('con');
var startGameBool = true;//能否开始游戏
var startPaushBool = true;//是否暂停

var snakeMove;//定时器
var speed = 200;



	init();

function init(){
	//地图
	
	this.mapW=parseInt(getComputedStyle(content).width);
	this.mapH=parseInt(getComputedStyle(content).height);
	this.mapDiv= content;

	//食物

	this.foodW = 20;
	this.foodH = 20;
	this.foodX = 0;
	this.foodY = 0;

	//蛇头
	this.snakeW = 20;
	this.snakeH = 20;

	this.snakeBody = [[3,2,'head'],[2,2,'body'],[1,2,'body'],[0,2,'body']];

	console.log('Game Init');

	//游戏属性（默认值）
	
	this.direct = 'right';
	this.left = false;
	this.right = false;
	this.up = true;
	this.down = true;

	this.score = 0;

	}


	startBtn.onclick = function(){
		startAndPaush();
	}
	startP.onclick = function(){
		startAndPaush();
	}


function startAndPaush(){
	if(startPaushBool){//没有暂停游戏
		if(startGameBool){//可以开始游戏
			startGame();
			startGameBool = false;
		}
		startP.setAttribute('src','img/pause.png');

		document.onkeydown = function(e){
			var code = e.keyCode
			setDirect(code);
		}

		snakeMove = setInterval(function(){
		move()},speed); //运动

		startPaushBool = false;
		}
		else{
		// startP.setAttribute('src','img/start.png');
		clearInterval(snakeMove);		// 清除定时器

		document.onkeydown = function(e){
			e.returnValue = false;
			 return false;
		};
		startPaushBool = true;
	}
}

// 键盘落下时会返回ASC码，需要去获取原对象e
document.onkeydown = function(e){
		var code = e.keyCode
		setDirect(code);//37.38.39.40????
		}


function startGame(){
	console.log('Game Start');


	startPage.style.display = 'none';
	startP.style.display = 'block';
	food();
	snake();
	//根据键盘进行移动
	// bindEvent();
	
}



function food(){
	console.log('Food Show');

	var food = document.createElement('div');
	food.style.width = this.foodW + 'px';
	food.style.height = this.foodH + 'px';
	food.style.position= 'absolute';
	this.foodX = Math.floor(Math.random() * (this.mapW/20));
	this.foodY = Math.floor(Math.random() * (this.mapH/20));
	food.style.left = this.foodX * 20 + 'px';
	food.style.top = this.foodY * 20 +'px' ;
	this.mapDiv.appendChild(food).setAttribute('class','food');
}



function snake(){
	for(var i=0;i<this.snakeBody.length;i++){
		var snake = document.createElement('div');
		snake.style.width = this.snakeW + 'px';
		snake.style.height = this.snakeH + 'px';
		snake.style.position = 'absolute';

		//坐标*20 =距离
		snake.style.left = this.snakeBody[i][0] *20 + 'px';
		snake.style.top = this.snakeBody[i][1] *20 + 'px';

		//插入蛇身
		snake.classList.add(this.snakeBody[i][2]);
		this.mapDiv.appendChild(snake).classList.add('snake');

		// 蛇头图片翻转
		switch(this.direct){
			case 'right':
				snake.style.transform = 'rotate(0deg)';
				break;

			case 'up':
				snake.style.transform = 'rotate(270deg)';
				break;

			case 'left':
				snake.style.transform = 'rotate(180deg)';
				break;

			case 'down':
				snake.style.transform = 'rotate(90deg)';
				break;

			default:
				break;

		}
	}
}



function move(){
	for(var i=this.snakeBody.length-1;i>0;i--){
		this.snakeBody[i][0]=this.snakeBody[i-1][0];	//x值与前一位相等
		this.snakeBody[i][1]=this.snakeBody[i-1][1];	//y值同
	}

	// 改变snakeBody里面的值
	switch(this.direct){
		case 'right':
			this.snakeBody[0][0] +=1;
			break;

		case 'up':
			this.snakeBody[0][1] -=1;
			break;

		case 'left':
			this.snakeBody[0][0] -=1;
			break;

		case 'down':
			this.snakeBody[0][1] +=1;
			break;

		default:
			break;
	}

	//删除原数组
	removeClass('snake');

	//创建新数组（新蛇）
	snake();

	if(this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY){
		
		// Push数组
		var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
		var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];

		switch(this.direct){
			case 'right':
				this.snakeBody.push([snakeEndX + 1,snakeEndY,'body'])
				break;

			case 'up':
				this.snakeBody.push([snakeEndX ,snakeEndY - 1,'body'])
				break;

			case 'left':
				this.snakeBody.push([snakeEndX - 1,snakeEndY,'body'])
				break;

			case 'down':
				this.snakeBody.push([snakeEndX ,snakeEndY + 1,'body'])
				break;

			default:
				break;
			}


		this.score += 1;
		scoreBox.innerHTML = this.score;
		removeClass('food');
		food();
	}

// 判断是否有出边界

	if(this.snakeBody[0][0]<0 || this.snakeBody[0][0] >=this.mapW/20){
		relodGame();

		// 上边界
	}
	if(this.snakeBody[0][1]<0 || this.snakeBody[0][1] >=this.mapH/20){
		relodGame();

	}

// 判断是否有自碰

	var snakeHX = this.snakeBody[0][0];
	var snakeHY = this.snakeBody[0][1];
	for(var i=1 ; i<this.snakeBody.length;i++){
		if(snakeHX == snakeBody[i][0] && snakeHY == snakeBody[i][1]){
		relodGame();
		}
	}

}



function relodGame(){
	// 回到初始值
	
	removeClass('snake');
	removeClass('food');
	clearInterval(snakeMove);//清除定时器

	this.snakeBody = [[2,1,'head'],[1,1,'body'],[0,1,'body']];
	this.direct = 'right';
	this.left = false;
	this.right = false;
	this.up = true;
	this.down = true;

	lose.style.display = 'block';
	loserScore.innerHTML = this.score;
	this.score = 0;	// 分数初始化
	scoreBox.innerHTML = this.score;
	startGameBool = true;//能否开始游戏
	startPaushBool = true;//是否暂停
	startP.setAttribute('src','img/end.png');

}


//删掉原蛇
function removeClass(className){
	//把传进来的值取出来
	var ele = document.getElementsByClassName(className);

	//找到父亲
	while(ele.length>0){
		ele[0].parentNode.removeChild(ele[0]);
	}
}


function setDirect(code){//数字是个谜

	switch(code){
		case 37:
		if(this.left){
			this.direct = 'left';
			this.left = false;
			this.right = false;
			this.up = true;
			this.down = true;
		}
		break;

		case 38:
		if(this.up){
			this.direct = 'up';
			this.left = true;
			this.right = true;
			this.up = false;
			this.down = false;
		}
		break;

		case 39:
		if(this.right){
			this.direct = 'right';
			this.left = false;
			this.right = false;
			this.up = true;
			this.down = true;
		}
		break;

		case 40:
		if(this.down){
			this.direct = 'down';
			this.left = true;
			this.right = true;
			this.up = false;
			this.down = false;
		}  
		break;

		default:
			break;

	}
}




