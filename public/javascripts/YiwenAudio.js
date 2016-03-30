requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.oRequestAnimationFrame
    || function(callback) {
    setTimeout(callback, 1000 / 60);
};

var isPause;
var isEnterCtrl, isEnterHover; // 鼠标是否停留在controller上面
var angle = 0;
var lRadius = 53;
var rRadius = 105;
var upClick  = 0;
var downClick  = 0;
var numSong = 12;
var downSong,upSong;
var isShowCtrl= true;

$(window).load(function(){ 
    // initiate playlist
    CreateList();
    console.log("songnum: "+numSong);
    // initiate the nowplay menu
    CreateNowPlay();
    $(".NowPlay .Cover").attr("src","/images/icons/wheel.png");
    $(".NowPlay .Title").text("DAM - HW02");
    $(".NowPlay .Author").text("- Yiwen Dai -");
    // Init Scroll Control in playlist
    ScrollIt();
    // set the NowPlay Menue visible
    $(".NowPlaying").css("color", "#55ABA9");
    $('.List').hide();
    $('.SrcUp').hide();
    $('.SrcDown').hide();

    // get canvas
    var canvas = document.getElementById("myCanvas");
    canvas.width = 560;
    canvas.height = 360;
    var context = canvas.getContext("2d");
    DrawWheel(context,lRadius, rRadius);
    // wheels for the cassette
    var lw = document.getElementById("lw");
    var rw = document.getElementById("rw");
    lw.src = rw.src = "/images/icons/wheel.png";

    // rendering animation for the wheel
    (function render(){

        angle += RotateWheel();
        $("#lw").rotate(angle * 0.02);
        $("#rw").rotate(angle * 0.02);
        $("#NowPlay .Cover").rotate(angle * 0.024);

        context.clearRect(0,0,560,360);  
        DrawWheel(context,lRadius,rRadius);

        //render controller 
        if(isShowCtrl || isPause)
        {
             ShowHoverCtl();

        }else
        {
            HideHoverCtl();

        }

        //
        SetVisibility();
        
        requestAnimationFrame(render);
    })();


});

