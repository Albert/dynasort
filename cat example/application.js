var myJson = "";

/* does this need a 'dynasortNum' appended: isn't the item index good enough? */
$.getJSON(
  "http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=?",
  function(data){
    myJson = data;
    $.each(data.items, function(i,item){
      item.dynasortNum = i;
      var rowContainer = $("<div class='item' id='item_" + i + "' />");
      rowContainer.appendTo("#items");
      /* $("<img/>").attr("src", item.media.m).appendTo("#item_" + i);
      $("<div/>").html(item.date_taken).appendTo("#item_" + i); */
      $("<div/>").html(item.title).appendTo("#item_" + i);
    });
  }
);

$(document).ready(function () {
  $('#bn_sort').click(function() {
    $.each(myJson.items, function(i,item){
      test();
    });
    return false;
  });
});

function test() {
  $.each(myJson.items, function(i,item){
    itemLeft = item.title.length * 30;
    itemLeftInPix = itemLeft + "px";
    itemTop = item.title.toUpperCase().charCodeAt() * 10 - 600;
    itemTopInPix = itemTop + "px";
    $('#item_' + i).animate({'left' : itemLeftInPix, 'top' : itemTopInPix}, 800 );
    /* $('#item_' + i).css({'left' : itemLeftInPix, 'top' : itemTopInPix}); */
  });
}