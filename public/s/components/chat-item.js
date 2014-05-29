/* jshint browser: true */
/* global $, libsb, lace */

$.fn.setCursorEnd = function() {
	var range, selection;

	if (document.createRange) {
		range = document.createRange();
		range.selectNodeContents(this[0]);
		range.collapse(false);
		selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	} else if (document.selection) {
		range = document.body.createTextRange();
		range.moveToElementText(this[0]);
		range.collapse(false);
		range.select();
	}

	return this;
};

$(function() {
	$(document).on("click", ".long", function() {
		$(this).toggleClass("active").scrollTop(0);
	});

	$(document).on("click", ".chat-item, .thread-item", function() {
		var classes = $("body").attr('class').replace(/conv-\d+/g, '');

		$("body").attr('class', classes);

		$(this).attr("class").split(" ").forEach(function(s) {
			var conv = s.match(/^conv-\d+$/);

			if (conv) {
				$("body").addClass(conv[0]);
			}
		});

		$(".chat-item").not(this).removeClass("current");

		$(this).addClass("current");

		var nick = $(this).children(".chat-nick").text(),
			msg = $(".chat-entry").text().replace(/@\S+[\s+{1}]?$/, "");

		if (msg.indexOf(nick) < 0 && libsb.user.id !== nick) {
			msg = msg + " @" + nick + "&nbsp;";
		}

		$(".chat-entry").html(msg).focus().setCursorEnd();

		$(".chat-entry").on("click", function() {
			$(".chat-item").removeClass("current");
		});
	});

	$(document).on("click", ".chat-more", function() {
		lace.popover.show($(this), $("#chat-menu").html());
	});

	$(document).on("keydown", function(e){
		if ($(".chat-item.current").length > 0) {
			var $chat = $(".chat-item.current"),
				$el;

			if (e.keyCode === 38 && $chat.prev().length > 0) {
				$el = $chat.prev();
			} else if (e.keyCode === 40 && $chat.next().length > 0) {
				$el = $chat.next();
			}

			if ($el && (e.keyCode === 38 || e.keyCode === 40)) {
				$el[0].scrollIntoView(true);
				$el.click().addClass("clicked");

				setTimeout(function() {
					$el.removeClass("clicked");
				}, 500);
			}
		}
	});
});