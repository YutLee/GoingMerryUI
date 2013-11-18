/**
 * Going Merry UI Web 2013.11.100
 * Copyright 2013
 * 
 * create 2013.11.1
 * author yutlee.cn@gmail.com 
 */

(function($, undefined) {
	var gm = window.gm = window.gm || {},
		extend = $.extend;
	
	function Class() {}

    Class.extend = function(proto) {
        var base = function() {},
            member,
            that = this,
            subclass = proto && proto.init ? proto.init : function () {
                that.apply(this, arguments);
            },
            fn;

        base.prototype = that.prototype;
        fn = subclass.fn = subclass.prototype = new base();

        for (member in proto) {
            if (typeof proto[member] === 'Object' && !(proto[member] instanceof Array) && proto[member] !== null) {
                // Merge object members
                fn[member] = extend(true, {}, base.prototype[member], proto[member]);
            } else {
                fn[member] = proto[member];
            }
        }

        fn.constructor = subclass;
        subclass.extend = that.extend;

        return subclass;
    };
	
	var Observable = Class.extend({
		init: function() {
			this._events = {};
		}
	});
	
	var Widget = Observable.extend({
		init: function(element, options) {
			var that = this;
			
			Observable.fn.init.call(that);
			
			if($.isPlainObject(element) && options === undefined) {
				that.options = element;
			}else if(element && !$.isPlainObject(element)) {
				that.element = element;
			}

			options = that.options = extend(true, {}, that.options, options);
			
			if(!that.element.attr('data-role')) {
				that.element.attr('data-role', (options.name || '').toLowerCase());
			}
			
			that.element.data('gm' + options.name, that);
		},
		destroy: function() {
			var that = this;
			
			that.element.removeData('gm' + options.name);
		}
	});
	
	gm.ui = {
		Widget: Widget,
		plugin: function(widget) {
			var name = widget.fn.options.name;
			gm.ui[name] = widget;
			name = 'gm' + name;
			$.fn[name] = function(options) {				
				this.each(function() {
					Widget.fn.element = $(this);
					new widget(options);
				});
				return this;
			};
		}
	};
	
 })(jQuery);