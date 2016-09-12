// var data={
// 	"name":"canvasdaadfafdsfsdf合成图片",
// 	"shopname":"不过如此",
// 	"image":[
// 		"2.jpg",
// 		"3.jpg"
// 	]
// 	},imgPath;

var compositeList = {
	wanted: '../images/p2/wanted.png',
	pic: '../images/p2/02.jpg',
	ewm: '../images/p2/ewm.jpg'
}

$.extend(fn, {
	createCanvas: function () {

		var masker = document.querySelector('.m-item2 .masker-bg'),
			canvas = masker.querySelector("#canvas"), voteBox;

		if(!canvas) {
			canvas = document.createElement('canvas');
			voteBox = masker.querySelector('.vote-box');

			canvas.id = 'canvas';
			canvas.className = 'canvas';
			canvas.width = 520;
			canvas.height = 730;

			masker.insertBefore(canvas, voteBox);
		}

		return canvas;
	},

	draw: function () {
		var canvas = this.createCanvas(),
			context = canvas.getContext('2d');

		this.drawText(context, '牛泽萌', 'No.007');
		this.drawPic(context);
	},

	drawPic: function (context, obj) {
		context.beginPath();

		function loadImg(obj, border) {
			var img = new Image();
			img.src = obj.src;
			img.onload = function () {
				context.drawImage(this, obj.left, obj.top, obj.width, obj.height);
				if(border) {
					context.lineWidth = 5;
					context.strokeStyle = '#000';
					context.strokeRect(obj.left, obj.top, obj.width, obj.height);
				}
				context.fill();
			}
		}

		var picList = [
			{
				src: 'images/p2/wanted.png',
				left: 70,
				top: 0,
				width: 386,
				height: 129
			}, 
			{
				src: 'images/p2/01.jpg',
				left: 70,
				top: 134,
				width: 376,
				height: 398
			}, 
			{
				src: 'images/p2/ewm.jpg',
				left: 334,
				top: 548,
				width: 182,
				height: 182
			}
		];

		for(var i = 0, l = picList.length; i < l; i++) {
			loadImg(picList[i], i == 1 ? true : false);
		}
	},

	drawText: function (context, name, number) {
		var arr = ['Hi,我是', '我被摩登通缉了！现在参加了', '全国高校摩登Girl的活动', '编号', '长按识别二维码给我点赞投票吧'],
			l = arr.length;

		context.beginPath();
		context.font = '22px/36px 宋体';
		context.fillStyle = '#303030';

		for(var i = 0; i < l; i++) {
			context.fillText(arr[i], 0, 570 + i * 36);
		}

		context.beginPath();
		context.font = '26px/36px 宋体';
		context.fillStyle = '#976835';
		context.fillText(name, 85, 570);
		context.fillText(number, 70, 570 + (l - 2) * 36);
	}
});

function draw(src,callback){
	var mycanvas=document.createElement('canvas');
	mycanvas.style.cssText = ";position:absolute;top:-9999px;"
	document.body.appendChild(mycanvas);	
	data.image.push(src);
	var len=data.image.length;
	mycanvas.width=640;
	mycanvas.height=1000;
	if(mycanvas.getContext){
		var context=mycanvas.getContext('2d');
		context.font='28px 宋体';
		context.fillStyle='#333';
		context.fillText('我是',170,60);
		context.fillStyle='#f5c158';
		context.fillText(data.name,230,60);
		context.fillStyle='#333';
		context.fillText(',', 235 + context.measureText(data.name).width,60);
		context.fillStyle='#333';
		context.fillText('我为',170,100);
		context.fillStyle='#f5c158';
		context.fillText(data.shopname,230,100);
		context.fillStyle='#333';
		context.fillText('代言。',235 + context.measureText(data.shopname).width,100);

		// 宣传图片
		var h=0;
		function drawing(num){
			if(num<len){
				var img=new Image;
				img.src=data.image[num];
				if(num==0){
					img.onerror=function(){
						context.fillStyle='#fff';
						context.stokeStyle='#dfdfdf';
						context.fillRect(20,20,100,100);
						context.strokeRect(20,20,100,100);
						context.font='24px 微软雅黑';
						context.textAlign='center';
						context.textBaseline='middle';
						context.fillStyle='#333';
						context.fillText('LOGO',70,70);
						drawing(num+1);
					}
					img.onload=function(){
						context.drawImage(img,20,20,100,100);
						drawing(num+1);
					}
				}else if(num==1){
					img.onerror=function(){
						h=140;
						drawing(num+1);
					}
					img.onload=function(){
						context.drawImage(img,0,160,mycanvas.width,1000);
						h=440;
						drawing(num+1);
					}
				}else if(num==2){
					img.onload=function(){
						context.drawImage(img,55,h+20,240,240);
						drawing(num+1);
					}
				}
				else if(num==3){
					img.onload=function(){
						context.drawImage(img,345,h+20,240,240);
						// 底部内容
						context.font='bold 28px 宋体';
						context.fillStyle='#C13E2C';
						context.textAlign='center';
						context.fillText('长按指纹 识别图中二维码 推广',mycanvas.width/2,h+300);
						context.font='bold 24px 宋体';
						context.fillStyle='#666';
						context.textAlign='center';
						context.fillText('关注我们 加入有礼品 推广有惊喜',mycanvas.width/2,h+330);
						drawing(num+1);
					}
				}				
			}else{
				imgPath=mycanvas.toDataURL("image/png");
				document.getElementsByTagName('img')[0].src=imgPath;
				document.body.removeChild(mycanvas);
				callback && callback.call(this,imgPath)

			}
		}
		drawing(0);
	}
}