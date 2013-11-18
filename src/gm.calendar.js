/**
 * Calendar
 * Copyright 2013
 * Date 2013.11.4
 */
 
(function($, undefined) {
	
	var calendar = {
		firstDayOfMonth: function(date) {
			return new Date(date.getFullYear(), date.getMonth(), 1);
		},
		view: [{
			name: 'month',
			title: function(date, min, max, culture) {
				return data.getFullYear() + ' ' + data.getMonth;
			},
			content: function(options) {
				return view
			}
		}, {
			name: 'year'
		}]
	};

	function Devil(options) {
		$.extend(this.opts, options);
		this.init();
	}

	Devil.fn = Devil.prototype = {
		options: {
			name: 'zoroCalendar',
			value: null,	//日历默认选中日期
			dates: [],	//（特殊）日子,如：生日、纪念日
			min: new Date(1990, 0, 1),
			max: new Date(2099, 11, 31),
			format: 'yyyy-MM-dd', 
			culture: 'zh',
			animation: {}
		},
		init: function() {
			console.log(5);
			var today = new Date(),
				day = today.getDate(),
				month = today.getMonth(),
				year = today.getFullYear();
			console.log(day + ', ' + month + ', ' + year);
			console.log(calendar.firstDayOfMonth(new Date(2013,10)));
			var fd = new Date(2013, 10, 1).getDay();
			var d = new Date(2013, 11, 0).getDate();
			var od = new Date(2013, 10, 0).getDate();
			console.log(fd, d);
			var arr = [], idx = 0, j = 0, g = 1;
			arr[0] = [];
			var $table = $('<table></table>').appendTo('body');
			var $tr = $('<tr></tr>').appendTo($table);
			var week = ['日', '一', '二', '三', '四', '五', '六'];
			for(var i = 0; i < 7; i++) {
				var $th = $('<th>' + week[i] + '</th>').appendTo($tr);
			}
			$tr = $('<tr></tr>').appendTo($table);
			for(var i = 0; i < 42; i++) {
				var dd = i >= fd ? g++ : od - (fd - i - 1);
				if(g - 1 > d) {
					dd = dd - d;
				}
				if(i > 0 && i%7 == 0) {
					arr[++idx] = [];
					j = 0;
					$tr = $('<tr></tr>').appendTo($table);
				}
				var $td = $('<td>' + dd + '</td>').appendTo($tr);
				arr[idx][j++] = dd;
			}
			console.log(arr);
		}
	}	
	
	$.fn[Devil.fn.options.name] = function(options) {
		this.each(function() {
			var devil = new Devil(options);
			$(this).data(Devil.fn.options.name, devil);
		});
		return this;
	};
	
})(jQuery);