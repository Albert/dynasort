var myResults = "";

/* does this need a 'dynasortNum' appended: isn't the item index good enough? */
$.getJSON(
  "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20query%3D%22sushi%22%20and%20location%3D%22san%20francisco,%20ca%22&format=json&callback=",
  function(data){
    myResults = data.query.results.Result;
    $.each(myResults, function(i,item){
      item.dynasortNum = i;
      var rowContainer = $("<div class='item' id='item_" + i + "' />");
      rowContainer.appendTo("#items");
      $("<div/>").html(item.Title).appendTo("#item_" + i);
    });
  }
);

$(document).ready(function () {
  $('#bn_sort_by_name_and_length').click(function() {
    $.each(myResults, function(i,item){
      sortByNameAndLength();
    });
    return false;
  });

  $('#bn_sort_by_rating_and_distance').click(function() {
    $.each(myResults, function(i,item){
      sortByRatingAndDistance();
    });
    return false;
  });

});

function sortByNameAndLength() {
  $.each(myResults, function(i,item){
    itemLeft = item.Title.length * 30;
    itemLeftInPix = itemLeft + "px";
    itemTop = item.Title.toUpperCase().charCodeAt() * 10 - 600;
    itemTopInPix = itemTop + "px";
    $('#item_' + i).animate({'left' : itemLeftInPix, 'top' : itemTopInPix}, {duration: 'slow', queue: false} );
  });
}

function sortByRatingAndDistance() {
  $.each(myResults, function(i,item){
    itemLeft = item.Distance * 100;
    itemLeftInPix = itemLeft + "px";
    itemTop = item.Rating.AverageRating * 100;
    itemTopInPix = itemTop + "px";
    $('#item_' + i).animate({'left' : itemLeftInPix, 'top' : itemTopInPix}, {duration: 'slow', queue: false} );
  });
}