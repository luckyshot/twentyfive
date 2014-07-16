/*jshint browser: true, devel: true, camelcase: true, curly: true, eqeqeq: true, undef: true, unused: true, strict: true */
/*global $:false */

$(document).ready(function() {

		'use strict';

	;( function ( win, doc, lS )
	{



		var MIN_TO_WORK = 30,
			APP_TITLE = 'Time Tracker',

			myAudio = new Audio("alert.mp3"),
			worked = 0,
			minToWork,
			nextCycle,
			startTime,
			startHour,
			startMin,
			cycle,
			count = 0;


		if (lS.cycle)
		{
			cycle = lS.cycle;
			minToWork = cycle;
		}
		else
		{
			minToWork = MIN_TO_WORK;
			cycle = minToWork;
			nextCycle = cycle;
		}


		var init = function()
		{
			updateTitle(APP_TITLE);
		};


		var openAlert = function()
		{
			myAudio.play();
			$("body").removeClass("working").addClass("log");
			$("#new").prop("checked", true);
			$("#what").focus();
		};


		var logTime = function()
		{
			$("body").removeClass("working").addClass("log");
			$("#new").prop("checked", true);
			$("#what").focus();
		};


		var cancelTimer = function(where)
		{
			$("body").removeClass("working").addClass(where);
		};


		var updateTitle = function(title)
		{
			if (!!title[5])
			{
				doc.title = title[5]+":"+title[6]+" - "+APP_TITLE;
			}
			else if (!!title)
			{
				doc.title = title;
			}
			else
			{
				doc.title = APP_TITLE;
			}
		};


		$("#timer span").countdown({
			until: 0,
			format: "MS",
			compact: true,
			onExpiry: openAlert,
			onTick: updateTitle,
		});

		// Get stuff from lS
		if (typeof (Storage) !== undefined)
		{
			var i = 0;
			while (i < lS.length)
			{
				if (lS.key(i) === "htt_count" || lS.key(i).indexOf("htt_task") === -1) { continue; }
				$("#done").prepend( lS.getItem( lS.key(i) ) );
			}
			// check if the user is new
			if (lS.count)
			{
				$(".count").text(lS.count);
				count = lS.count;
				$("body").addClass("list");
			}
			else
			{
				$("body").addClass("new");
			}
		}

		// set the cycle length
		$(".set-cycle").on("click", function()
		{
			$("body").addClass("settings-open");
			$("#cycle").val(lS.cycle);
			return false;
		});


		// set the next cycle length
		$(".set-next").on("click", function()
		{
			$("body").addClass("settings-open");
			$("#nextCycle").val(lS.nextCycle);
			return false;
		});


		// only allow numbers to be input into the fields
		$("#cycle").on("input", function()
		{
			this.value = this.value.replace(/[^0-9]/g, "");
			cycle = $(this).val();
		});


		$("#nextCycle").on("input", function()
		{
			this.value = this.value.replace(/[^0-9]/g, "");
			nextCycle = $(this).val();
		});


		// do magic when the cycle length form is submitted
		$("#cycle-form").submit(function()
		{
			if($("#cycle").val() === "")
			{
				$("#cycle").val(MIN_TO_WORK);
				lS.setItem("htt_cycle", MIN_TO_WORK);
				lS.setItem("htt_nextCycle", MIN_TO_WORK);
			}
			else
			{
				lS.setItem("htt_cycle", cycle);
				lS.setItem("htt_nextCycle", cycle);
			}
			minToWork = lS.cycle;
			$("body").removeClass("settings-open");
			return false;
		});


		// magic when the next cycle length form is submitted
		$("#next-form").submit(function()
		{
			lS.setItem("htt_nextCycle", nextCycle);
			nextCycle = lS.nextCycle;
			$("body").removeClass("settings-open");
			return false;
		});


		// close dropdown when clicked anywhere but inside
		$("#settings .overlay").on("click", function()
		{
			$("body").removeClass("settings-open");
			$("#cycle").val(lS.cycle);
			$("#nextCycle").val(lS.nextCycle);
		});

		// start the timer
		$(".btn-start").on("click", function()
		{
			startTime = new Date();
			startHour = ("0" + startTime.getHours()).slice(-2);
			startMin = ("0" + startTime.getMinutes()).slice(-2);
			$("body").removeClass().addClass("working");
			$("#timer span").countdown("option", {
				until: +cycle*60,
				onExpiry: openAlert
			});
			$("#actions span").hide();
			$("#reset").show();
			return false;
		});

		// user decides he's done
		$("#end").on("click", function()
		{
			worked = $("#timer span").countdown("getTimes");
			$("#timer span").countdown("option", {until: 0, onExpiry: logTime});
			updateTitle(APP_TITLE);
			return false;
		});

		// check that there are previous tasks already done
		$("#cancel").on("click", function()
		{
			if (lS.count)
			{
				$("#timer span").countdown("option", {until: 0, onExpiry: null});
				cancelTimer("list");
			}
			else
			{
				$("#timer span").countdown("option", {until: 0, onExpiry: null});
				cancelTimer("new");
			}
			return false;
		});

		// do some magic when form is submitted
		$("#logActivity").submit(function()
		{
			var task = $("#what").val(),
				d = new Date(),
				hour = ("0" + d.getHours()).slice(-2),
				min = ("0" + d.getMinutes()).slice(-2),
				timeWorked;

			count++;
			lS.count = count;

			myAudio.currentTime = 0;
			myAudio.pause();
			if (typeof worked[5] !== "number")
			{
				timeWorked = 0;
			}
			else
			{
				timeWorked = worked[5];
			}

			var text = '<li data-task="' + 'htt_task' + ('0' + count).slice(-2) + '">' +
					'<h6>' + startHour + ':' + startMin + ' - ' + hour + ':' + min + '</h6>' +
					'<p>' + task + '<small>' + (cycle - timeWorked) + ' minutes</small></p>' +
				'</li>';
			// if these differ, get them to be the same
			if (nextCycle !== cycle)
			{
				cycle = lS.nextCycle;
				lS.setItem("htt_cycle", lS.nextCycle);
			}

			// add lS keys
			lS.setItem("htt_task" + ("0" + count).slice(-2), text);

			// add new task to the top of the list
			$("#done").prepend(text);

			if ($("#new").is(":checked"))
			{
				$("#timer span").countdown("option", {until: +cycle*60});
				$("body").removeClass("log").addClass("working");
			}
			else
			{
				$("body").removeClass("log").addClass("list");
			}

			startTime = new Date();
			startHour = ("0" + startTime.getHours()).slice(-2);
			startMin = ("0" + startTime.getMinutes()).slice(-2);

			return false;
		});

		// TODO: .delete to be CSS based
		$("#done").on("mouseenter", "li[data-task]", function()
		{
			$(this).find("p").prepend("<span class='delete'>&times;</span>");
			$(this).find(".delete").on("click", function() {
				var deleteThis = $(this).parent().parent().attr("data-task");
				$(this).parent().parent().remove();
				lS.removeItem(deleteThis);
			});
		});


		$("#done").on("mouseleave", "li", function()
		{
			$(this).find("span.delete").remove();
		});


		//ask user to confirm clearage
		$("#reset").on("click", function()
		{
			$(this).hide();
			$(this).siblings("span").show();
			return false;
		});


		// Get rid of tasks and count on lS
		var clearAllCycles = function()
		{
			var i = 0;
			while (i < lS.length)
			{
				if (lS.key(i) === "htt_nextCycle" || lS.key(i) === "htt_cycle") { continue; }
				lS.removeItem( lS.key(i) );
			}
			count = 0;
			$("#done").html("");
			$("body").removeClass().addClass("new");
			$(".count").text(count);
			$(this).parent().hide();
			$(this).parent().siblings("#reset").show();
			return false;
		};
		$("#actions .confirm").on("click", clearAllCycles());


		// Cancel clearage of lS
		var cancelCycle = function()
		{
			$(this).parent().hide();
			$(this).parent().siblings("#reset").show();
			return false;
		};
		$("#actions .cancel").on("click", cancelCycle());

		// Loop alert if browser tab is not active
		$(win).blur(function(){
			myAudio.addEventListener("ended", function()
			{
				this.currentTime = 0;
				this.play();
				(doc.title === APP_TITLE) ? updateTitle('▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉') : updateTitle(APP_TITLE);
			}, false);
		});


		//stop alert when browser tab is active
		$(win).focus(function(){
			myAudio.addEventListener("ended", function()
			{
				this.currentTime = 0;
				this.pause();
				updateTitle(APP_TITLE);
			}, false);
			myAudio.pause();
			myAudio.currentTime = 0;
		});


		init();


	} ( window, document, localStorage ) );

}); // doc.ready
