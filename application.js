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

$.getJSON(
  "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20query%3D%22sushi%22%20and%20location%3D%22san%20francisco,%20ca%22&format=json&callback=",
  function(data){
    dataset = data.query.results.Result;
    $.each(dataset, function(i,item){
      var rowContainer = $("<div class='item' id='item_" + i + "' />");
      rowContainer.appendTo("#graph");
      $("<div/>").html(item.Title).appendTo("#item_" + i);
    });
  }
);

$('input:radio').change(function(){
  var yLabel = $('#y_axis_selector input:radio:checked').val();
  var xLabel = $('#x_axis_selector input:radio:checked').val();

  var yValues = [];
  $.each(dataset, function(i,item){
    switch(yLabel){
      case "name":
        yValues.push(parseFloat(item.Title.toUpperCase().charCodeAt()));
        break;
      case "name_length":
        yValues.push(parseFloat(item.Title.length));
        break;
      case "rating":
        yValues.push(parseFloat(item.Rating.AverageRating));
        break;
      case "distance":
        yValues.push(parseFloat(item.Distance));
        break;
      default:
    }
  });

  maxValue = yValues.sort(function(a,b){return a - b}).slice(-1);
  minValue = yValues.sort(function(a,b){return a - b}).slice(0,1);

  switch(yLabel){
    case "name":
      minValueLabel = String.fromCharCode(minValue) + '';
      maxValueLabel = String.fromCharCode(maxValue) + '';
      break;
    default:
      minValueLabel = minValue + '';
      maxValueLabel = maxValue + '';
  }

  $('#y_axis .lower_limit').html(minValueLabel);
  $('#y_axis .upper_limit').html(maxValueLabel);

  $.each(dataset, function(i,item){
    switch(yLabel){
      case "name":
        itemBottomInPix = ((item.Title.toUpperCase().charCodeAt()) - minValue) * 400 / (maxValue - minValue);
        break;
      case "name_length":
        itemBottomInPix = ((item.Title.length) - minValue) * 400 / (maxValue - minValue);
        break;
      case "rating":
        itemBottomInPix = ((item.Rating.AverageRating) - minValue) * 400 / (maxValue - minValue);
        break;
      case "distance":
        itemBottomInPix = ((item.Distance) - minValue) * 400 / (maxValue - minValue);
        break;
      default:
    }
    $('#item_' + i).animate({'bottom' : itemBottomInPix}, {duration: 'slow', queue: false} );
  });


  var xValues = [];
  $.each(dataset, function(i,item){
    switch(xLabel){
      case "name":
        xValues.push(parseFloat(item.Title.toUpperCase().charCodeAt()));
        break;
      case "name_length":
        xValues.push(parseFloat(item.Title.length));
        break;
      case "rating":
        xValues.push(parseFloat(item.Rating.AverageRating));
        break;
      case "distance":
        xValues.push(parseFloat(item.Distance));
        break;
      default:
    }
  });

  maxValue = xValues.sort(function(a,b){return a - b}).slice(-1);
  minValue = xValues.sort(function(a,b){return a - b}).slice(0,1);

  switch(xLabel){
    case "name":
      minValueLabel = String.fromCharCode(minValue) + '';
      maxValueLabel = String.fromCharCode(maxValue) + '';
      break;
    default:
      minValueLabel = minValue + '';
      maxValueLabel = maxValue + '';
  }

  $('#x_axis .lower_limit').html(minValueLabel);
  $('#x_axis .upper_limit').html(maxValueLabel);

  $.each(dataset, function(i,item){
    switch(xLabel){
      case "name":
        itemLeftInPix = ((item.Title.toUpperCase().charCodeAt()) - minValue) * 600 / (maxValue - minValue);
        break;
      case "name_length":
        itemLeftInPix = ((item.Title.length) - minValue) * 600 / (maxValue - minValue);
        break;
      case "rating":
        itemLeftInPix = ((item.Rating.AverageRating) - minValue) * 400 / (maxValue - minValue);
        break;
      case "distance":
        itemLeftInPix = ((item.Distance) - minValue) * 400 / (maxValue - minValue);
        break;
      default:
    }
    $('#item_' + i).animate({'left' : itemLeftInPix}, {duration: 'slow', queue: false} );
  });




  // switch(xLabel)
  // {
  // case "name":
  //   var values = [];
  //   $.each(dataset, function(i,item){
  //     values.push(parseFloat(item.Title.toUpperCase().charCodeAt()));
  //   });
  //   maxValue = values.sort(function(a,b){return a - b}).slice(-1);
  //   minValue = values.sort(function(a,b){return a - b}).slice(0,1);
  // 
  //   $.each(dataset, function(i,item){
  //     itemLeftInPix = ((item.Title.toUpperCase().charCodeAt()) - minValue) * 600 / (maxValue - minValue);
  //     $('#item_' + i).animate({'left' : itemLeftInPix}, {duration: 'slow', queue: false} );
  //   });
  // 
  //   $('#x_axis .lower_limit').html(String.fromCharCode(minValue) + '');
  //   $('#x_axis .upper_limit').html(String.fromCharCode(maxValue) + '');
  // 
  //   break;
  // case "name_length":
  //   var values = [];
  //   $.each(dataset, function(i,item){
  //     values.push(parseFloat(item.Title.length));
  //   });
  //   maxValue = values.sort(function(a,b){return a - b}).slice(-1);
  //   minValue = values.sort(function(a,b){return a - b}).slice(0,1);
  // 
  //   $.each(dataset, function(i,item){
  //     itemLeftInPix = ((item.Title.length) - minValue) * 600 / (maxValue - minValue);
  //     $('#item_' + i).animate({'left' : itemLeftInPix}, {duration: 'slow', queue: false} );
  //   });
  // 
  //   $('#x_axis .lower_limit').html(minValue + '');
  //   $('#x_axis .upper_limit').html(maxValue + '');
  // 
  //   break;
  // default:
  // }

});

