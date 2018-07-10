function getViewIMG() {
	$.get("/view/getimg/"+window.location.pathname.split('/')[2], function (data) {
		var rand = JSON.parse(data).lists
			$('#pagination-container').pagination({
			dataSource: rand,
			pageSize: 20,
			className: 'paginationjs-theme-info',
			callback: function (data, pagination) {
				var html = simpleTemplating(data);
				$('#view-container').html(html);
				$('#view-container [data-fancybox]').fancybox({
					buttons: [
						"zoom",
						"share",
						"slideShow",
						"fullScreen",
						"download",
						"thumbs",
						"close"
					],
					youtube: {
						controls: 0,
						showinfo: 0
					},
					afterLoad: function (instance, current) {
						current.width = current.$image[0].naturalWidth;
						current.height = current.$image[0].naturalHeight;
					}
				});
				IMGResponsive()
				var wall = new Freewall("#view-container");
				wall.reset({
					selector: '.item',
					animate: true,
					cellW: $(window).width() <= 768 ? 200 : 220,
					cellH: 'auto',
					onResize: function () {
						wall.fitWidth();
					}
				});
				wall.fitWidth();
				$(window).trigger("resize");
			}
		})
	})
}

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}
function simpleTemplating(data) {

	var html = '';
	$.each(data, function (index, item) {
		html += '<a data-fancybox="fb_'+window.location.pathname.split('/')[2]+'" href="/img/'+ window.location.pathname.split('/')[2] + '/'+ item + '" class="item"><img src="/img/'+ window.location.pathname.split('/')[2] + '/'+ item + '" /></a>';
	});
	html += '';
	return html;
}

function openPreview(e) {
	$('#download').show()
	var um = $(e).find('.item').attr('bg-img')
	$('.preview .box').css({
		"background-position": "top left",
		"background-size": "auto",
		"background-image": "url(" + um + ")"
	})
	$('#download').attr('data-down', um)
}


$(document).ready(function () {
	getViewIMG()
	$('#download').on('click', function () {
		var x = new XMLHttpRequest();
		var u = $(this).attr('data-down')
		x.open("GET", u, true);
		x.responseType = 'blob';
		x.onload = function (e) {
			download(x.response, u, "image/*");
		}
		x.send();
	})
});
