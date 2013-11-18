/**
 * drag and drop
 * Copyright 2013
 * Date 2013.11.11
 */
 
(function($, undefined) {

	var gm = window.gm,
		ui = gm.ui,
		Widget = ui.Widget,
		proxy = $.proxy,
		trim = $.trim,
		isFunction = $.isFunction,
		HORIZEONTAL = 'horizontal',
		VERTICAL = 'vertical';
		
	var Resizable = Widget.extend({
		init: function(element, options) {
			var that = this;
			
			Widget.fn.init.call(that, element, options);
			
			that._create();
			
		},
		options: {
			name: 'Resizable'
		},
		_create: function() {
			var that = this,
				el = that.element;
			
			that.handles = that.options.handles || 'all';
			that.handles = that.handles === 'all' ? 'n,e,s,w,se,sw,ne,nw' : that.handles;
			that.direction = that.handles.split(',');
			
			that.min = that.options.min || {width: 0, height: 0};
			that.max = that.options.max || {width: 1000000, height: 1000000};
			
			if(el.css('position') === 'static') {
				el.css({'position': 'relative'});
			}
			
			for(var i = 0; i < that.direction.length; i++) {
				var handle = trim(that.direction[i]),
					hname = 'g-resize-handle g-resize-' + handle,
					oneHandle = $('<div class="' + hname + '"></div>'),
					axis = null;
				
				oneHandle = oneHandle.appendTo(el).data('direction', handle);
				
				if(handle === 'n' || handle === 's') {
					axis = 'y';
				}else if(handle === 'e' || handle === 'w') {
					axis = 'x';
				}
				
				new ui.Draggable(oneHandle, {
					distance: 0,
					group: 'none',
					axis: axis,
					dragstart: proxy(that._start, that),
					drag: proxy(that._resize, that),
					dragend: proxy(that._stop, that)
				});
			}
		},
		_start: function(e) {
			var that = this,
				el = that.element,
				top = el.css('top'),
				left = el.css('left');
				
			top = top === 'auto' ? 0 : parseInt(top, 10);
			left = left === 'auto' ? 0 : parseInt(left, 10);
			
			that._positionMouse = {X: e.pageX, Y: e.pageY};
			that._position = {width: el.width(), height: el.height(), top: top, left: left};
			
			if(isFunction(that.options.start)) {
				that.options.start.call(that, e);
			}
			
		},
		_resize: function(e) {
			var that = this,				
				el = that.element,
				pos = that._position,
				direction = e.currentTarget.data('direction'),
				x = e.pageX - that._positionMouse.X,
				y = e.pageY - that._positionMouse.Y,
				width = pos.width + x, 
				height = pos.height + y,
				w = pos.width - x, 
				h = pos.height - y,
				left = pos.left + x,
				top = pos.top + y,
				currentTop = parseInt(el.css('top'), 10),
				currentLeft = parseInt(el.css('left'), 10),
				minWidth = that.min.width,
				maxWidth = that.max.width,
				minHeight = that.min.height,
				maxHeight = that.max.height,
				cursor;
				
			if(width <= minWidth) {
				width = minWidth;
			}else if(width >= maxWidth) {
				width = maxWidth;
			}
			if(w <= minWidth) {
				left = currentLeft;
				w = minWidth;
			}else if(w >= maxWidth) {
				left = currentLeft;
				w = maxWidth;
			}	
			
			if(height <= minHeight) {
				height = minHeight;
			}else if(height >= maxHeight) {
				height = maxHeight;
			}
			if(h <= minHeight) {
				top = currentTop;
				h = minHeight;
			}else if(h >= maxHeight) {
				top = currentTop;
				h = maxHeight;
			}
			
			switch(direction) {
				case 'n': {
					cursor = 'n-resize';
					that.position = {height: h, top: top};
					break;
				}
				case 'e': {
					cursor = 'e-resize';
					that.position = {width: width};
					break;
				}
				case 's': {
					cursor = 's-resize';
					that.position = {height: height};
					break;
				}
				case 'w': {
					cursor = 'w-resize';
					that.position = {width: w, left: left};
					break;
				}
				case 'se': {
					cursor = 'se-resize';
					that.position = {width: width, height: height};
					break;
				}
				case 'sw': {
					cursor = 'sw-resize';
					that.position = {width: w, height: height, left: left};
					break;
				}
				case 'ne': {
					cursor = 'ne-resize';
					that.position = {width: width, height: h, top: top};
					break;
				}
				case 'nw': {
					cursor = 'nw-resize';
					that.position = {width: w, height: h, top: top, left: left};
					break;
				}
			}
			
			if(isFunction(that.options.resize)) {
				that.options.resize.call(that, e);
			}
			
			el.css(that.position);
			$(document.body).css('cursor', cursor);
		},
		_stop: function(e) {
			var that = this;
			//console.log(e.currentTarget);
			if(isFunction(that.options.resizeend)) {
				that.options.resizeend.call(that, e);
			}
			$(document.body).css('cursor', '');
		},
		destroy: function() {
			var that = this;
				
			Widget.fn.destroy.call(that);
			
		}
	});
	
	ui.plugin(Resizable);
	
})(jQuery);