const loadBBS = async () => {
  const threads = await window.NostalgicBBS.getThreads(
    // "https://nostalgic-bbs.llll-ll.com/api/threads_and_comments"
    // "https://nostalgic-bbs.llll-ll.com/api/threads_and_comments?id=test"
    "http://localhost:42012/api"
  );

  if (threads) {
    window.NostalgicBBS.showThreads("nostalgic-bbs-sample1", threads, {});

    window.NostalgicBBS.showThreadFromThreads("nostalgic-bbs-sample2", threads, 0, {});
    window.NostalgicBBS.showCommentsFromThreads("nostalgic-bbs-sample3", threads, 0, {});

    window.NostalgicBBS.showCommentForm(
      "nostalgic-bbs-sample4",
      "http://localhost:42012/api",
      0,
      {},
      "nostalgic-bbs-sample5",
      {}
    );

    window.NostalgicBBS.showThreads("nostalgic-bbs-sample6", threads, {
      pre_format:
        '<table class="table"><tr class="header"><td>ID</td><td>タイトル</a></td><td>コメント数</td><td>承認待ち<br />コメント数</td><td>作成日時</td><td>更新日時</td></tr>',
      thread_format:
        '<tr class="nb-threads-thread"><td class="center">{id}</td><td><a href="#thread-{id_without_class}">{title}</a></td><td class="center">{comments_num}</td><td class="center">{invisible_num}</td><td class="center">{created_at}</td><td class="center">{updated_at}</td></tr>',
      delimiter_format: "",
      post_format: "</table>",
      dt_format: "YYYY-MM-DD",
      sort_by: "created_at",
      sort_order: "desc"
    });

    window.NostalgicBBS.showThreadFromThreads("nostalgic-bbs-sample7", threads, 4, {
      thread_format:
        '<h2 id="thread-{id_without_class}">{title} <span class="badge badge-pill badge-primary">{comments_num}</span></h2>'
    });

    const commentsOption = {
      pre_format: "<p>コメント一覧</p>",
      comment_format: '<div class="nb-comment">{text}<p class="right">{name} {dt}</p></div>',
      delimiter_format: "<hr />",
      post_format: "",
      dt_format: "YYYY/MM/DD HH:mm",
      sort_by: "dt",
      sort_order: "desc"
    };

    window.NostalgicBBS.showCommentsFromThreads("nostalgic-bbs-sample8", threads, 4, commentsOption);

    window.NostalgicBBS.showCommentForm(
      "nostalgic-bbs-sample9",
      "http://localhost:42012/api",
      4,
      {
        pre_format: "<hr>",
        form_format:
          "<div>{name_label} {name}</div><div>{text_label}<br />{text}</div><div>{preview_button} {post_button}</div>",
        post_format: "<hr>",
        name_label: "HN:",
        name_placeholder: "※ 省略可",
        text_label: "感想:",
        text_placeholder: "",
        preview_button_text: "プレビュー",
        post_button_text: "投稿"
      },
      "nostalgic-bbs-sample8",
      commentsOption
    );
  }

  const thread = await window.NostalgicBBS.getThread("http://localhost:42012/api", 0);
  if (thread) {
    console.log(thread);
    window.NostalgicBBS.showThread("nostalgic-bbs-sample11", thread);
    window.NostalgicBBS.showComments("nostalgic-bbs-sample12", thread);
  }

  window.NostalgicBBS.showThreadForm(
    "nostalgic-bbs-sample16",
    "http://localhost:42012/api",
    {},
    "nostalgic-bbs-sample1"
  );

  window.NostalgicBBS.showThreadForm(
    "nostalgic-bbs-sample17",
    "http://localhost:42012/api",
    {
      pre_format: "<hr>",
      form_format: "<div>{title_label} {title}</div><div>{post_button}</div>",
      post_format: "<hr>",
      title_label: "タイトル:",
      title_placeholder: "",
      post_button_text: "投稿"
    },
    "nostalgic-bbs-sample6",
    {
      pre_format:
        '<table class="table"><tr class="header"><td>ID</td><td>タイトル</a></td><td>コメント数</td><td>承認待ち<br />コメント数</td><td>作成日時</td><td>更新日時</td></tr>',
      thread_format:
        '<tr class="nb-threads-thread"><td class="center">{id}</td><td><a href="#thread-{id_without_class}">{title}</a></td><td class="center">{comments_num}</td><td class="center">{invisible_num}</td><td class="center">{created_at}</td><td class="center">{updated_at}</td></tr>',
      delimiter_format: "",
      post_format: "</table>",
      dt_format: "YYYY-MM-DD",
      sort_by: "created_at",
      sort_order: "desc"
    }
  );
};

window.onload = () => {
  loadBBS();
};
