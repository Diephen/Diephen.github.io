// 根据时间轴显示歌词。。。
// reference: http://wenku.baidu.com/view/9c11d046b307e87101f69631.html
// modified by YiwenDai 2014.10.29
var lyrics;
var index = 0;
var textArr = new Array();
var timeArr = new Array();


function conSeconds(t)
{
	var m=t.substring(0,t.indexOf(":"));
	var s=t.substring(t.indexOf(":")+1);
	var ms = t.substring(t.indexOf(".")+1);

	s=parseInt(s.replace(/\b(0+)/gi,""));

	if(isNaN(s))
		s=0;

	var totalt=parseInt(m)*60+ s + ms/100;
	//alert(parseInt(s.replace(/\b(0+)/gi,"")));
	if(isNaN(totalt))
		return 0;

	return totalt;
}

function str2Arr(str)
{
	
	textArr[index]=str.substring(str.lastIndexOf("]")+1);//放歌词  
	//console.log("text: " + textArr[index]);
	timeArr[index]=conSeconds(str.substring(1,9));//放时间
	//console.log("time: " + timeArr[index]);
	index ++;

	//console.log("index: " + index);	



}

function sortArr()
{
	var temp=null;
	var temp1=null;
	for(var k=0;k<timeArr.length;k++)
	{
		for(var j=0;j<timeArr.length-k;j++)
		{
			if(timeArr[j]>timeArr[j+1])
			{
				temp=timeArr[j];
				temp1=textArr[j];
				timeArr[j]=timeArr[j+1];
				textArr[j]=textArr[j+1];
				timeArr[j+1]=temp;
				textArr[j+1]=temp1;
			}
		}
	}

	for (var i = 0; i < textArr.length; i++)
	{
		console.log(i + ": " + textArr[i]);
	}

	// for (var i = 0; i < timeArr.length; i++)
	// {
	// 	console.log(i + ": " + timeArr[i]);
	// }



}

function getLrc(_url)
{
	var lyr;
	$.ajax({
			async: false,
            url: _url,
            dataType: 'text',
            success: function(data) {
            	lyr = data;
            	//console.log(lyr);
            	lyrics = lyr;
            },
            
        });

	//console.log("test: " + lyrics);

}

