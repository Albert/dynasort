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
});

viewTemplate = _.template('\
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
