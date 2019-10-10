const loadBBS = async () => {
  const bbs = await window.NostalgicBBS.getBBS(
    // "https://nostalgic-bbs.llll-ll.com/api/threads_and_comments"
    // "https://nostalgic-bbs.llll-ll.com/api/threads_and_comments?id=test"
    "http://localhost:42012/api/threads_and_comments"
  );

  if (bbs) {
    window.NostalgicBBS.showThreads("nostalgic-bbs-sample1", bbs, {});

    window.NostalgicBBS.showThread("nostalgic-bbs-sample2", bbs, 0, {});

    window.NostalgicBBS.showForm("nostalgic-bbs-sample3", "nostalgic-bbs-sample2", 0, {});

    window.NostalgicBBS.showThreads("nostalgic-bbs-sample6", bbs, {
      pre_format:
        '<table class="table nostalgic-bbs-threads"><tr class="header"><td>ID</td><td>タイトル</a></td><td>コメント数</td><td>承認待ち<br />コメント数</td><td>作成日時</td><td>更新日時</td></tr>',
      thread_format:
        '<tr class="nostalgic-bbs-thread"><td class="center">{id}</td><td><a href="#thread-{id_without_class}">{title}</a></td><td class="center">{comments_num}</td><td class="center">{invisible_num}</td><td class="center">{created_at}</td><td class="center">{updated_at}</td></tr>',
      delimiter_format: "",
      post_format: "</table>",
      dt_format: "YYYY-MM-DD"
    });

    window.NostalgicBBS.showThread("nostalgic-bbs-sample7", bbs, 4, {
      thread_format:
        '<h2 id="thread-{id_without_class}" class="nostalgic-bbs-thread">{title} <span class="badge badge-pill badge-primary">{comments_num}</span></h2>',
      pre_format: '<p>コメント一覧</p><div class="nostalgic-bbs-comments">',
      comment_format: '<div class="nostalgic-bbs-comment">{text}<p class="right">{name} {dt}</p></div>',
      delimiter_format: "<hr />",
      post_format: "</div>",
      dt_format: "YYYY/MM/DD HH:mm"
    });

    // window.NostalgicBBS.showForm("nostalgic-bbs-sample8", "nostalgic-bbs-sample7", 4, {});
  }
};

window.onload = () => {
  loadBBS();
};