function show(t)
{
	var div1 = document.getElementById("Lyric");
	//console.log("time: ", t);

	// 前三行
	if(t <= timeArr[4] )
	{
		$(".Lyric .line1").text(textArr[0]);
		$(".Lyric .line2").text(textArr[1]);
		$(".Lyric .line3").text(textArr[2]);
		$(".Lyric .line4").text(textArr[3]);
		$(".Lyric .line5").text(textArr[4]);
		$(".Lyric .line6").text(textArr[5]);
		$(".Lyric .line7").text(textArr[6]);

		if(t > timeArr[0] && t < timeArr[1])	{$(".Lyric .line1").css("color", "red");}
		if(t > timeArr[1] && t < timeArr[2])	{$(".Lyric .line1").css("color", "black");$(".Lyric .line2").css("color", "red");}
		if(t > timeArr[2] && t < timeArr[3])	{$(".Lyric .line2").css("color", "black");$(".Lyric .line3").css("color", "red");}
		if(t > timeArr[3] && t < timeArr[4])	{$(".Lyric .line3").css("color", "black");$(".Lyric .line4").css("color", "red");}	
		//if(t >= timeArr[4] && t < timeArr[5])	$(".Lyric .line4").css("color", "red");
	}
	else if(t < timeArr[timeArr.length - 3])
	{
		var k;
		var now;

		for(k = 1; k <= timeArr.length; k ++)
		{
			if(timeArr[k]<= t && t<timeArr[k+1]) 
			{
				now = k;
				console.log("now :" + now);
				break;
			}

		}

		$(".Lyric .line1").text(textArr[now-3]);
		$(".Lyric .line2").text(textArr[now-2]);
		$(".Lyric .line3").text(textArr[now-1]);
		$(".Lyric .line4").text(textArr[now]);
		$(".Lyric .line5").text(textArr[now+1]);
		$(".Lyric .line6").text(textArr[now+2]);
		$(".Lyric .line7").text(textArr[now+3]);


	}else{
		// 末三行

		var end = timeArr.length-1;
		$(".Lyric .line1").text(textArr[end-6]);
		$(".Lyric .line2").text(textArr[end-5]);
		$(".Lyric .line3").text(textArr[end-4]);
		$(".Lyric .line4").text(textArr[end-3]);
		$(".Lyric .line5").text(textArr[end-2]);
		$(".Lyric .line6").text(textArr[end-1]);
		$(".Lyric .line7").text(textArr[end]);

		if(t > timeArr[end-2] && t < timeArr[end-1]) {$(".Lyric .line4").css("color", "black");$(".Lyric .line5").css("color", "red");}
		if(t > timeArr[end-1] && t < timeArr[end]) {$(".Lyric .line5").css("color", "black");$(".Lyric .line6").css("color", "red");}
		if(t > timeArr[end]) {$(".Lyric .line6").css("color", "black");$(".Lyric .line7").css("color", "red");}

	}





	// if(t < timeArr[timeArr.length-1])  // not the end 
	// {
	// 	for(var k=0; k<textArr.length ; k++)
	// 	{
	// 		if(timeArr[k]<= t && t<timeArr[k+1])
	// 		{
	// 			//scrollh=k*25;//让当前的滚动条的顶部改变一行的高度
	// 			div1.innerHTML += "<font color=red style=font-weight:bold>"+textArr[k]+"</font><br>";
	// 		}
	// 		else if( t < timeArr[timeArr.length-1])//数组的最后一个要舍弃
	// 			div1.innerHTML+=textArr[k]+"<br>";
	// 		}

	// 	}

	// else//加上数组的最后一个
	// {
	// 	for(var j=0;j<textArr.length-1;j++)
	// 	{
	// 		div1.innerHTML+=textArr[j]+"<br>";
	// 	}	
	// 	div1.innerHTML+="<font color=red style=font-weight:bold>"+textArr[textArr.length-1]+"</font><br>";
	// }
}

function getRoll()
{
	var audio =document.getElementById("myMusic");
	var t = audio.currentTime.toFixed(2);
	
	if(isNaN(t))
		show(0);
	else
		show(t);

	window.setTimeout("getRoll()",100);
	
}

function clearArr()
{
	lyrics = "";
	index = 0;
	// for (var i = 0; i < textArr.length; i++)
	// {
	// 	textArr[i] = "";
	// }

	// for (var i = 0; i < timeArr.length; i++)
	// {
	// 	timeArr[i] = "";
	// }

	textArr.length = 0;
	timeArr.length = 0;

	$(".Lyric .line1").css("color", "black");
	$(".Lyric .line2").css("color", "black");
	$(".Lyric .line3").css("color", "black");
	$(".Lyric .line4").css("color", "black");
	$(".Lyric .line5").css("color", "black");
	$(".Lyric .line6").css("color", "black");
	$(".Lyric .line7").css("color", "black");

	$(".Lyric .line1").text("");
	$(".Lyric .line2").text("");
	$(".Lyric .line3").text("");
	$(".Lyric .line4").text("");
	$(".Lyric .line5").text("");
	$(".Lyric .line6").text("");
	$(".Lyric .line7").text("");


}


function parseLrc(_url)
{

	//clearArr();

	getLrc(_url);
	console.log(lyrics);

   	// 根据回车split数组
	var tempArr = lyrics.split("\r\n");

	for(var i=0;i<tempArr.length ;i++){
		//console.log(tempArr[i]);
		str2Arr(tempArr[i]);

	}

	sortArr();

	getRoll();
	
	

}