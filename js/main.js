$(document).ready(function() {

	$("button").button();

	function initPage(immediate) {
		if (immediate) {
			$(".question").hide();
			$(".result").hide();
			$("#question1").show();
			$(".page-container").css("backgroundColor", getRandomHexColor());
		} else {
			$(".question:visible, .result:visible").hide("drop", {direction: "down"}, "slow", function() {
				$("#question1").show("drop", {direction: "down"}, "slow");
			});
			$(".page-container").animate({backgroundColor: getRandomHexColor()}, "slow");
		}
	}
	initPage(true);

	$(".answer").click(function(e) {
		e.preventDefault();
		var questionEl = $(this).parents(".question");
		var nextId = "#" + questionEl.attr("data-next-id");
		$(this).parents(".question").hide("drop", {direction: "down"}, function() {
			$(".page-container").animate({backgroundColor: getRandomHexColor()}, "slow");
			$(nextId).show("drop", {direction: "down"}, "slow");
		});
	});

	$(".reset").click(function(e) {
		e.preventDefault();
		initPage(false);
	});

	function getRandomHexColor() {
		return "#" + (0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
	}

});

