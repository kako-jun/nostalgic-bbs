var threads = [];
var threadID = 0;

var redrawThreads = function() {
  var dfd = $.Deferred();

  $.ajax({
    url: serverRoot + "api/threads/comments",
    type: "GET",
    cache: false,
    dataType: "json"
  })
    .done(function(res) {
      threads = res;

      $("#threads").empty();
      _.each(threads, function(thread) {
        $("#threads").append(
          '<li value="' +
            thread.id +
            '">' +
            thread.title.ja +
            " " +
            thread.desc.ja +
            " ---- " +
            thread.comments.length +
            " コメント (承認待ち " +
            thread.invisible_num +
            ")</li>"
        );
      });
    })
    .fail(function(res) {
      alert(JSON.stringify(res));
    })
    .always(function() {
      dfd.resolve();
    });

  return dfd.promise();
};

var redrawComments = function(threadID) {
  var found = _.find(threads, function(thread) {
    return thread.id === threadID;
  });

  var comments = found.comments;

  $("#comments").empty();

  _.each(comments, function(comment) {
    if (comment.visible) {
      $("#comments").append(
        '<li value="' +
          comment.id +
          '"><button class="change-invisible btn btn-warning btn-sm"><span class="glyphicon glyphicon-unchecked"></span> 許可しない</button>' +
          comment.id +
          "<br>" +
          comment.name +
          "<br>" +
          comment.dt +
          "<br>" +
          comment.desc +
          "<br>" +
          comment.host +
          "<br>" +
          comment.country +
          "<br>" +
          JSON.stringify(comment.info) +
          '<button class="remove btn btn-danger btn-sm"><span class="glyphicon glyphicon-remove"></span> 削除する</button></li>'
      );
    } else {
      $("#comments").append(
        '<li value="' +
          comment.id +
          '"><button class="change-visible btn btn-success btn-sm"><span class="glyphicon glyphicon-check"></span> 許可する</button>' +
          comment.id +
          "<br>" +
          comment.name +
          "<br>" +
          comment.dt +
          "<br>" +
          comment.desc +
          "<br>" +
          comment.host +
          "<br>" +
          comment.country +
          "<br>" +
          JSON.stringify(comment.info) +
          '<button class="remove btn btn-danger btn-sm"><span class="glyphicon glyphicon-remove"></span> 削除する</button></li>'
      );
    }
  });
};

var updateComment = function(commentID, visible) {
  $.ajax({
    url: serverRoot + "api/threads/" + threadID + "/comments/" + commentID,
    data: {
      visible: visible,
      key: key
    },
    type: "PUT",
    cache: false,
    dataType: "json"
  })
    .done(function(res) {
      // alert(JSON.stringify(res));
      redrawThreads().always(function() {
        redrawComments(threadID);
      });
    })
    .fail(function(res) {
      alert(JSON.stringify(res));
    })
    .always(function() {});
};

$(function() {
  redrawThreads();
});

$("#threads").on("click", "li", function() {
  threadID = Number($(this).val());

  redrawComments(threadID);
});

$("#comments").on("click", ".remove", function() {
  var commentID = $(this)
    .parent()
    .val();

  $.ajax({
    url: serverRoot + "api/threads/" + threadID + "/comments/" + commentID,
    data: {
      key: key
    },
    type: "DELETE",
    cache: false,
    dataType: "json"
  })
    .done(function(res) {
      // alert(JSON.stringify(res));
      redrawThreads().always(function() {
        redrawComments(threadID);
      });
    })
    .fail(function(res) {
      alert(JSON.stringify(res));
    })
    .always(function() {});
});

$("#comments").on("click", ".change-visible", function() {
  var commentID = $(this)
    .parent()
    .val();
  updateComment(commentID, true);
});

$("#comments").on("click", ".change-invisible", function() {
  var commentID = $(this)
    .parent()
    .val();
  updateComment(commentID, false);
});

const loadBBS = async () => {
  const bbs = await window.NostalgicBBS.getBBS(
    // "https://nostalgic-bbs.llll-ll.com/api/all_comments"
    "https://nostalgic-bbs.llll-ll.com/api/all_comments?id=test"
  );

  if (bbs) {
  }
};

window.onload = () => {
  loadBBS();
};
