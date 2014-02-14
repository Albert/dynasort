// GLOBALS SHARED WITH redditAssembler
var dataSet = {};
var viewTemplate;
//////

var dynasort = {
  init: function() {
    this.controllers.build();
    this.points.build();

    this.createAxes();
    this.addTooltips();

    this.bindResizeContents();
  },

  bindResizeContents: function() {
    this.resizeContents();

    var self = this;
    $(window).resize(function() {
      self.resizeContents();
    });
  },

  resizeContents: function() {
    var winHeight = $(window).height();
    var winWidth = $(window).width() - $("#control_pad").outerWidth() - 1;
    $("#y_axis").height(winHeight - 75 - 35);
    $("#graph_field").height(winHeight - 75 - 35);
    $("#graph").width(winWidth);
    $("#x_axis").width(winWidth - 75 - 35);
    $("#graph_field").width(winWidth - 75 - 35);
    this.points.sort();
  },

  createAxes: function() {
    var xAxis = new Axis("x", dataSet.columns[1].name);
    var yAxis = new Axis("y", dataSet.columns[0].name);

    dynasort.axes.push(xAxis);
    dynasort.axes.push(yAxis);

    _.each(dynasort.axes, function(axis) {
      axis.build();
    });

    // bind wrench menu
    $('.axis .label span').click(function() {
      $(this).siblings('select').toggle();
    });
  },

  addTooltips: function() {
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
    // Pull out graph_field, its used all over
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

      // live is removed in newer jquery, use on
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

