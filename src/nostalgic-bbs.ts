"use strict";
import _ from "lodash";
import moment from "moment";

interface Threads {
  thread_IDs: Array<number>;
}

interface Thread {
  id: number;
  title: string;
  comments: Array<AdminComment>;
}

interface AdminComment {
  id: number;
  dt: string;
  name: string;
  text: string;
  host: string;
  info: string;
  visible: boolean;
}

interface Comment {
  id: number;
  dt: string;
  name: string;
  text: string;
}

interface ThreadForUI {
  id: number;
  title: string;
  comments: Array<AdminComment>;
  invisible_num: number;
}

interface Option {
  pre_format: string;
  thread_format: string;
  comment_format: string;
  delimiter_format: string;
  post_format: string;
  dt_format: string;
}

class NostalgicBBS {
  constructor() {
    // instance variables
  }

  public static async getBBS(url: string) {
    const res = await fetch(url, {
      mode: "cors"
    }).catch(() => null);
    if (res) {
      const json = await res.json();
      if (json) {
        return json;
      }
    }

    return null;
  }

  public static showThreads(id: string, threads: Array<ThreadForUI>, option: Option): void {
    let pre_format = "<ul>";
    if (option && option.pre_format) {
      pre_format = option.pre_format;
    }

    let thread_format = "<li>{id} {title} {comments_num} {invisible_num} {created_at} {updated_at}</li>";
    if (option && option.thread_format) {
      thread_format = option.thread_format;
    }

    let delimiter_format = "";
    if (option && option.delimiter_format) {
      delimiter_format = option.delimiter_format;
    }

    let post_format = "</ul>";
    if (option && option.post_format) {
      post_format = option.post_format;
    }

    let dt_format = "YYYY/MM/DD HH:mm:ss";
    if (option && option.dt_format) {
      dt_format = option.dt_format;
    }

    let html = this.generateThreadsHTML(threads, pre_format, thread_format, delimiter_format, post_format, dt_format);

    const counterElement = document.getElementById(id);
    if (counterElement) {
      counterElement.innerHTML = html;
    }
  }

  public static showThread(id: string, threads: Array<ThreadForUI>, threadID: number, option: Option): void {
    let thread_format = "{id} {title} {comments_num} {invisible_num} {created_at} {updated_at}";
    if (option && option.thread_format) {
      thread_format = option.thread_format;
    }

    let pre_format = "<ul>";
    if (option && option.pre_format) {
      pre_format = option.pre_format;
    }

    let comment_format = "<li>{id} {name} {dt}<p>{text}</p></li>";
    if (option && option.comment_format) {
      comment_format = option.comment_format;
    }

    let delimiter_format = "";
    if (option && option.delimiter_format) {
      delimiter_format = option.delimiter_format;
    }

    let post_format = "</ul>";
    if (option && option.post_format) {
      post_format = option.post_format;
    }

    let dt_format = "YYYY/MM/DD HH:mm:ss";
    if (option && option.dt_format) {
      dt_format = option.dt_format;
    }

    const thread = _.find(threads, thread => {
      return thread.id === threadID;
    });

    if (thread) {
      let html = this.generateThreadHTML(
        thread,
        thread_format,
        pre_format,
        comment_format,
        delimiter_format,
        post_format,
        dt_format
      );

      const counterElement = document.getElementById(id);
      if (counterElement) {
        counterElement.innerHTML = html;
      }
    }
  }

  private static generateThreadsHTML(
    threads: Array<ThreadForUI>,
    pre_format: string,
    thread_format: string,
    delimiter_format: string,
    post_format: string,
    dt_format: string
  ): string {
    let html = "";

    html += pre_format;

    _.forEach(threads, thread => {
      let threadHTML = thread_format;
      threadHTML = this.formatThreadHTML(threadHTML, thread, dt_format);

      html += '<span class="nostalgic-bbs-thread">' + threadHTML + "</span>";
      html += delimiter_format;
    });

    html = '<span class="nostalgic-bbs-threads">' + html + "</span>";
    html += post_format;
    html = '<span class="nostalgic-bbs">' + html + "</span>";

    return html;
  }

  private static generateThreadHTML(
    thread: ThreadForUI,
    thread_format: string,
    pre_format: string,
    comment_format: string,
    delimiter_format: string,
    post_format: string,
    dt_format: string
  ): string {
    let html = "";

    let threadHTML = thread_format;
    threadHTML = this.formatThreadHTML(threadHTML, thread, dt_format);
    html += threadHTML;

    html += pre_format;

    _.forEach(thread.comments, comment => {
      let commentHTML = comment_format;
      commentHTML = this.formatCommentHTML(commentHTML, comment, dt_format);

      html += '<span class="nostalgic-bbs-comment">' + commentHTML + "</span>";
      html += delimiter_format;
    });

    html = '<span class="nostalgic-bbs-comments">' + html + "</span>";
    html += post_format;
    html = '<span class="nostalgic-bbs">' + html + "</span>";

    return html;
  }

  private static formatThreadHTML(srcHTML: string, thread: ThreadForUI, dt_format: string): string {
    let dstHTML = srcHTML;

    dstHTML = dstHTML.replace("{id}", '<span class="nostalgic-bbs-thread-id">' + thread.id + "</span>");
    dstHTML = dstHTML.replace("{title}", '<span class="nostalgic-bbs-thread-title">' + thread.title + "</span>");
    dstHTML = dstHTML.replace(
      "{comments_num}",
      '<span class="nostalgic-bbs-thread-comments-num">' + thread.comments.length + "</span>"
    );
    dstHTML = dstHTML.replace(
      "{invisible_num}",
      '<span class="nostalgic-bbs-thread-invisible-num">' + thread.invisible_num + "</span>"
    );

    if (thread.comments.length > 0) {
      const dt = new Date(thread.comments[0].dt);
      dstHTML = dstHTML.replace(
        "{created_at}",
        '<span class="nostalgic-bbs-thread-created-at">' + moment(dt.toISOString()).format(dt_format) + "</span>"
      );
    }

    if (thread.comments.length > 0) {
      const dt = new Date(thread.comments[thread.comments.length - 1].dt);
      dstHTML = dstHTML.replace(
        "{updated_at}",
        '<span class="nostalgic-bbs-thread-updated-at">' + moment(dt.toISOString()).format(dt_format) + "</span>"
      );
    }

    return dstHTML;
  }

  private static formatCommentHTML(srcHTML: string, comment: Comment, dt_format: string): string {
    let dstHTML = srcHTML;

    dstHTML = dstHTML.replace("{id}", '<span class="nostalgic-bbs-comment-id">' + comment.id + "</span>");
    dstHTML = dstHTML.replace("{name}", '<span class="nostalgic-bbs-comment-name">' + comment.name + "</span>");
    dstHTML = dstHTML.replace("{text}", '<span class="nostalgic-bbs-comment-text">' + comment.text + "</span>");

    const dt = new Date(comment.dt);
    dstHTML = dstHTML.replace(
      "{dt}",
      '<span class="nostalgic-bbs-comment-dt">' + moment(dt.toISOString()).format(dt_format) + "</span>"
    );

    return dstHTML;
  }
}

export async function getBBS(url: string) {
  return await NostalgicBBS.getBBS(url);
}

export function showThreads(id: string, threads: Array<ThreadForUI>, option: Option): void {
  NostalgicBBS.showThreads(id, threads, option);
}

export function showThread(id: string, threads: Array<ThreadForUI>, threadID: number, option: Option): void {
  NostalgicBBS.showThread(id, threads, threadID, option);
}

export default NostalgicBBS;
