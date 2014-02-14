function Axis(displayDim, dataDimName) {
  this.displayDim = displayDim;
  this.dataDim = _.find(dataSet.columns, function(column) {return column.name == dataDimName});
  this.domEl = $("#" + this.displayDim + "_axis");
}

Axis.prototype.build = function() {
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

Axis.prototype.setDataDim = function(dataDim) {
  this.domEl.find('label').html(dataDim.friendlyName);
  var configPos = this.domEl.find('.label a').css("visibility", "visible").position();
  this.domEl.find('select').css({left: configPos.left + 35, top: configPos.top - 5});
  dynasort.points.sort();
  this.setRange(dataDim);
}

Axis.prototype.setRange = function(dataDim) {
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

Axis.prototype.changeTo = function(newDataDimName) {
  this.dataDim = _.find(dataSet.columns, function(column) {return column.name == newDataDimName});
  this.setDataDim(this.dataDim);
}
