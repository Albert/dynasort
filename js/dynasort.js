var dataSet = {};
var viewTemplate;

jQuery.timeago.settings.refreshMillis = 0;
jQuery.timeago.settings.strings.minute = "a minute";
jQuery.timeago.settings.strings.hour   = "an hour";
jQuery.timeago.settings.strings.hours  = "%d hours";
jQuery.timeago.settings.strings.month  = "a month";
jQuery.timeago.settings.strings.year   = "a year";

function sizeContents() {
  var winHeight = $(window).height();
  var winWidth = $(window).width() - $("#control_pad").outerWidth() - 1;
  $("#y_axis").height(winHeight - 75 - 35);
  $("#graph_field").height(winHeight - 75 - 35);
  $("#graph").width(winWidth);
  $("#x_axis").width(winWidth - 75 - 35);
  $("#graph_field").width(winWidth - 75 - 35);
  dynasort.points.sort();
}

$(function() {
  $(window).resize(function() {
    sizeContents();
  });
  sizeContents();
});

var dynasort = {
  init: function() {
    this.controllers.build();
    this.points.build();
    $('.axis .label span').click(function() {
      $(this).siblings('select').toggle();
    });
    xAxis = new Axis("x", dataSet.columns[1].name);
    yAxis = new Axis("y", dataSet.columns[0].name);
    dynasort.axes.push(xAxis);
    dynasort.axes.push(yAxis);
    _.each(dynasort.axes, function(axis) {
      axis.build();
    });
    this.points.sort();
    $('body').append('<div id="tooltip"><div class="wrap"><span class="clickToExpand">(Click to expand)</span><p></p><?div></div>');
    $('.item').tooltip({
      tip: "#tooltip"
    });
    $('#graph_field').on("hover", ".item", function() {
      $('#tooltip p').replaceWith($(this).find('.header').clone());
      if ($(this).hasClass('expanded')) {
        $('#tooltip .wrap').addClass('hidden');
      } else {
        $('#tooltip .hidden').removeClass('hidden');
      }
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
      $('.time_ago').each(function($el) {
        var $this = $(this);
        $this.attr("title", new Date($this.html() * 1000).toISOString()).timeago();
      });
      $('.item').live('click', function() {
        var $item = $(this);
        if (!$item.hasClass('expanded')) {
          $('.expanded').removeClass('expanded').
            css('top', 'auto').
            css('left', $(this).data('nonExpandedLeft')).
            css('bottom', $(this).data('nonExpandedBottom'));
          $item.addClass('expanded');
          if ($item.position().left > $('#graph_field').width()-450) {
            $item.data('nonExpandedLeft', $item.position().left);
            $item.css('right', 0);
            $item.css('left', 'auto');
          }
          if ($item.position().top < 0) {
            $item.data('nonExpandedBottom', $item.position().bottom);
            $item.css('top', 0);
            $item.css('bottom', 'auto');
          }
          return false;
        }
        $('.close').live('click', function() {
          $('.expanded').removeClass('expanded').
            css('top', 'auto').
            css('left', $(this).data('nonExpandedLeft')).
            css('bottom', $(this).data('nonExpandedBottom'));
          return false;
        })
      });
    },
    sort: function() {
      _.each(dynasort.axes, function(axis) {
        var furthest, axisCssProp;
        if (axis.displayDim == "x") {
          furthest = $("#graph_field").width() - 20;
          axisCssProp = "left";
        } else {
          furthest = $("#graph_field").height() - 20;
          axisCssProp = "bottom";
        }
        $('.item').each(function() {
          var $this = $(this);
          var dataPoint = dataSet.data[$this.attr("id").replace("item_", "")];
          var axisCssVal = furthest * (dataPoint[axis.dataDim.name] - axis.dataDim.range[0]) / (axis.dataDim.range[1] - axis.dataDim.range[0]);
          var animationEnd = {};
          animationEnd[axisCssProp] = axisCssVal;
          $this.css(animationEnd);
        });
      });
      $('.item').each(function() {
        var $this = $(this);
        var dataPoint = dataSet.data[$this.attr("id").replace("item_", "")];
        _.each(dataSet.columns, function(column) {
          if (column.dataType) {
            if (dataPoint[column.name] >= column.range[0] && dataPoint[column.name] <= column.range[1]) {
              dataPoint.visibleBy[column.name] = true;
            } else {
              dataPoint.visibleBy[column.name] = false;
            }
          }
        });
        if (_.all(dataPoint.visibleBy, _.identity)) {
          $this.show();
        } else {
          $this.hide();
        }
      });
    }
  },
  controllers: {
    build: function() {
      $controller_container = $('#controller_container');
      _.each(dataSet.columns, function(column) {
        if (column.dataType) {
          var controllerTitle = $('<dt>' + column.friendlyName + ':<span id="' + column.name + '_range" class="range"></span></dt>');
          if (column.dataType == "dateTime") {
            controllerTitle.children('span').append($('<span class="from"></span> - <span class="to"></span>'));
            controllerTitle.find('.from').attr("title", new Date(column.range[0] * 1000).toISOString()).html(controllerTitle.find('.from').attr('title')).timeago();
            controllerTitle.find('.to'  ).attr("title", new Date(column.range[1] * 1000).toISOString()).html(controllerTitle.find('.to').attr('title')).timeago();
          } else {
            controllerTitle.children('span').html(column.range[0] + ' - ' + column.range[1]);
          }
          controllerTitle.appendTo($controller_container);
          colMin = 0;
          colMax = 100;
          $('<dd id="' + column.name + '_slider" class="slider">').appendTo($controller_container).slider({
            range: true,
            min: column.range[0],
            max: column.range[1],
            values: column.range,
            slide: function(event, ui) {
              if (column.dataType == "dateTime") {
                var displayValues = [];
                var rangeDisplay = $('#' + column.name + '_range');
                rangeDisplay.empty().append($('<span class="from"></span> - <span class="to"></span>'));
                rangeDisplay.children('.from').attr("title", new Date(ui.values[0] * 1000).toISOString()).html(rangeDisplay.children('.from').attr('title')).timeago();
                rangeDisplay.children('.to'  ).attr("title", new Date(ui.values[1] * 1000).toISOString()).html(rangeDisplay.children('.to').attr('title')).timeago();
                //rangeDisplay.html(displayValues[0] + ' - ' + displayValues[1]);
              } else {
                $('#' + column.name + '_range').html(ui.values[0] + ' - ' + ui.values[1]);
              }
              var matchedCol = _.find(dataSet.columns, function(dataSetColumn) {
                return dataSetColumn == column;
              });
              var matchedAxis = _.find(dynasort.axes, function(axis) {
                return axis.dataDim == column;
              });
              matchedCol.range = ui.values;
              if (matchedAxis) {
                matchedAxis.setRange(column);
              }
              dynasort.points.sort();
            }
          });
        }
      });
    }
  },

  axes: []
}

function Axis(displayDim, dataDimName) {
  this.displayDim = displayDim;
  this.dataDim = _.find(dataSet.columns, function(column) {return column.name == dataDimName});
  this.domEl = $("#" + this.displayDim + "_axis");

  this.build = function() {
    var $this = this.domEl;
    var dataDim = this.dataDim;
    // build out selects
    _.each(dataSet.columns, function(column) {
      if (column.dataType) {
        var selectedTag = "";
        if (dataDim == column) {selectedTag = ' selected="selected" ';} 
        $this.find('select').append('<option value="' + column.name + '"' + selectedTag + '>' + column.friendlyName + '</option>');
      }
    });
    this.setDataDim(dataDim);
    var axisInstance = this;
    $this.find('select').change(function() {
      var $this = $(this);
      $this.hide();
      axisInstance.changeTo($this.val());
    });
  }

  this.setDataDim = function(dataDim) {
    this.domEl.find('label').html(dataDim.friendlyName);
    var configPos = this.domEl.find('.label a').css("visibility", "visible").position();
    this.domEl.find('select').css({left: configPos.left + 35, top: configPos.top - 5});
    dynasort.points.sort();
    this.setRange(dataDim);
  }

  this.setRange = function(dataDim) {
    var lowerContainer = this.domEl.children('.lower');
    var upperContainer = this.domEl.children('.upper');
    upperContainer.children('span').remove().end().append($("<span>"));
    lowerContainer.children('span').remove().end().append($("<span>"));
    var lower = this.domEl.find('.lower span');
    var upper = this.domEl.find('.upper span');
    lower.html(dataDim.range[0]);
    upper.html(dataDim.range[1]);
    if (dataDim.dataType == "dateTime") {
      lower.attr("title", new Date(lower.html() * 1000).toISOString()).html(lower.attr('title')).timeago();
      upper.attr("title", new Date(upper.html() * 1000).toISOString()).html(upper.attr('title')).timeago();
    } else {
      lower.attr("title", "");
      upper.attr("title", "");
    }
  }

  this.changeTo = function(newDataDimName) {
    this.dataDim = _.find(dataSet.columns, function(column) {return column.name == newDataDimName});
    this.setDataDim(this.dataDim);
  }
}
