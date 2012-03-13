(function() {

  window.count = 0;

  jQuery(function() {
    var iterate, t, tree;
    tree = function(elements) {
      var list;
      list = [];
      $('li').data('child', null);
      elements.each(function() {
        var crumb;
        if ($(this).parents('li').first().hasClass('array')) {
          $(this).parents('li').first().data('child', $(this).parents('ul').first().data('child-index').toString());
        }
        if ($(this).data('child')) {
          crumb = "" + ($(this).data('key')) + "[" + ($(this).data('child')) + "]";
        } else {
          crumb = $(this).data('key');
        }
        if (parseInt(crumb) > 0) crumb = "[" + crumb + "]";
        return list.push(crumb);
      });
      return list.reverse();
    };
    $("a.key").live('click', function(e) {
      var leaf, _i, _len, _ref, _results;
      e.preventDefault();
      $('ul#path').empty();
      if ($(this).parents('li')) {
        _ref = tree($(this).parents('li'));
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          leaf = _ref[_i];
          _results.push($('ul#path').append("<li>" + leaf + "</li>"));
        }
        return _results;
      }
    });
    $("a.toggler").live('click', function(e) {
      e.preventDefault();
      console.log($(this).next().next());
      return $(this).next().next().stop().slideToggle('fast');
    });
    t = function(object) {
      return Object.prototype.toString.call(object);
    };
    iterate = function(object, ul) {
      var a, index, key, node, toggler, value, _results;
      toggler = "<a href='#' class='toggler'>+/-</a> ";
      if (t(object) === "[object String]") {
        object = {
          $: object
        };
      }
      _results = [];
      for (key in object) {
        value = object[key];
        switch (t(value)) {
          case "[object Object]":
            a = $("<li class='object' data-key='" + key + "'>" + toggler + "<a href='#' class='key'>" + key + "</a><ul>");
            ul.append(a);
            _results.push(iterate(value, a.find('ul').last()));
            break;
          case "[object Array]":
            a = $("<li class='array' data-key='" + key + "'>" + toggler + "<a href='#' class='key'>" + key + "</a>");
            ul.append(a);
            index = 0;
            _results.push((function() {
              var _i, _len, _results2;
              _results2 = [];
              for (_i = 0, _len = value.length; _i < _len; _i++) {
                node = value[_i];
                a.append("<ul data-child-index='" + index + "'>");
                iterate(node, a.find('ul').last());
                _results2.push(index++);
              }
              return _results2;
            })());
            break;
          default:
            _results.push(ul.append("<li class='string' data-key='" + key + "'><a href='#' class='key'>" + key + "</a> " + value + "</li>"));
        }
      }
      return _results;
    };
    return $('#input').change(function() {
      var object;
      object = jQuery.parseJSON($(this).val());
      $('#output > ul').empty();
      return iterate(object, $('#output > ul'));
    });
  });

}).call(this);
