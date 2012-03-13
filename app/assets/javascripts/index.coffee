window.count = 0

jQuery ->

  tree = (elements) ->
    list = []
    $('li').data('child',null)
    elements.each ->
      if $(this).parents('li').first().hasClass('array')
        $(this).parents('li').first().data('child',$(this).parents('ul').first().data('child-index').toString())

      if $(this).data('child')
        crumb = "#{$(this).data('key')}[#{$(this).data('child')}]"
      else
        crumb = $(this).data('key')

      crumb = "[#{crumb}]" if parseInt(crumb) > 0
      list.push crumb

    return list.reverse()

  $("a.key").live 'click', (e) ->
    e.preventDefault()
    $('ul#path').empty()
    if $(this).parents('li')
      for leaf in tree($(this).parents('li'))
        $('ul#path').append("<li>#{leaf}</li>")

  $("a.toggler").live 'click', (e) ->
    e.preventDefault()
    console.log $(this).next().next()
    $(this).next().next().stop().slideToggle('fast')


  t = (object) ->
    Object.prototype.toString.call( object )

  iterate = (object, ul) ->
    toggler = "<a href='#' class='toggler'>+/-</a> "

    if t(object) is "[object String]"
      object = { $: object }
    for key, value of object
      switch t(value)
        when "[object Object]"
          a = $("<li class='object' data-key='#{key}'>#{toggler}<a href='#' class='key'>#{key}</a><ul>")
          ul.append a
          #
          iterate(value, a.find('ul').last())
          # <li class='object' data-key='#{key}'><a href='#' class='key'>#{key}</a><ul></ul></li>
        when "[object Array]"
          # # el = element.append "<li class='array' data-key='#{key}'><a href='#' class='toggler'>+/-</a> <a href='#' class='key'>#{key}</a><ul></ul></li>"
          a = $("<li class='array' data-key='#{key}'>#{toggler}<a href='#' class='key'>#{key}</a>")
          ul.append a
          index = 0
          for node in value
            a.append("<ul data-child-index='#{index}'>")
            iterate(node, a.find('ul').last())
            index++
        else
          ul.append("<li class='string' data-key='#{key}'><a href='#' class='key'>#{key}</a> #{value}</li>")


  $('#input').change ->
    object = jQuery.parseJSON($(this).val())
    $('#output > ul').empty()
    iterate(object, $('#output > ul'))


