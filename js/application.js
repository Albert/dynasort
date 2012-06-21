$(document).ready(function() {
  var winHeight = $(window).height();
  var winWidth = $(window).width() - $("#control_pad").outerWidth() - 1;
  $("#y_axis").height(winHeight - 75 - 35);
  $("#graph").height(winHeight);
  $("#graph").width(winWidth);
  $("#x_axis").width(winWidth - 75 - 35);
});
/*

Events:
  Page Load
    rawData.fetch     // Pull .json & Push through .json config declaration
    controllers.init  // build control dom elements
    axes.init         // builds "xAxis" and "yAxis" objects.  Also builds selectors
    graph.size        // determine graphsize
    point.init        // Build point dom elements
    xAxes.update      // update labels for x, x-min, x-max
    yAxes.update      // update labels for y, y-min, y-max
    point.filter      // determine whether to hide / show... anytime you filter you need to resort
    point.sort        // location calculation...

  Page Resize
    graph.size
    point.sort

  Axis Pulldown Change
    xAxis.update / yAxis.update     // depending on which does it, obviously
    point.sort

  Attribute Controllers Update
    controllers.update              // if the slider is updated, update the input label...
    xAxis.update / yAxis.update     // for new min / max, if relevant
    point.filter
    point.sort                      // if relevant

Objects & Methods:

rawData
  .fetch
    get a .json file
    use config to parse it down to create a "data" object

controllers
  .init
    build a form dom element for each piece of date
    bind triggers
  .update
    update corresponding form elements

point
  .init
    build a dom element for each piece piece of data
  .filter
    Determine whether to hide or show given point of data
  .sort
    calculate the location of the point and move to the proper place

axes
  .init
    create axes selectors & labels for x, x-min, x-max, y, y-min, y-max
  .update
    update labels for x, x-min, x-max, y, y-min, y-max

graph
  .size
    determine size (in px) for graph

*/


var viewTemplate = _.template('\
<a href="<%= url %>">\
  <img src="<%= thumbnail %>" alt="<%= title %>" />\
  <span class="title"><%= title %></span>\
</a>\
comments: <a href="<%= permalink %>" class="comments"><%= num_comments %></a>\
By <%= author %>');

var config = {
  jsonPath: "http://www.reddit.com/r/pics.json?jsonp=?&limit=100",
  jsonDataCollection: "data.children",
  jsonNodeNest: "data",
  dataAttributes: {
    rank: {
      basedOnIndex: true
    },
    subreddit: {
      type: "string",
      categorySort: true
    },
    created: {
      friendlyName: "Created At",
      type: "dateTime",
      jsonPath: "created_utc"
    },
    score: {
      type: "int"
    },
    comments: {
      friendlyName: "Comment Count",
      type: "int",
      jsonPath: "num_comments"
    }
  },
  displayAttributes: {
    author: {},
    title: {},
    thumbnail: {},
    url: {},
    permalink: {},
    num_comments: {}
  },
  viewTemplate: viewTemplate,
  axes: {
    x: "rank",
    y: "created"
  }
}

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

rawData.fetch();
controllers.init();
axes.init();

//  _.each(config.axes, function(defaultAttribute, axisName){
//    axes.init(axisName, defaultAttribute);
//  });




