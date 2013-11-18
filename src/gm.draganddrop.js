/**
 * drag and drop
 * Copyright 2013
 * Date 2013.11.11
 */
 
(function($, undefined) {

	var gm = window.gm,
		Widget = gm.ui.Widget,
		abs = Math.abs,
		extend = $.extend,
		isFunction = $.isFunction,
		NS = '.gmDraggable';
		
	var Draggable = Widget.extend({
		init: function(element, options) {
			var that = this;
			
			Widget.fn.init.call(that, element, options);

			options = that.options;
			
			that.isDragging = false;
			that._start();
			that._drag();
			that._end();
		},
		options: {
			name: 'Draggable',
			distance: 5,
			group: 'default',
			cursorOffset: null,
            axis: null,
			container: null
		},
		_start: function() {
			var that = this,
				element = that.element,
				filter = element,
				offsetParent,
				offsetCon,
				con,
				container = that.options.container;
				
			if(that.options.filter) {
				filter = element.find(that.options.filter);
			}
			
			filter.bind('mousedown' + NS, function(e) {
				that.isDragging = true;
				e.preventDefault();
				
				e = extend(e, {currentTarget: element});
				
				if(isFunction(that.options.dragstart)) {
					that.options.dragstart.call(that, e);
				}

				that.startOffset = {x: e.pageX, y: e.pageY};
				
				if(container) {
					offsetParent = element.offsetParent().offset();
					con = $(container);
					offsetCon = con.offset();
					
					that.offsetContainer = {
						minY: offsetParent.top - offsetCon.top + parseInt(con.css('padding-top'), 10),
						minX: offsetParent.left - offsetCon.left + parseInt(con.css('padding-left'), 10)
					};
					
					that.offsetContainer.maxY = that.offsetContainer.minY + con.height() - element.outerHeight(true);
					that.offsetContainer.maxX = that.offsetContainer.minX + con.width() - element.outerWidth(true);

				}
				
				that.offset = {
					top: e.pageY - element.offset().top + parseInt(element.css('margin-top'), 10) + element.offsetParent().offset().top,
					left: e.pageX - element.offset().left + parseInt(element.css('margin-left'), 10) + element.offsetParent().offset().left
				};
				
				if($(document.body).css('position') === 'static' && $(document.body) === element.offsetParent()) {
					var bodyOffset = $(document.body).offset();
					that.offset = {
						top: that.offset.top - bodyOffset.top,
						left: that.offset.left - bodyOffset.left,
					};
				}

			});
		},
		_drag: function() {
			var that = this,
				offset,
				element = that.element,
				offsetCon;
			$(document).bind('mousemove' + NS, function(e) {
				
				e.preventDefault();
				
				if(that.isDragging && (abs(e.pageX - that.startOffset.x) >= 5 || abs(e.pageY - that.startOffset.y) >= 5)) {

					offset = {
						top: e.pageY - that.offset.top,
						left: e.pageX - that.offset.left
					};
					
					offsetCon = that.offsetContainer;
					
					if(offsetCon) {
						offset.top = (offset.top <= offsetCon.minY) ? offsetCon.minY : (offset.top >= offsetCon.maxY) ? offsetCon.maxY : offset.top;
						offset.left = (offset.left <= offsetCon.minX) ? offsetCon.minX : (offset.left >= offsetCon.maxX) ? offsetCon.maxX : offset.left;
					}
					
					if(that.options.axis === 'x') {
						delete offset.top;
					}else if(that.options.axis === 'y') {
						delete offset.left;
					}
					
					e = extend(e, {currentTarget: element, screenX: offset.left, screenY: offset.top, axis: that.options.axis});
					
					if(isFunction(that.options.drag)) {
						that.options.drag.call(that, e);
					}
					
					if(that.options.group !== 'none') {
						element.css(offset);
					}
				}
			});
		},
		_end: function() {
			var that = this;
			$(document).bind('mouseup' + NS, function(e) {
				that.isDragging = false;

				if(isFunction(that.options.dragend)) {
					that.options.dragend.call(that, e);
				}
				//e.preventDefault();
			});
		},
		destroy: function() {
			var that = this,
				element = that.element;
				
			Widget.fn.destroy.call(that);
			
			$(document).unbind(NS);
			element.unbind(NS);
		}
	});
	
	gm.ui.plugin(Draggable);
	
})(jQuery);