$(document).ready(function () {
    // get audio 
    var audio = document.getElementById("myMusic"); 
    isPause = true;

    // Hover control animation
    $("#HoverController").hover(function(){      
        isShowCtrl = true;     
    },function(){
        isShowCtrl = false;      
        if(!isPause)
        {
            isShowCtrl = false;
        }      
    });


    //Stop&Pause
    $("#MainControl")._toggle(function () {
        // toggling the start/pause icon --> show pause
        $(this).removeClass("MainControl").addClass("StopControl");
        if (audio.src == "") {
            // get the first song
            var index = $(".Single .SongName").eq(0).attr("KV");
            GetSongInfo(index);
            // change color of the selected song in the playlist
            $(".Single .SongName").eq(0).css("color", "#55ABA9");
            audio.src = "/music/" + index + ".mp3";
            // // test: output song name
            // console.log("Src" + audio.src);
        }
        audio.play();
        isPause = false;
        // calculating time
        TimeSpan();
    }, function () {
        // toggling the start/pause icon --> show start
        $(this).removeClass("StopControl").addClass("MainControl");
        audio.pause();
        isPause = true;
    });


    // Choose from song list
    $(".MusicList .List .Single .SongName").live("click",function () {
        $(".MusicList .List .Single .SongName").css("color", "#333");
        $("#MainControl").removeClass("MainControl").addClass("StopControl");
        $(this).css("color", "#55ABA9");
        var index = $(this).attr("KV");
        GetSongInfo(index);
        audio.src = "/music/" + index + ".mp3";
        audio.play();
        isPause = false;
        TimeSpan();
    });

    //Previous Song
    $(".Previous").click(function () {
        $(".MusicList .List .Single .SongName").each(function () {
            if ($(this).css("color") == "rgb(85, 171, 169)") {
                // check if it is the first song
                var IsTop = $(this).parent(".Single").prev(".Single").length == 0 ? true : false;  
                var index;
                // if the first song 
                // play the last song
                // else play the next song
                if (IsTop) {
                    index = $(".Single").last().children(".SongName").attr("KV");
                    $(".Single").last().children(".SongName").css("color", "#55ABA9");
                }
                else {
                    index = $(this).parent(".Single").prev(".Single").children(".SongName").attr("KV");
                    $(this).parent(".Single").prev(".Single").children(".SongName").css("color", "#55ABA9");
                }
                // set the src address of the audio
                audio.src = "/music/" + index + ".mp3";
                // get the song info of the previous song
                GetSongInfo(index);
                $(this).css("color", "#333");
                audio.play();
                isPause = false;
                HideHoverCtl();
                return false; //break
            }
        })
    });

    //右前进按钮
    $(".Next").click(function () {
        $(".MusicList .List .Single .SongName").each(function () {
            if ($(this).css("color") == "rgb(85, 171, 169)") {
                var IsBottom = $(this).parent(".Single").next(".Single").length == 0 ? true : false;  //检查是否是最尾端的歌曲
                var index;
                if (IsBottom) {
                    index = $(".Single").first().children(".SongName").attr("KV");
                    $(".Single").first().children(".SongName").css("color", "#55ABA9");
                }
                else {
                    index = $(this).parent(".Single").next(".Single").children(".SongName").attr("KV");
                    $(this).parent(".Single").next(".Single").children(".SongName").css("color", "#55ABA9");
                }

                audio.src = "/music/" + index + ".mp3";
                GetSongInfo(index);
                $(this).css("color", "#333");
                audio.play();
                isPause = false;
                HideHoverCtl();
                return false; //代表break
            }
        })
    });

    //静音按钮
    $(".VoiceEmp").click(function () {
        $(".VoidProcessYet").css("width", "0");
        audio.volume = 0;
    });

    //满音量按钮
    $(".VoiceFull").click(function () {
        $(".VoidProcessYet").css("width", "66px");
        audio.volume = 1;
    });


    // 音频进度条事件（进度增加）
    $(".Process").click(function (e) {

        //播放进度条的基准参数
        var Process = $(".Process").offset();
        var ProcessStart = Process.left;
        var ProcessLength = $(".Process").width();


        var CurrentProces = e.clientX - ProcessStart;
        DurationProcessRange(CurrentProces / ProcessLength);
        $(".ProcessYet").css("width", CurrentProces);
    });

    //音频进度条事件（进度减少）
    $(".ProcessYet").click(function (e) {

        //播放进度条的基准参数
        var Process = $(".Process").offset();
        var ProcessStart = Process.left;
        var ProcessLength = $(".Process").width();

        var CurrentProces = e.clientX - ProcessStart;
        DurationProcessRange(CurrentProces / ProcessLength);
        $(".ProcessYet").css("width", CurrentProces);
    });

    //音量进度条事件（进度增加）
    $(".VoidProcess").click(function (e) {
        //音量进度条的基准参数
        var VoidProcess = $(".VoidProcess").offset();
        var VoidProcessStart = VoidProcess.left;
        var VoidProcessLength = $(".VoidProcess").width();

        var CurrentProces = e.clientX - VoidProcessStart;
        VolumeProcessRange(CurrentProces / VoidProcessLength);
        $(".VoidProcessYet").css("width", CurrentProces);
    });

    //音量进度条时间（进度减少）
    $(".VoidProcessYet").click(function (e) {
        //音量进度条的基准参数
        var VoidProcess = $(".VoidProcess").offset();
        var VoidProcessStart = VoidProcess.left;
        var VoidProcessLength = $(".VoidProcess").width();

        var CurrentProces = e.clientX - VoidProcessStart;
        VolumeProcessRange(CurrentProces / VoidProcessLength);
        $(".VoidProcessYet").css("width", CurrentProces);
    });



    //监听媒体文件结束的事件（ended），这边一首歌曲结束就读取下一首歌曲，实现播放上的循环播放
    audio.addEventListener('ended', function () {
        $(".MusicList .List .Single .SongName").each(function () {
            if ($(this).css("color") == "rgb(85, 171, 169)") {
                var IsBottom = $(this).parent(".Single").next(".Single").length == 0 ? true : false;  //检查是否是最尾端的歌曲
                var NextSong;
                if (IsBottom) {
                    NextSong = $(".Single").first().children(".SongName").attr("KV");
                    $(".Single").first().children(".SongName").css("color", "#55ABA9");
                }
                else {
                    NextSong = $(this).parent(".Single").next(".Single").children(".SongName").attr("KV");
                    $(this).parent(".Single").next(".Single").children(".SongName").css("color", "#55ABA9");
                }

                audio.src = "/music/" + NextSong + ".mp3";
                //$(".MusicBox .ProcessControl .SongName").text(NextSong);
                GetSongInfo(NextSong);
                $(this).css("color", "#333");
                audio.play();
                isPause = false;
                return false; //代表break
            }
        });
    }, false);
//-------------------------------------------------------//
//*************      选择列表与单曲      ******************//
//-------------------------------------------------------//

    //var isListShow = true;
        // $(".NowPlaying").hover(function(){
           
        //     $(".NowPlaying").css("color", "#FFAB84");

        // },function(){
        //     $(".NowPlaying").css("color", "black");
        // });
     
        // $(".MixTape").hover(function(){
           
        //     $(".MixTape").css("color", "#FFAB84");

        // },function(){
        //     $(".MixTape").css("color", "black");
        // });
  

        $(".NowPlaying").click(function(){
            //$(".MusicList").css({"left":"10000px"});
            //$(this).css({});
            $(".List").hide();
            $(".SrcUp").hide();
            $(".SrcDown").hide();
            $(".NowPlay").show();
            $(".NowPlaying").css("color", "#55ABA9");
            $(".MixTape").css("color","black");

            //$(".NowPlay").scrollTop(100);
            //$(".MusicList").addClass(".List").addClass(".Single");
            //$(".MusicList").hide();


        });

        $(".MixTape").click(function(){
            $(".NowPlay").hide();
            $(".List").show();
            $(".SrcUp").show();
            $(".SrcDown").show();
            //$(".MusicList").show();
            //$(this).css({});
            $(".MixTape").css("color","#55ABA9");
            $(".NowPlaying").css("color", "black");
        });


    



});

