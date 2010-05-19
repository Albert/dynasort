var dataset = "";
var graphHeight = $('#graph').height();
var graphWidth = $('#graph').width();

$.getJSON(
//"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20query%3D%22sushi%22%20and%20location%3D%22san%20francisco,%20ca%22&format=json&callback=",
  "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search(0)%20where%20query%3D%22coffee%22%20and%20location%3D%22New%20york%2C%20ny%22&format=json&diagnostics=true&callback=",

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
      case "average_rating":
        if(!(item.Rating.AverageRating == "NaN")) {
          yValues.push(parseFloat(item.Rating.AverageRating));
        }
        break;
      case "total_ratings":
        yValues.push(parseFloat(item.Rating.TotalRatings));
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
      case "average_rating":
        if(item.Rating.AverageRating == "NaN") {
          itemBottomInPix = 10000;
        } else {
          itemBottomInPix = ((item.Rating.AverageRating) - minValue) * 400 / (maxValue - minValue);
        }
        break;
      case "total_ratings":
        itemBottomInPix = ((item.Rating.TotalRatings) - minValue) * 400 / (maxValue - minValue);
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
      case "average_rating":
        if(!(item.Rating.AverageRating == "NaN")) {
          xValues.push(parseFloat(item.Rating.AverageRating));
        }
        break;
      case "total_ratings":
        xValues.push(parseFloat(item.Rating.TotalRatings));
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
      case "average_rating":
        if(item.Rating.AverageRating == "NaN") {
          itemLeftInPix = 10000;
        } else {
          itemLeftInPix = ((item.Rating.AverageRating) - minValue) * 600 / (maxValue - minValue);
        }
        break;
      case "total_ratings":
        itemLeftInPix = ((item.Rating.TotalRatings) - minValue) * 600 / (maxValue - minValue);
        break;
      case "distance":
        itemLeftInPix = ((item.Distance) - minValue) * 600 / (maxValue - minValue);
        break;
      default:
    }
    $('#item_' + i).animate({'left' : itemLeftInPix}, {duration: 'slow', queue: false} );
  });
});