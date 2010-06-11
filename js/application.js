/*
functions:
get json
draw gragh
select axes
apply filters

Draw graph on:
Json loading completion
On window resize
On axis selection
On filter
*/

var dataset;
var graphHeight;
var graphWidth;
var minXValue;
var maxXValue;
var minYValue;
var maxYValue;
var xLabel;
var yLabel;

$(document).ready(function(){
  sizeGraph();
  //$.getJSON(
  //"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20query%3D%22sushi%22%20and%20location%3D%22san%20francisco,%20ca%22&format=json&callback=",
  //"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search(0)%20where%20query%3D%22pizza%22%20and%20location%3D%22New%20york%2C%20ny%22&format=json&diagnostics=true&callback=",
  //  function(data){
      dataset = data.query.results.Result;
      $.each(dataset, function(i,item){
        var rowContainer = $("<div class='item' id='item_" + i + "' />");
        rowContainer.appendTo("#graph");
        item.visible = true;
        item.name_visible = true;
        item.name_length_visible = true;
        item.average_rating_visible = true;
        item.total_ratings_visible = true;
        item.distance_visible = true;
        $("<div/>").html('<a href="#" class="name" title="' + item.Title + ', ' + item.Distance + 'mi away, ' + item.Rating.TotalRatings + ' total ratings, average rating of ' + item.Rating.AverageRating +'">x</a>').appendTo("#item_" + i);
      });
      drawGraph();
  //  }
  //);

  $('input:radio').change(function(){
    drawGraph();
  });

  $(window).resize(function(){
    sizeGraph();
    drawGraph();
  });

  /* filters */

  /*
    onload insert min and max in the corresponding div.
    Then, take those numbers and use this parese_int
  */

  $(".filter_slider").each(function() {
    slider_label = $(this).attr('id').replace("_slider", "");
    
    var axisValues = [];
    $.each(dataset, function(i,item){
      if (item.visible) {
        switch(slider_label){
          case "name":
            axisValues.push(parseFloat(item.Title.toUpperCase().charCodeAt()));
            break;
          case "name_length":
            axisValues.push(parseFloat(item.Title.length));
            break;
          case "average_rating":
            if(!(item.Rating.AverageRating == "NaN")) {
              axisValues.push(parseFloat(item.Rating.AverageRating));
            }
            break;
          case "total_ratings":
            axisValues.push(parseFloat(item.Rating.TotalRatings));
            break;
          case "distance":
            axisValues.push(parseFloat(item.Distance));
            break;
          default:
        }
      }
    });
    minValue = axisValues.sort(function(a,b){return a - b}).slice(0,1);
    maxValue = axisValues.sort(function(a,b){return a - b}).slice(-1);
    
    $(this).html(minValue + ',' + maxValue);
  });
  
  $(".filter_slider").each(function() {
    var minValue = parseInt($(this).html().split(",")[0]);
    var maxValue = parseInt($(this).html().split(",")[1]);
    $(this).html('');
    
    $(this).slider({
      range: true,
      min: minValue,
      max: maxValue,
      values: [minValue, maxValue],
      slide: function(event, ui) {
        slider_label = $(this).attr('id').replace("_slider", "");
        switch(slider_label){
          case "name":
            $("#" + slider_label + "_values").val(String.fromCharCode(ui.values[0]) + ', ' + String.fromCharCode(ui.values[1]));
            break;
          default:
            $("#" + slider_label + "_values").val(ui.values[0] + ', ' + ui.values[1]);
        }
      },
      change: function() {
        slider_label = $(this).attr('id').replace("_slider", "");
        lowerLimit = $("#" + slider_label + "_slider").slider("values", 0);
        upperLimit = $("#" + slider_label + "_slider").slider("values", 1);
        switch(slider_label){
          case "name":
            $.each(dataset, function(i,item){
              item.name_visible = (lowerLimit <= item.Title.toUpperCase().charCodeAt() && item.Title.toUpperCase().charCodeAt() <= upperLimit) ? true : false;
            });
            break;
          case "name_length":
            $.each(dataset, function(i,item){
              item.name_length_visible = (lowerLimit <= item.Title.length && item.Title.length <= upperLimit) ? true : false;
            });
            break;
          case "average_rating":
            $.each(dataset, function(i,item){
              item.average_rating_visible = (lowerLimit <= item.Rating.AverageRating && item.Rating.AverageRating <= upperLimit) ? true : false;
            });
            break;
          case "total_ratings":
            $.each(dataset, function(i,item){
              item.total_ratings_visible = (lowerLimit <= item.Rating.TotalRatings && item.Rating.TotalRatings <= upperLimit) ? true : false;
            });
            break;
          case "distance":
            $.each(dataset, function(i,item){
              item.distance_visible = (lowerLimit <= item.Distance && item.Distance <= upperLimit) ? true : false;
            });
            break;
          default:
        }
        $.each(dataset, function(i,item){
          item.visible = (
            item.name_visible == true &&
            item.name_length_visible == true &&
            item.average_rating_visible == true &&
            item.total_ratings_visible == true &&
            item.distance_visible == true
            ) ? true : false;
        });
        drawGraph();
      }
    });
  });
});

