$(function() {
  $.get('/blocks', appendToList);
  function appendToList(blocks) {
    var list = [];
    for (var i in blocks) {
      list.push($('<li>', { text: blocks[i] }));
    }
    $('.block-list').append(list);
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