//音量进度条的转变事件
function VolumeProcessRange(rangeVal) {
    var audio = document.getElementById("myMusic");
    audio.volume = parseFloat(rangeVal);
}

//播放进度条的转变事件
function DurationProcessRange(rangeVal) {
    var audio = document.getElementById("myMusic");
    audio.currentTime = rangeVal * audio.duration;
    audio.play();
}

//播放事件
function Play(obj) {
    var SongUrl = obj.getAttribute("SongUrl");
    var audio = document.getElementById("myMusic");
    audio.src = "/music/" + SongUrl + ".mp3";
    audio.play();
    TimeSpan();
    isPause == false
}

//暂停事件
function Pause() {
    var audio = document.getElementById("myMusic");
    $("#PauseTime").val(audio.currentTime);
    audio.pause();
    isPause = true;
}

//继续播放事件
function Continue() {
    var audio = document.getElementById("myMusic");
    audio.startTime = $("PauseTime").val();
    audio.play();
}

//时间进度处理程序
function TimeSpan() {
    var audio = document.getElementById("myMusic");
    var ProcessYet = 0;
    setInterval(function () {
        var ProcessYet = (audio.currentTime / audio.duration) * 500;
        $(".ProcessYet").css("width", ProcessYet);
        var currentTime = timeDispose(audio.currentTime);
        var timeAll = timeDispose(TimeAll());
        $(".SongTime").html(currentTime + "&nbsp;|&nbsp;" + timeAll);
    }, 1000);
}

//时间处理，因为时间是以为单位算的，所以这边执行格式处理一下
function timeDispose(number) {
    var minute = parseInt(number / 60);
    var second = parseInt(number % 60);
    minute = minute >= 10 ? minute : "0" + minute;
    second = second >= 10 ? second : "0" + second;
    return minute + ":" + second;
}

//当前歌曲的总时间
function TimeAll() {
    var audio = document.getElementById("myMusic");
    return audio.duration;
}


// 绘制当前的磁带圈
function DrawWheel(cxt,lRadius,rRadius) {

    var length, ratio;


    length = Math.PI * 2 * (105 - 53);
    var audio = document.getElementById("myMusic");

    var curTime = audio.currentTime;
    var totalTime = TimeAll();

 
    // normal state
    if(totalTime == undefined  || totalTime == curTime)
    { 
       console.log ("test");
       lRadius = 53;
       rRadius = 105;

    }else{

        ratio = curTime/totalTime;
        //console.log ("Ratio: " + ratio );
        lRadius = 53 + ratio * length / (2*Math.PI);
        rRadius = 53 + (1-ratio) * length / (2*Math.PI);

    }


    cxt.fillStyle="#FFAB84";
    cxt.beginPath();
    cxt.arc(186,156,lRadius,0,Math.PI*2,true);
    cxt.closePath();
    cxt.fill();

    cxt.fillStyle="#FCE23D";
    cxt.beginPath();
    cxt.arc(186,156,45,0,Math.PI*2,true);
    cxt.closePath();
    cxt.fill();

    cxt.fillStyle="#FFAB84";
    cxt.beginPath();
    cxt.arc(374,156,rRadius,0,Math.PI*2,true);
    cxt.closePath();
    cxt.fill();

    cxt.fillStyle="#FCE23D";
    cxt.beginPath();
    cxt.arc(374,156,45,0,Math.PI*2,true);
    cxt.closePath();
    cxt.fill();

}

function RotateWheel(angle)
{
    var audio = document.getElementById("myMusic");
    var curTime = audio.currentTime;
    var totalTime = TimeAll();
    var res;

    if(!isPause && totalTime != undefined && totalTime != curTime)
    {
        res = 90;
    }else 
    {
        res = 0;
    }
    return res;

}

