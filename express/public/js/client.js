$(function() {
  $.get('/blocks', appendToList);

  $('form').on('submit', function(e) {
    e.preventDefault();
    var form = $(this);
    var blockData = form.serialize();

    $.ajax({
      type: 'POST', url: '/blocks', data: blockData
    }).done(function(blockName) {
      appendToList([blockName]);
      form.trigger('reset');
    });
  });

  function appendToList(blocks) {
    var list = [];
    var content, block;
    for (var i in blocks) {
      block = blocks[i];
      // link to each Block's description
      content = '<a href="/blocks/' + block + '">' + block + '</a>' +
                '<a href="#" data-block="' + block + '"> ✖</a>';
      list.push($('<li>', { html: content }));
      // list.push($('<li>', { text: blocks[i] }));
    }
    $('.block-list').append(list);

    $('.block-list').on('click', 'a[data-block]', function(event) {
      if (!confirm('Are you sure?')) {
        return false;
      }
      var target = $(event.currentTarget);

      $.ajax({
        type: 'DELETE', url: '/blocks/' + target.data('block')
      }).done(function() {
        target.parents('li').remove();
      });
    });
  }
});

$(function() {
  $.get('/locations', appendToList);
  function appendToList(locations) {
    var list = [];
    for (var i in locations) {
      list.push($('<li>', { text: locations[i] }));
    }
    $('.location-list').append(list);
  }
})