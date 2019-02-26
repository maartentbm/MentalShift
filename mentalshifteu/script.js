$(function () {

	var ignoreHashChange = false;
	var visitedPages = {};

	var setPage = function (event, pageId, dontScroll) {
		var pageId = pageId || $(event.target).closest('.set-page').data('pageId') || 'invalid',
			headerBtm = $("header").height(),
			currentPos = Math.max($('html').scrollTop(), $('body').scrollTop());

		$('.active').removeClass('active');
		$('[data-page-id=' + pageId + ']').addClass('active');
		ignoreHashChange = true;
		window.location.hash = '#' + pageId;
		setTimeout(function () {
			ignoreHashChange = false;
		}, 200);
		if (!visitedPages[pageId]) {
			$('.page.active [data-src]').each(function (index, el) {
				$(el).attr('src', $(el).data('src') || "");
			});
			visitedPages[pageId] = true;
		}
		if (!dontScroll && currentPos > headerBtm) {
			$("html, body").animate({ scrollTop: headerBtm }, "slow");
		}
	};

	var setPageFromHash = function () {
		if (!ignoreHashChange) {
			var hash = window.location.hash.replace("#", "") || "home";
			if (!hash || !$('.page[data-page-id=' + hash + ']').length) {
				hash = "home";
			}
			setPage(null, hash, true);
		}
	}

	// Check the initial position of the Sticky Header
	var stickyHeaderTop = $('#menu').offset().top;

	var setStickyMenu = function () {
		if ($(window).scrollTop() > stickyHeaderTop) {
			$('#menu').css({ position: 'fixed', top: '0px' });
			$('#menu-alias').css('display', 'block');
			$('#menu-alias').css('height', $('#menu').height());
		} else {
			$('#menu').css({ position: 'static', top: '0px' });
			$('#menu-alias').css('display', 'none');
		}
	}

	var splitAndSortEvents = function () {
		var today = new Date(),
			$divPrev = $('#previous-shows'),
			$divFut = $('#future-shows');

		today.setHours(0, 0, 0, 0);

		$('#shows-content div.show').each(function (i, el) {
			var $el = $(el),
				past = new Date($el.data('date')) < today;
			$el.detach().appendTo(past ? $divPrev : $divFut);
		});

		var compareDatesFut = function (a, b) {
			var dateA = new Date($(a).data('date')),
				dateB = new Date($(b).data('date'));

			if (dateA > dateB) {
				return 1;
			} else if (dateA < dateB) {
				return -1;
			} else {
				return 0;
			}
		}

		var compareDatesPrev = function (a, b) {
			return -1 * compareDatesFut(a, b);
		}

		$divPrev.children('div.show').sort(compareDatesPrev).appendTo($divPrev);
		$divFut.children('div.show').sort(compareDatesFut).appendTo($divFut);
	}

	var showPlannedContent = function () {
		var now = new Date();
		$('[data-hide-until]').each(function (i, el) {
			var $el = $(el);
			new Date($el.data('hide-until')) < now && $el.show();
		});
	}

	setPageFromHash();
	setStickyMenu();
	splitAndSortEvents();
	showPlannedContent();

	$('.set-page[data-page-id]').click(setPage);
	$(window).on('hashchange', setPageFromHash);
	$(window).scroll(setStickyMenu);
});
