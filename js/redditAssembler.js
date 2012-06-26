dataSet.columns = [
  {
    name: "rank",
    friendlyName: "Rank",
    dataType: "number"
  },
  {
    name: "created",
    friendlyName: "Age of Post",
    dataType: "number"
  },
  {
    name: "score",
    friendlyName: "Score",
    dataType: "number"
  },
  {
    name: "num_comments",
    friendlyName: "# of Comments",
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
  },
  {
    name: "is_self"
  }
]
$.getJSON("http://www.reddit.com/.json?jsonp=?&limit=100", function(jsonData) {
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
    item.rank = ind + 1;
    dataSet.data[ind] = item;
  });
  dynasort.init();
});

viewTemplate = _.template('\
  <div class="thumbnail_container"><a href="<%= url %>" class="thumbnail" style="background-image: url(<%= thumbnail %>);"></a></div>\
  <div class="bd">\
    <a href="#" class="close">[x]</a>\
    <p class="header"><a href="<%= url %>" class="name"><%= title %></a> <span class="domain">(<a href="<%= domain %>"><%= domain %></a>)</span></p>\
    <p class="meta">Submitted <%= created %> by <a href="http://www.reddit.com/user/<%= author %>"><%= author %></a> to <a href="http://www.reddit.com/r/<%= subreddit %>"><%= subreddit %></a></p>\
    <p class="comments"><a href="http://www.reddit.com/<%= permalink %>"> comments</a></p>\
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
