/* WeeklyCalendar plugin for jQuery 1.0.0
 *
 * @author : Moises Brenes <moises.brenes@gmail.com>
 * @blog   : http://blog.mbrenes.com
 * @source : https://github.com/gin/weekly-calendar
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation.
 *
 * License: GNU General Public License v2.0
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
(function($) {
	var lang = null;
	var clsButton = 'wcp-btn-all';
	var clsSelected = 'wcp-btn-selected';
	var clsPrevious = 'wcp-btn-previous';
	var clsNext = 'wcp-btn-next';
	var clsDays = 'wcp-days';
	var clsDay = 'wcp-day';
	var locale = ['en', 'es', 'it'];

	var strings = {
		en: {
            text_previous : 'Previous week',
            text_next     : 'Next week',
            text_header   : 'Week of',},
		es: {
            text_previous : 'Semana anterior',
            text_next     : 'Siguiente semana',
            text_header   : 'Semana de',},
		it: { /* @TODO: translate this */
            text_previous : 'Previous week',
            text_next     : 'Next week',
            text_header   : 'Week of',},
	}

    var defaults = {
        lang          : locale[0],
        first_date    : null,
        selected_date : 0,
        text_previous : strings.en['text_previous'],
        text_next     : strings.en['text_next'],
        text_header   : strings.en['text_header'],
    };

    Date.prototype.monthNames = {
        en: [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December'],
        es: [
        'Enero', 'Febrero', 'Marzo',
        'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Setiembre',
        'Octubre', 'Noviembre', 'Diciembre'],
        it: [
        'Gennaio', 'Febbraio', 'Marzo',
        'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre',
        'Ottobre', 'Novembre', 'Dicembre'],
    };

    Date.prototype.dayNames = {
        en: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'],
        es: [
        'Domingo', 'Lunes', 'Martes', 'Miercoles',
        'Jueves', 'Viernes', 'Sabado'],
        it: [
        'Domenica', 'Lunedi', 'Martedi', 'Mercoledi',
        'Giovedi','Venerdi', 'Sabato'],
    };

	function localize(options, key) {
        try {
            key = key.toString();
        } catch (e) {
            return '';
        }

	    if (key in strings[lang]) {
	    	if (options[key] == defaults[key])
	    	    return strings[lang][key];
	    	else
	    		return options[key];
	    } else if (key in strings.en) {
	    	return strings.en[key];
	    }

	    return '';
	}

    function setDaySuffix(day) {
    	try {
    		value = day.toString();
            day = parseInt(day);
    	} catch (e) {
            return '';
    	}

        if (day >= 11 && day <= 13)
            return value.concat('th');

        switch (day % 10) {
            case  1: return value.concat('st');
            case  2: return value.concat('nd');
            case  3: return value.concat('rd');
            default: return value.concat('th');
        }
    }

    Object.isDate = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    };

    Object.isValidDate = function(obj) {
        return Object.isDate(obj) && !isNaN(obj.getTime());
    }

    Date.prototype.getMonthName = function() {
        return this.monthNames[lang][this.getMonth()];
    };

    Date.prototype.getShortMonthName = function () {
        return this.getMonthName().substr(0, 3);
    };

    Date.prototype.getDayName = function() {
        return this.dayNames[lang][this.getDay()];
    };

    Date.prototype.getShortDayName = function () {
        return this.getDayName().substr(0, 3);
    };

    function render(obj, options) {
    	var first = new Date(options.first_day.getTime());
    	var day = new Date(options.first_day.getTime());
        var last = null;

        var ul = $('<ul>')
        .addClass(clsDays);

        for (i=0; i<7; i++) {
            var span = $('<span>')
                .addClass(clsDay)
                .text(day.getShortDayName());

            var a = $('<a>')
                .attr('href', '#')
                .attr('year', day.getFullYear())
                .attr('month', day.getMonth() + 1)
                .attr('day', day.getDate())
                .attr('hours', day.getHours())
                .attr('minutes', day.getMinutes())
                .attr('seconds', day.getSeconds())
                .append(span)
                .append(' '.concat(day.getDate()))
                .attr('date', ''.concat(
                    day.getFullYear(), '-',
                    day.getMonth() + 1, '-',
                    day.getDate()
                ));
            (i == options.selected_date) ? a.addClass(clsSelected) : a.addClass(clsButton);

            var li = $('<li>')
                .css('margin-left', 1)
                .css('margin-right', 1)
                .append(a);
            ul.append(li);

            if (i == 6)
                last = new Date(day.getTime());
            day.setDate(day.getDate() + 1);
        }

        var h = $('<h3>')
            .text(''.concat(
                localize(options, 'text_header'), ' ',
                first.getMonthName(), ' ',
                setDaySuffix(first.getDate())
        ));

        var button = {
            previous: $('<a>')
                .addClass(clsPrevious)
                .addClass(clsButton)
                .attr('href', '#')
                .attr('date', ''.concat(
                    first.getFullYear(), '-',
                    first.getMonth() + 1, '-',
                    first.getDate()
                ))
                .attr('year', first.getFullYear())
                .attr('month', first.getMonth() + 1)
                .attr('day', first.getDate())
                .attr('hours', first.getHours())
                .attr('minutes', first.getMinutes())
                .attr('seconds', first.getSeconds())
                .attr('title', localize(options, 'text_previous'))
                .text(localize(options, 'text_previous')),
            next: $('<a>')
                .addClass(clsNext)
                .addClass(clsButton)
                .attr('href', '#')
                .attr('date', ''.concat(
                    last.getFullYear(), '-',
                    last.getMonth() + 1, '-',
                    last.getDate()
                ))
                .attr('year', last.getFullYear())
                .attr('month', last.getMonth() + 1)
                .attr('day', last.getDate())
                .attr('hours', last.getHours())
                .attr('minutes', last.getMinutes())
                .attr('seconds', last.getSeconds())
                .attr('title', localize(options, 'text_next'))
                .text(localize(options, 'text_next')),
        };

        $(obj).empty();

        $(obj).append(h);
        $(obj).append(button.previous);
        $(obj).append(ul);
        $(obj).append(button.next);

        $(obj).find(
            'ul > li > a'
        ).click({options: options}, toggle);

        $(obj).find(
            ''.concat('a.', clsPrevious, ',', 'a.', clsNext)
        ).click({obj: obj, options: options}, offset);

        return obj;
    }

    var toggle = function(event) {
        event.preventDefault();

        if ($(this).hasClass(clsSelected)) {
            $(this).addClass(clsButton);
        	$(this).removeClass(clsSelected);
        } else {
            var parent = $(this).parent().parent();
            var h = $('h3');
            var date = new Date(
                $(this).attr('year'),
                $(this).attr('month') - 1,
                $(this).attr('day'),
                $(this).attr('hours'),
                $(this).attr('minutes'),
                $(this).attr('seconds')
            );
            h.text(''.concat(
                localize(event.data.options, 'text_header'), ' ',
                date.getMonthName(), ' ',
                setDaySuffix(date.getDate())
            ));
            parent.find('li > a.'.concat(clsSelected)).addClass(clsButton);;
            parent.find('li > a.'.concat(clsSelected)).removeClass(clsSelected);;
        	$(this).addClass(clsSelected);
        }
    }

    var offset = function(event) {
        event.preventDefault();

        var date = new Date(
        	$(this).attr('year'),
        	$(this).attr('month') - 1,
        	$(this).attr('day'),
        	$(this).attr('hours'),
        	$(this).attr('minutes'),
        	$(this).attr('seconds')
        );

        if ($(this).hasClass(clsPrevious)) {
            date.setDate(date.getDate() - 7);
        } else if ($(this).hasClass(clsNext)) {
        	date.setDate(date.getDate() + 1);
        }

        var options = $.extend({}, event.data.options, {first_day: date});
        render(event.data.obj, options);
    }

    var methods = {
        init : function(options) {
            var options = $.extend({}, defaults, options);

    	    return this.each(function() {
                try {
                    options.lang = options.lang.toString();
                } catch (e) {
                	options.lang = defaults.lang;
                }
                lang = jQuery.inArray(options.lang, locale) >= 0 ? options.lang : defaults.lang;

                if (!Object.isValidDate(options.first_day)) {
                    options.first_day = new Date();
                }

                try {
                    options.selected_date = parseInt(options.selected_date);
                } catch (e) {
                    options.selected_date = defaults.selected_date;
                }
                if (isNaN(options.selected_date) || options.selected_date < 0 || options.selected_date > 6)
                    options.selected_date = defaults.selected_date;

                try {
                    options.text_previous = options.text_previous.toString();
                } catch (e) {
                    options.text_previous = strings.en['text_previous'];
                }

                try {
                    options.text_next = options.text_next.toString();
                } catch (e) {
                    options.text_next = strings.en['text_next'];
                }

                try {
                    options.text_header = options.text_header.toString();
                } catch (e) {
                    options.text_header = strings.en['text_header'];
                }

                return render(this, options);
    	    });
    	},

        getDateSelected : function() {
            var date = $(this).find('ul > li > a.'.concat(clsSelected)).attr('date');
            if (date !== undefined && date != false)
                return date;
            else
            	return '';
        },

   	    destroy : function() {
   	    },
    };

    $.fn.WeeklyCalendar = function(method) {
	    if (methods[method]) {
	        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	    } else if (typeof method === 'object' || !method) {
	        return methods.init.apply(this, arguments);
	    } else {
	        $.error('Method ' + method + ' does not exist on jQuery.WeeklyCalendar' );
	    }
    }
})(jQuery);
/* end - WeeklyCalendar plugin */