$(document).ready(function () {
  $('#bn_sort_by_name_and_length').click(function() {
    sortByNameAndLength();
    return false;
  });

  $('#bn_sort_by_rating_and_distance').click(function() {
    sortByRatingAndDistance();
    return false;
  });
});

function sortByNameAndLength() {
  $.each(dataset, function(i,item){
    itemLeft = item.Title.length * 30;
    itemLeftInPix = itemLeft + "px";
    itemBottom = item.Title.toUpperCase().charCodeAt();
    itemTopInPix = itemBottom + "px";
    $('#item_' + i).animate({'left' : itemLeftInPix, 'top' : itemTopInPix}, {duration: 'slow', queue: false} );
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
    itemTopInPix = ((item.Rating.AverageRating - minRating) * 400 / (maxRating - minRating))
    $('#item_' + i).animate({'left' : itemLeftInPix, 'top' : itemTopInPix}, {duration: 'slow', queue: false} );
  });

  $('#x_axis .lower_limit').html(minDistance + '');
  $('#x_axis .upper_limit').html(maxDistance + '');
  $('#y_axis .lower_limit').html(minRating + '');
  $('#y_axis .upper_limit').html(maxRating + '');

  // distancesPix = $.map(distances, function(a){
  //   return ((a - minDistance) * 600 / (maxDistance - minDistance));
  // });
  // $.each(dataset, function(i,item){
  //   
  //   itemLeft = item.Distance * 100;
  //   itemLeftInPix = itemLeft + "px";
  // 
  //   itemBottom = item.Rating.AverageRating * 100;
  //   itemTopInPix = itemBottom + "px";
  // 
  //   $('#item_' + i).animate({'left' : itemLeftInPix, 'bottom' : itemTopInPix}, {duration: 'slow', queue: false} );
  // });
}