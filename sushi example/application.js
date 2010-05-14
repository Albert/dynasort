/*
Objects

Dataset[data]
  datatype (support for string, numerical value, categories)
x axis
y axis
radios
axis bounds


Description:
left side is the y axis
bottom is the x axis
graph top right
graph 400 tall, 600 wide




*/

var dataset = "";

/* does this need a 'dynasortNum' appended: isn't the item index good enough? */
$.getJSON(
  "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20query%3D%22sushi%22%20and%20location%3D%22san%20francisco,%20ca%22&format=json&callback=",
  function(data){
    dataset = data.query.results.Result;
    $.each(dataset, function(i,item){
      item.dynasortNum = i;
      var rowContainer = $("<div class='item' id='item_" + i + "' />");
      rowContainer.appendTo("#graph");
      $("<div/>").html(item.Title).appendTo("#item_" + i);
    });
  }
);

$(document).ready(function () {
  $('#bn_sort_by_name_and_length').click(function() {
    $.each(dataset, function(i,item){
      sortByNameAndLength();
    });
    return false;
  });

  $('#bn_sort_by_rating_and_distance').click(function() {
    $.each(dataset, function(i,item){
      sortByRatingAndDistance();
    });
    return false;
  });

});

function sortByNameAndLength() {
  $.each(dataset, function(i,item){
    itemLeft = item.Title.length * 30;
    itemLeftInPix = itemLeft + "px";
    itemTop = item.Title.toUpperCase().charCodeAt() * 10 - 600;
    itemTopInPix = itemTop + "px";
    $('#item_' + i).animate({'left' : itemLeftInPix, 'top' : itemTopInPix}, {duration: 'slow', queue: false} );
  });
}

function sortByRatingAndDistance() {
  $.each(dataset, function(i,item){
    itemLeft = item.Distance * 100;
    itemLeftInPix = itemLeft + "px";
    itemTop = item.Rating.AverageRating * 100;
    itemTopInPix = itemTop + "px";
    $('#item_' + i).animate({'left' : itemLeftInPix, 'top' : itemTopInPix}, {duration: 'slow', queue: false} );
  });
}