// 显示所有controller
function ShowHoverCtl()
{
    $(".HoverController").fadeIn(500);
    $(".StopControl").fadeIn(500);
    // $(".MainControl").fadeIn(500);
    $(".Previous").fadeIn(500);
    $(".Next").fadeIn(500);
    $(".HB").fadeIn(500);
    // $(".HoverControl").css({"opacity":"0.6"});
    

}

// 
function HideHoverCtl()
{
    //$(".HoverController").fadeOut(500);
    //$(".HoverController").hide();

    $(".StopControl").fadeOut(500);
    $(".Previous").fadeOut(500);
    $(".Next").fadeOut(500);
    $(".HB").fadeOut(500);
    // $(".HoverControl").css({"opacity":"0.0"});
   
}


// 获取歌曲的基本信息
function GetSongInfo(index)
{
    
    //var nAuthor = "";
    var idx = index;
    $(".NowPlay .Cover").attr("src","/music/" + index + ".png");
    //$(".NowPlay .CoverBck").css("background","/images/icons/cover-bck.png");

    $.getJSON("/javascripts/SongLib.json", null, function(data){
         var nTitle = "";
         var nAuthor = "";
         for (var c in data) {
            console.log("index: " + data[c].index);
                if(data[c].index == idx)
                {

                    nTitle = data[c].title;
                    nAuthor = data[c].author;
                    
                    break;
                   
                }               
            }

            // uodate song info
            $(".MusicBox .ProcessControl .SongName").text(nTitle);
            $(".NowPlay .Cover").attr("src","/music/" + index + ".png");
            $(".NowPlay .Title").text(nTitle);
            $(".NowPlay .Author").text("- " + nAuthor + " -");

            // for lyrics
            var url = "/music/" + index + ".txt";
            clearArr();
            // parse the url of lyrics 
            parseLrc(url);

    });

}



// 增加一个Single行
function AddSingle(count, list, index, title)
{
     
    var html = "<img class='ImageName' KV = "
                        + "'" + index + "'" + "src = " + "'/music/" + index + ".png'" + "\>"
                        + "<span class='SongName'  KV=" 
                        + "'" + index + "'" +  " >" + count + ". "+ title + " </span> ";
   var single = document.createElement("div");
    single.setAttribute("class","Single");
    single.innerHTML = html;
    $(".Single").css("z-index","30");
    list.appendChild(single);

}


function CreateList()
{
    var ML = document.getElementById('MusicList');
    // create dynamimc <div> tag for each song
    ML.innerHTML = "<div id = 'List' class = 'List'></div>";
    var list = document.getElementById('List');

    // read the JSON file
    $.getJSON("/javascripts/SongLib.json", null, function(data){
        var count = 0;
        for(var c in data)
        {
            count ++;
            var title = data[c].title;
            var index = data[c].index;
            AddSingle(count, list, index, title);

        }      
    });
}


// 创建NowPlay的DOM元素
function CreateNowPlay()
{
   
    var NP = document.getElementById('NowPlay');
    var html = "<div class = 'CoverBck'></div>" +
             "<img class = 'Cover'>"+  
            "<div class = 'Title'></div>" +
            "<div class = 'Author'></div>" +
            "<div class = 'Lyric' id = 'Lyric'>" +
            "<div class = 'line1' id = 'topLine'>line1</div>" +
            "<div class = 'line2'               >line2</div>" +
            "<div class = 'line3'               >line3</div>" +
            "<div class = 'line4'>line4</div>" +
            "<div class = 'line5'                >line5</div>" +
            "<div class = 'line6'                >line6</div>" +
            "<div class = 'line7' id = 'bottomLine'>line7</div>" +
            "</div>";

    NP.innerHTML = html;



}

function ScrollIt()
{
    var offset = 0;
    downSong = numSong - 7;
    upSong = 0;
    var mov = document.getElementById("List");
    $(".SrcUp").click(function(){
      
        console.log("move down"); 

        if(upSong > 0)
        {
            
            offset += 60 ;
            $(".List").animate({top: offset + "px"}); 
            downSong ++;
            upSong --;
        }    
        
    });

    $(".SrcDown").click(function(){
        
         console.log("move up");
        if(downSong > 0)
        {
            offset -= 60 ;
            $(".List").animate({top: offset + "px"}); 
            downSong --;
            upSong ++
        } 

        
    });

}

function SetVisibility()
{
    if(upSong == 0){
        $(".SrcUp").css("opacity","0.5");
            //console.log("none");
    }else{
        $(".SrcUp").css("opacity","0.9");
    }

    if(downSong == 0){
        $(".SrcDown").css({"opacity":"0.5"});
    }else{
        $(".SrcDown").css({"opacity":"0.9"});

    }
}










