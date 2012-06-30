dataSet.columns = [
  {
    name: "rank",
    friendlyName: "Rank",
    dataType: "number"
  },
  {
    name: "created_utc",
    friendlyName: "Submitted",
    dataType: "dateTime"
  },
  {
    name: "score",
    friendlyName: "Score",
    dataType: "number"
  },
  {
    name: "num_comments",
    friendlyName: "Comments",
    dataType: "number"
  },
  {
    name: "title"
  },
  {
    name: "domain"
  },
  {
    name: "author"
  },
  {
    name: "subreddit"
  },
  {
    name: "permalink"
  },
  {
    name: "thumbnail"
  },
  {
    name: "url"
  }
]
var debugJson = {};
$.getJSON("http://www.reddit.com/r/pics.json?jsonp=?&limit=100", function(jsonData) {
  debugJson = jsonData;
  // Populate dataSet.data
  dataSet.data = [];
  _.each(jsonData.data.children, function(rawItem, ind) {
    var item = {};
    var propertiesToFind = [];
    _.each(dataSet.columns, function(column) {
      if (column.name != "rank") propertiesToFind.push(column.name);
    });
    _.each(propertiesToFind, function(property) {
      item[property] = rawItem.data[property];
    });
    item.visibleBy = {};
    item.rank = ind + 1;
    if (item.thumbnail == "") {
      if (rawItem.data.over_18) {
        item.thumbnail = "images/nsfw.png";
      } else if (rawItem.data.is_self) {
        item.thumbnail = "images/self.png";
      } else {
        item.thumbnail = "images/missing.png";
      }
    } else if (item.thumbnail == "default") {
      item.thumbnail = "images/missing.png";
    } else if (item.thumbnail == "nsfw") {
      item.thumbnail = "images/nsfw.png";
    }
    dataSet.data[ind] = item;
  });

  // Make add min and max to dataSet.columns
  _.each(dataSet.columns, function(column) {
    if (column.dataType) {
      var range = [dataSet.data[0][column.name], dataSet.data[0][column.name]];
      _.each(dataSet.data, function(item) {
        if (item[column.name] < range[0]) {range[0] = item[column.name]};
        if (item[column.name] > range[1]) {range[1] = item[column.name]};
      });
      column.range = range;
    }
  });
  dynasort.init();
});

viewTemplate = _.template('\
  <div class="thumbnail_container"><a href="<%= url %>" class="thumbnail" style="background-image: url(<%= thumbnail %>);"></a></div>\
  <div class="bd">\
    <a href="#" class="close">[x]</a>\
    <p class="header"><a href="<%= url %>" class="name"><%= title %></a> <span class="domain">(<a href="http://www.reddit.com/domain/<%= domain %>"><%= domain %></a>)</span></p>\
    <p class="meta">Submitted <span class="time_ago"><%= created_utc %></span> by <a href="http://www.reddit.com/user/<%= author %>"><%= author %></a> to <a href="http://www.reddit.com/r/<%= subreddit %>"><%= subreddit %></a></p>\
    <p class="comments"><a href="http://www.reddit.com/<%= permalink %>"><%= num_comments %> comment<% if(num_comments != "1") {print("s")} %></a></p>\
  </div>');

$(function() {
  $('.thumbnail').live('click', function() {
    var $item = $(this).parent().parent();
    console.log($item);
    if (!$item.hasClass('expanded')) {
      $('.expanded').removeClass('expanded');
      $item.addClass('expanded');
      return false;
    }
  });
  $('.close').live('click', function() {
    $(this).parent().parent().removeClass('expanded');
    return false;
  })
});