function sizeGraph() {
  pageHeight = $(window).height();
  pageWidth = $(window).width();
  graphHeight = pageHeight - 50;
  graphWidth = pageWidth - $('#control_pad').width() - 50;
  $("#graph").height(graphHeight).width(graphWidth);
}

function drawGraph() {
  $('#y_axis .lower_limit').css('right', graphWidth + 5);
  $('#y_axis .upper_limit').css('right', graphWidth + 5);
  yLabel = $('#y_axis_selector input:radio:checked').val();
  xLabel = $('#x_axis_selector input:radio:checked').val();

  /* construct x & y values */
  animatePointsByAxis(yLabel, "y_axis");
  animatePointsByAxis(xLabel, "x_axis");
}

function animatePointsByAxis(label, axisID) {
  var axisValues = [];
  $.each(dataset, function(i,item){
    if (item.visible) {
      switch(label){
        case "name":
          axisValues.push(parseFloat(item.Title.toUpperCase().charCodeAt()));
          break;
        case "name_length":
          axisValues.push(parseFloat(item.Title.length));
          break;
        case "average_rating":
          if(!(item.Rating.AverageRating == "NaN")) {
            axisValues.push(parseFloat(item.Rating.AverageRating));
          }
          break;
        case "total_ratings":
          axisValues.push(parseFloat(item.Rating.TotalRatings));
          break;
        case "distance":
          axisValues.push(parseFloat(item.Distance));
          break;
        default:
      }
    }
  });
  minValue = axisValues.sort(function(a,b){return a - b}).slice(0,1);
  maxValue = axisValues.sort(function(a,b){return a - b}).slice(-1);
  switch(label){
    case "name":
      minValueLabel = String.fromCharCode(minValue) + '';
      maxValueLabel = String.fromCharCode(maxValue) + '';
      break;
    default:
      minValueLabel = minValue + '';
      maxValueLabel = maxValue + '';
  }

  $('#' + axisID + ' .lower_limit').html(minValueLabel);
  $('#' + axisID + ' .upper_limit').html(maxValueLabel);

  if (axisID == "y_axis") {
    fullAxisSize = graphHeight - 10;
  } else {
    fullAxisSize = graphWidth - 10;
  }

  $.each(dataset, function(i,item){
    if (item.visible) {
      switch(label){
        case "name":
          itemOffsetInPix = ((item.Title.toUpperCase().charCodeAt()) - minValue) * fullAxisSize / (maxValue - minValue);
          break;
        case "name_length":
          itemOffsetInPix = ((item.Title.length) - minValue) * fullAxisSize / (maxValue - minValue);
          break;
        case "average_rating":
          if(item.Rating.AverageRating == "NaN") {
            itemOffsetInPix = 10000;
          } else {
            itemOffsetInPix = ((item.Rating.AverageRating) - minValue) * fullAxisSize / (maxValue - minValue);
          }
          break;
        case "total_ratings":
          itemOffsetInPix = ((item.Rating.TotalRatings) - minValue) * fullAxisSize / (maxValue - minValue);
          break;
        case "distance":
          itemOffsetInPix = ((item.Distance) - minValue) * fullAxisSize / (maxValue - minValue);
          break;
        default:
      }
      if (axisID == "y_axis") {
        $('#item_' + i).fadeIn().animate({'bottom' : itemOffsetInPix}, {duration: 'slow', queue: false} );
      } else {
        $('#item_' + i).fadeIn().animate({'left' : itemOffsetInPix}, {duration: 'slow', queue: false} );
      }
    } else {
      $('#item_' + i).fadeOut()
    }
  });
}


