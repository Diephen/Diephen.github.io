

function submitUserInfo(){

	// 逐一检查数据是否符合规范 
	// check user nick name: if nick name already exist: feed back - change the fucking name please 






	// check name: if already certificated/ valid ... feedback in the certificate part
	// check certif: click button to get to another page





	// check sex: must have one




	// check location: can't be empty





	// check pwd: show of modify 






	// check birth day: can't be empty





	// check phone number: limited access 






}


function closeInfo(){


}








$(window).load(function(){
	// $(".mask").hide();
	$(".infobox").hide();
	// 编辑按钮默认不点开
	var b_edit = false;


	



});

// document ready?


$(document).ready(function ()
{
	$("form").submit(function(e){
    alert("Submitted");
  	});
 


	$(".edit").click(function(){
		console.log("click edit");

		$(".infobox").fadeIn();


	});


	$('.submitBtn').click(function(){
		console.log("click submit");
		$("form").submit();

	});


	$('.cancelBtn').click(function(){
		console.log("click cancel");
		$('.infobox').fadeOut();

	});

	$('.quitBtn').click(function(){
		console.log("click quit");
		$('.infobox').fadeOut();

	});


	$('.info_edit').click(function(){
		console.log("now edit user info");
		b_edit = true;


	});







	
});