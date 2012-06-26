var dataSet = {};
var viewTemplate;

function sizeContents() {
  var winHeight = $(window).height();
  var winWidth = $(window).width() - $("#control_pad").outerWidth() - 1;
  $("#y_axis").height(winHeight - 75 - 35);
  $("#graph_field").height(winHeight - 75 - 35);
  $("#graph").width(winWidth);
  $("#x_axis").width(winWidth - 75 - 35);
  $("#graph_field").width(winWidth - 75 - 35);
}

$(document).ready(function() {
  $(window).resize(function() {
    sizeContents();
  });
  sizeContents();
});

var dynasort = {
  init: function() {
    this.controllers.build();
    this.points.build();
    this.axes.build();
    this.points.sort();
    $('.axis .label span').click(function() {
      $(this).siblings('select').toggle();
    });
  },
  points: {
    build: function() {
      $graph_field = $('#graph_field');
      _.each(dataSet.data, function(item, ind) {
        itemContainer = $('<li id="item_' + ind + '" class="item">');
        itemContainer.html(viewTemplate(item));
        itemContainer.appendTo($graph_field);
      })
    },
    sort: function() {
      $('.item').each(function() {
        var $this = $(this);
        var yAxis = $("#y_axis option:selected").val();
        var xAxis = $("#x_axis option:selected").val();
        var dataPoint = dataSet.data[$this.attr("id").replace("item_", "")];
        var pointTop = dataPoint[xAxis];
        var fullHeight = ("#graph_field").height();
        var fullWidth = ("#graph_field").width();
        console.log(pointTop);
        //$this.css({top: pointTop, left: pointLeft});
      });
    }
  },
  controllers: {
    build: function() {
      $controller_container = $('#controller_container');
      _.each(dataSet.columns, function(column) {
        if (column.dataType) {
          $('<dt>' + column.friendlyName + ':<span id="' + column.name + '_range" class="range">' + column.range[0] + ' - ' + column.range[1] + '</span></dt>').appendTo($controller_container);
          colMin = 0;
          colMax = 100;
          $('<dd id="' + column.name + '_slider" class="slider">').appendTo($controller_container).slider({
            range: true,
            min: column.range[0],
            max: column.range[1],
            values: column.range,
            slide: function(event, ui) {
              $('#' + column.name + '_range').html(ui.values[0] + ' - ' + ui.values[1]);
            }
          });
        }
      });
    }
  },
  axes: {
    build: function() {
      $('.axis').each(function(index){
        var $this = $(this);
        _.each(dataSet.columns, function(column) {
          if (column.dataType) {
            var selectedTag = "";
            if (dataSet.columns[index] == column) {selectedTag = ' selected="selected" ';}
            $this.find('select').append('<option value="' + column.name + '"' + selectedTag + '>' + column.friendlyName + '</option>');
          }
        });
        $this.find('.lower span' ).html(dataSet.columns[index].range[0]);
        $this.find('.label label').html(dataSet.columns[index].friendlyName);
        $this.find('.upper span' ).html(dataSet.columns[index].range[1]);
        var configPos = $this.find('.label a').css("visibility", "visible").position();
        $this.find('.label select').css({left: configPos.left + 35, top: configPos.top - 5});
      });
    }
  }
}



/*


var rawData = {
  "fetch": function() {
    var sanitizedData = [];
    $.getJSON(config.jsonPath,
      function foo(jsonData) {

        // drill down to the proper node with the jsonDataCollection
        var nodeList = jsonData;
        _.each(config.jsonDataCollection.split("."), function(child){
          nodeList = nodeList[child];  // this guy is an array whose elements are the stuff you're sorting thru
        });

        // build sanitizedData based on config data
        _.each(nodeList, function(dataPoint, pointIndex){
          var point = {"display": {}};

          _.each(config.dataAttributes, function(attribute, key){
            if (attribute.basedOnIndex) {
              point[key] = pointIndex;
            } else {
              var _jsonPath = attribute.jsonPath ? attribute.jsonPath : key;
              point[key] = nodeList[pointIndex][config.jsonNodeNest][_jsonPath];
            }
          });

          _.each(config.displayAttributes, function(attribute, key){
            if (attribute.basedOnIndex) {
              point.display[key] = pointIndex;
            } else {
              var _jsonPath = attribute.jsonPath ? attribute.jsonPath : key;
              point.display[key] = nodeList[pointIndex][config.jsonNodeNest][_jsonPath];
            }
          });

          sanitizedData[pointIndex] = point; // add an object to sanitizedData @ that index
        });
      }
    ).success(function() {

      // upon success initiate points
      points.init(sanitizedData);
      axes.init();
      _.each(config.axes, function(value_i_dont_need, axis) {
        axes.update(axis, sanitizedData);
      });

    })
    .error(function() {
      alert("Hrm... Looks like we're having trouble connecting...");
    });
  }
}

var controllers = {
  init: function() {
    var $filterContainer = $("#filters ul");
    var label  = _.template('<label for="<%= id %>_filter"><%= string %></label>');
    var input  = _.template('<input type="text" id="<%= id %>_filter_bounds" />');
    var slider = _.template('<div id="<%=id %>_filter" class="filter_slider" />');

    _.each(config.dataAttributes, function(attributeValue, key){
      var friendlyName = attributes.getFriendlyName(key);
      var attributeConfig = { id : key, string : friendlyName };

      var $li = $("<li />");
      $li.append(label(attributeConfig))
         .append(input(attributeConfig))
         .append(slider(attributeConfig));

      $li.appendTo($filterContainer);

    });
  },
  update: function() {}
}

var attributes = {
  getFriendlyName: function(name) {
    return config.dataAttributes[name].friendlyName ? config.dataAttributes[name].friendlyName : (name.charAt(0).toUpperCase() + name.slice(1));
  }
}

var sanitizedData = {}

var axes = {
  init: function() {
    _.each(config.axes, function(defaultAttribute, axisName){
      $axisSelector = $("#" + axisName + "_axis_selector");
      var option = _.template('<option value="<%= id %>"<%= selected %>><%= string %></option>')

      _.each(config.dataAttributes, function(attributeValue, key){
        var friendlyName = attributes.getFriendlyName(key);
        var selected = (key == defaultAttribute) ? ' selected="selected"': '';
        var attributeConfig = { id : key, selected : selected, string : friendlyName };

        $axisSelector.append(option(attributeConfig));
      });

    });
  },
  update: function(axisName, data) {

    var attribute = $("#" + axisName + "_axis_selector").val();
    var minValue = _.min(data, function(point){return point[attribute]})[attribute];
    var maxValue = _.max(data, function(point){return point[attribute]})[attribute];
    var friendlyName = attributes.getFriendlyName(attribute);
    $("#" + axisName + "_axis .lower").append(minValue);
    $("#" + axisName + "_axis .upper").append(maxValue);
    $("#" + axisName + "_axis .label").append(friendlyName);

  }
};

var points = {
  init: function(data) {
    _.each(data, function(point, index){
      var $li = $('<li id="point_' + index + '" />');
      $li.append(config.viewTemplate(point.display));
      $li.appendTo($('#points'));
    });
  }
}


//  _.each(config.axes, function(defaultAttribute, axisName){
//    axes.init(axisName, defaultAttribute);
//  });


*/

