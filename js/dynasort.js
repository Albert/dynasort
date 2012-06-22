var dataSet = {};
var viewTemplate;

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

function sizeContents() {
  var winHeight = $(window).height();
  var winWidth = $(window).width() - $("#control_pad").outerWidth() - 1;
  $("#graph").height(winHeight);
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
  rawData.fetch();
  controllers.init();
  axes.init();
});

