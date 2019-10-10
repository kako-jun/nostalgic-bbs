const loadBBS = async () => {
  const bbs = await window.NostalgicBBS.getBBS(
    // "https://nostalgic-bbs.llll-ll.com/api/threads_and_comments"
    // "https://nostalgic-bbs.llll-ll.com/api/threads_and_comments?id=test"
    "http://localhost:42012/api/threads_and_comments"
  );

  if (bbs) {
    window.NostalgicBBS.showThreads("nostalgic-bbs-sample1", bbs, {
      dt_format: "YYYY-MM-DD HH:mm"
    });

    window.NostalgicBBS.showThread("nostalgic-bbs-sample2", bbs, 0, {
      dt_format: "YYYY-MM-DD HH:mm"
    });
  }
};

window.onload = () => {
  loadBBS();
};
