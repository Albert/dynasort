/*
yql statement:
select * from local.search where query="sushi" and location="san francisco, ca"

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
var graphHeight = $('#graph').height();
var graphWidth = $('#graph').width();

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
    itemBottom = item.Title.toUpperCase().charCodeAt();
    itemBottomInPix = itemBottom + "px";
    $('#item_' + i).animate({'left' : itemLeftInPix, 'bottom' : itemBottomInPix}, {duration: 'slow', queue: false} );
  });
}

function sortByRatingAndDistance() {

  var distances = [];

  $.each(dataset, function(i,item){
    distances.push(parseFloat(item.Distance));
  });

  maxDistance = distances.sort(function(a,b){return a - b}).slice(-1);
  minDistance = distances.sort(function(a,b){return a - b}).slice(0,1);

  var ratings = [];

  $.each(dataset, function(i,item){
    ratings.push(parseFloat(item.Rating.AverageRating));
  });

  maxRating = ratings.sort(function(a,b){return a - b}).slice(-1);
  minRating = ratings.sort(function(a,b){return a - b}).slice(0,1);

  $.each(dataset, function(i,item){
    //    (original_dist - min_distance) / (maxDistance - min_distance) = pix / 600
    //    (original_dist - min_distance) * 600 / (maxDistance - min_distance) = pix
    itemLeftInPix = ((item.Distance - minDistance) * 600 / (maxDistance - minDistance));
    itemBottomInPix = ((item.Rating.AverageRating - minRating) * 400 / (maxRating - minRating))
    $('#item_' + i).animate({'left' : itemLeftInPix, 'bottom' : itemBottomInPix}, {duration: 'slow', queue: false} );
  });


  // distancesPix = $.map(distances, function(a){
  //   return ((a - minDistance) * 600 / (maxDistance - minDistance));
  // });
  // $.each(dataset, function(i,item){
  //   
  //   itemLeft = item.Distance * 100;
  //   itemLeftInPix = itemLeft + "px";
  // 
  //   itemBottom = item.Rating.AverageRating * 100;
  //   itemBottomInPix = itemBottom + "px";
  // 
  //   $('#item_' + i).animate({'left' : itemLeftInPix, 'bottom' : itemBottomInPix}, {duration: 'slow', queue: false} );
  // });
}