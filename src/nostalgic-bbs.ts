"use strict";
import _ from "lodash";
import moment, { relativeTimeRounding } from "moment";

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
  thread_format: string;
  comment_format: string;
  form_format: string;
  pre_format: string;
  delimiter_format: string;
  post_format: string;
  dt_format: string;
  sort_by: string;
  sort_order: string;
  title_label: string;
  title_placeholder: string;
  name_label: string;
  name_placeholder: string;
  text_label: string;
  text_placeholder: string;
  preview_button_text: string;
  post_button_text: string;
}

class NostalgicBBS {
  constructor() {
    // instance variables
  }

  public static async getThreads(url: string) {
    const res = await fetch(url + "/threads", {
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

  public static async getThread(url: string, threadID: number) {
    const res = await fetch(url + "/threads/" + threadID, {
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

  public static showThreads(targetID: string, threads: Array<ThreadForUI>, option: Option): void {
    let pre_format = "<ul>";
    if (option && option.pre_format) {
      pre_format = option.pre_format;
    }

    let thread_format =
      '<li class="nb-threads-thread"><a href="#thread-{id_without_class}">{id}: {title} ({comments_num})</a></li>';
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

    let sort_by = "id";
    if (option && option.sort_by) {
      sort_by = option.sort_by;
    }

    let sort_order = "asc";
    if (option && option.sort_order) {
      sort_order = option.sort_order;
    }

    let html = this.generateThreadsHTML(
      threads,
      pre_format,
      thread_format,
      delimiter_format,
      post_format,
      dt_format,
      sort_by,
      sort_order
    );

    const targetElement = document.getElementById(targetID);
    if (targetElement) {
      targetElement.innerHTML = html;
    }
  }

  public static showThread(targetID: string, thread: ThreadForUI, option: Option): void {
    let pre_format = "";
    if (option && option.pre_format) {
      pre_format = option.pre_format;
    }

    let thread_format = '<h1 id="thread-{id_without_class}">{title}</h1>';
    if (option && option.thread_format) {
      thread_format = option.thread_format;
    }

    let post_format = "";
    if (option && option.post_format) {
      post_format = option.post_format;
    }

    let dt_format = "YYYY/MM/DD HH:mm:ss";
    if (option && option.dt_format) {
      dt_format = option.dt_format;
    }

    let html = this.generateThreadHTML(thread, pre_format, thread_format, post_format, dt_format);

    const targetElement = document.getElementById(targetID);
    if (targetElement) {
      targetElement.innerHTML = html;
    }
  }

  public static showThreadFromThreads(
    targetID: string,
    threads: Array<ThreadForUI>,
    threadID: number,
    option: Option
  ): void {
    const thread = _.find(threads, thread => {
      return thread.id === threadID;
    });

    if (thread) {
      this.showThread(targetID, thread, option);
    }
  }

  public static showComments(targetID: string, thread: ThreadForUI, option: Option): void {
    let pre_format = "<ul>";
    if (option && option.pre_format) {
      pre_format = option.pre_format;
    }

    let comment_format = '<li class="nb-comment">{id} {name} {dt}<p class="text">{text}</p></li>';
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

    let sort_by = "id";
    if (option && option.sort_by) {
      sort_by = option.sort_by;
    }

    let sort_order = "asc";
    if (option && option.sort_order) {
      sort_order = option.sort_order;
    }

    let html = this.generateCommentsHTML(
      thread,
      pre_format,
      comment_format,
      delimiter_format,
      post_format,
      dt_format,
      sort_by,
      sort_order
    );

    const targetElement = document.getElementById(targetID);
    if (targetElement) {
      targetElement.innerHTML = html;
    }
  }

  public static showCommentsFromThreads(
    targetID: string,
    threads: Array<ThreadForUI>,
    threadID: number,
    option: Option
  ): void {
    const thread = _.find(threads, thread => {
      return thread.id === threadID;
    });

    if (thread) {
      this.showComments(targetID, thread, option);
    }
  }

  public static showThreadForm(
    targetID: string,
    url: string,
    formOption: Option,
    updateTargetID: string,
    threadsOption: Option
  ): void {
    let pre_format = "";
    if (formOption && formOption.pre_format) {
      pre_format = formOption.pre_format;
    }

    let form_format = '<div>{title}</div><div class="right">{post_button}</div>';
    if (formOption && formOption.form_format) {
      form_format = formOption.form_format;
    }

    let post_format = "";
    if (formOption && formOption.post_format) {
      post_format = formOption.post_format;
    }

    let title_label = "";
    if (formOption && formOption.title_label) {
      title_label = formOption.title_label;
    }

    let title_placeholder = "Title";
    if (formOption && formOption.title_placeholder) {
      title_placeholder = formOption.title_placeholder;
    }

    let post_button_text = "Post";
    if (formOption && formOption.post_button_text) {
      post_button_text = formOption.post_button_text;
    }

    let html = this.generateThreadFormHTML(
      pre_format,
      form_format,
      post_format,
      title_label,
      title_placeholder,
      post_button_text
    );

    const targetElement = document.getElementById(targetID);
    if (targetElement) {
      targetElement.innerHTML = html;

      const addClickEventListener = (type: string) => {
        let command = "";
        let buttonElement = null;

        switch (type) {
          case "post": {
            command = "new";
            const buttonElements = targetElement.getElementsByClassName("nb-form-post-button");
            if (buttonElements.length > 0) {
              buttonElement = buttonElements[0];
            }
            break;
          }
          default:
            return;
        }

        if (buttonElement) {
          buttonElement.addEventListener("click", async () => {
            let title = "";
            const titleElements = targetElement.getElementsByClassName("nb-form-title");
            if (titleElements.length > 0) {
              const titleElement: any = titleElements[0];
              title = encodeURIComponent(titleElement.value);
            }

            const res = await fetch(url + "/threads/" + command + "?title=" + title, {
              mode: "cors"
            }).catch(() => null);
            if (res) {
              const json = await res.json();
              console.log(json);
              if (json && !json.error) {
                this.showThreads(updateTargetID, json, threadsOption);
              }
            }
          });
        }
      };

      addClickEventListener("post");
    }
  }

  public static showCommentForm(
    targetID: string,
    url: string,
    threadID: number,
    formOption: Option,
    updateTargetID: string,
    commentsOption: Option
  ): void {
    let pre_format = "";
    if (formOption && formOption.pre_format) {
      pre_format = formOption.pre_format;
    }

    let form_format = '<div>{name}</div><div>{text}</div><div class="right">{post_button}</div>';
    if (formOption && formOption.form_format) {
      form_format = formOption.form_format;
    }

    let post_format = "";
    if (formOption && formOption.post_format) {
      post_format = formOption.post_format;
    }

    let name_label = "";
    if (formOption && formOption.name_label) {
      name_label = formOption.name_label;
    }

    let name_placeholder = "Name";
    if (formOption && formOption.name_placeholder) {
      name_placeholder = formOption.name_placeholder;
    }

    let text_label = "";
    if (formOption && formOption.text_label) {
      text_label = formOption.text_label;
    }

    let text_placeholder = "What are your thoughts?";
    if (formOption && formOption.text_placeholder) {
      text_placeholder = formOption.text_placeholder;
    }

    let preview_button_text = "Preview";
    if (formOption && formOption.preview_button_text) {
      preview_button_text = formOption.preview_button_text;
    }

    let post_button_text = "Comment";
    if (formOption && formOption.post_button_text) {
      post_button_text = formOption.post_button_text;
    }

    let html = this.generateCommentFormHTML(
      pre_format,
      form_format,
      post_format,
      name_label,
      name_placeholder,
      text_label,
      text_placeholder,
      preview_button_text,
      post_button_text
    );

    const targetElement = document.getElementById(targetID);
    if (targetElement) {
      targetElement.innerHTML = html;

      const addClickEventListener = (type: string) => {
        let command = "";
        let buttonElement = null;

        switch (type) {
          case "preview": {
            command = "preview";
            const buttonElements = targetElement.getElementsByClassName("nb-form-preview-button");
            if (buttonElements.length > 0) {
              buttonElement = buttonElements[0];
            }
            break;
          }
          case "post": {
            command = "new";
            const buttonElements = targetElement.getElementsByClassName("nb-form-post-button");
            if (buttonElements.length > 0) {
              buttonElement = buttonElements[0];
            }
            break;
          }
          default:
            return;
        }

        if (buttonElement) {
          buttonElement.addEventListener("click", async () => {
            let name = "";
            const nameElements = targetElement.getElementsByClassName("nb-form-name");
            if (nameElements.length > 0) {
              const nameElement: any = nameElements[0];
              name = encodeURIComponent(nameElement.value);
            }

            let text = "";
            const textElements = targetElement.getElementsByClassName("nb-form-text");
            if (textElements.length > 0) {
              const textElement: any = textElements[0];
              text = encodeURIComponent(textElement.value);
            }

            const res = await fetch(
              url + "/threads/" + threadID + "/comments/" + command + "?name=" + name + "&text=" + text,
              {
                mode: "cors"
              }
            ).catch(() => null);
            if (res) {
              const json = await res.json();
              if (json && !json.error) {
                this.showComments(updateTargetID, json, commentsOption);
              }
            }
          });
        }
      };

      addClickEventListener("preview");
      addClickEventListener("post");
    }
  }

  private static generateThreadsHTML(
    threads: Array<ThreadForUI>,
    pre_format: string,
    thread_format: string,
    delimiter_format: string,
    post_format: string,
    dt_format: string,
    sort_by: string,
    sort_order: string
  ): string {
    let html = "";

    html += pre_format;

    let sortedThreads = threads;
    switch (sort_by) {
      case "id":
        sortedThreads = _.sortBy(threads, thread => {
          return thread.id;
        });
        break;
      case "title":
        sortedThreads = _.sortBy(threads, thread => {
          return thread.title;
        });
        break;
      case "comments_num":
        sortedThreads = _.sortBy(threads, thread => {
          return thread.comments.length;
        });
        break;
      case "invisible_num":
        sortedThreads = _.sortBy(threads, thread => {
          return thread.invisible_num;
        });
        break;
      case "created_at":
        sortedThreads = _.sortBy(threads, thread => {
          if (thread.comments.length > 0) {
            return thread.comments[0].dt;
          }
          return 0;
        });
        break;
      case "updated_at":
        sortedThreads = _.sortBy(threads, thread => {
          if (thread.comments.length > 0) {
            return thread.comments[thread.comments.length - 1].dt;
          }
          return 0;
        });
        break;
    }

    if (sort_order === "desc") {
      sortedThreads = _.reverse(sortedThreads);
    }

    _.forEach(sortedThreads, thread => {
      let threadHTML = thread_format;
      threadHTML = this.formatThreadsThreadHTML(threadHTML, thread, dt_format);
      html += threadHTML;

      html += delimiter_format;
    });

    html += post_format;
    html = '<div class="nb-threads">' + html + "</div>";
    html = '<div class="nostalgic-bbs">' + html + "</div>";

    return html;
  }

  private static generateThreadHTML(
    thread: ThreadForUI,
    pre_format: string,
    thread_format: string,
    post_format: string,
    dt_format: string
  ): string {
    let html = "";

    html += pre_format;

    let threadHTML = thread_format;
    threadHTML = this.formatThreadHTML(threadHTML, thread, dt_format);
    html += threadHTML;

    html += post_format;
    html = '<div class="nb-thread">' + html + "</div>";
    html = '<div class="nostalgic-bbs">' + html + "</div>";

    return html;
  }

  private static generateCommentsHTML(
    thread: ThreadForUI,
    pre_format: string,
    comment_format: string,
    delimiter_format: string,
    post_format: string,
    dt_format: string,
    sort_by: string,
    sort_order: string
  ): string {
    let html = "";

    html += pre_format;

    let sortedComments = thread.comments;
    switch (sort_by) {
      case "id":
        sortedComments = _.sortBy(thread.comments, comment => {
          return comment.id;
        });
        break;
      case "dt":
        sortedComments = _.sortBy(thread.comments, comment => {
          return comment.dt;
        });
        break;
    }

    if (sort_order === "desc") {
      sortedComments = _.reverse(sortedComments);
    }

    _.forEach(sortedComments, comment => {
      let commentHTML = comment_format;
      commentHTML = this.formatCommentHTML(commentHTML, comment, dt_format);
      html += commentHTML;

      html += delimiter_format;
    });

    html += post_format;
    html = '<div class="nb-comments">' + html + "</div>";
    html = '<div class="nostalgic-bbs">' + html + "</div>";

    return html;
  }

  private static generateThreadFormHTML(
    pre_format: string,
    form_format: string,
    post_format: string,
    title_label: string,
    title_placeholder: string,
    post_button_text: string
  ): string {
    let html = "";

    html += pre_format;

    let formHTML = form_format;
    formHTML = this.formatThreadFormHTML(formHTML, title_label, title_placeholder, post_button_text);
    html += formHTML;

    html += post_format;
    html = '<div class="nb-form">' + html + "</div>";
    html = '<div class="nostalgic-bbs">' + html + "</div>";

    return html;
  }

  private static generateCommentFormHTML(
    pre_format: string,
    form_format: string,
    post_format: string,
    name_label: string,
    name_placeholder: string,
    text_label: string,
    text_placeholder: string,
    preview_button_text: string,
    post_button_text: string
  ): string {
    let html = "";

    html += pre_format;

    let formHTML = form_format;
    formHTML = this.formatCommentFormHTML(
      formHTML,
      name_label,
      name_placeholder,
      text_label,
      text_placeholder,
      preview_button_text,
      post_button_text
    );
    html += formHTML;

    html += post_format;
    html = '<div class="nb-form">' + html + "</div>";
    html = '<div class="nostalgic-bbs">' + html + "</div>";

    return html;
  }

  private static formatThreadsThreadHTML(srcHTML: string, thread: ThreadForUI, dt_format: string): string {
    let dstHTML = srcHTML;

    dstHTML = dstHTML.replace(/{id}/g, '<span class="nb-threads-thread-id">' + thread.id + "</span>");
    dstHTML = dstHTML.replace(/{id_without_class}/g, String(thread.id));
    dstHTML = dstHTML.replace(/{title}/g, '<span class="nb-threads-thread-title">' + thread.title + "</span>");
    dstHTML = dstHTML.replace(/{title_without_class}/g, String(thread.title));
    dstHTML = dstHTML.replace(
      /{comments_num}/g,
      '<span class="nb-threads-thread-comments-num">' + thread.comments.length + "</span>"
    );
    dstHTML = dstHTML.replace(
      /{invisible_num}/g,
      '<span class="nb-threads-thread-invisible-num">' + thread.invisible_num + "</span>"
    );

    if (thread.comments.length > 0) {
      const dt = new Date(thread.comments[0].dt);
      dstHTML = dstHTML.replace(
        /{created_at}/g,
        '<span class="nb-threads-thread-created-at">' + moment(dt.toISOString()).format(dt_format) + "</span>"
      );
    }

    if (thread.comments.length > 0) {
      const dt = new Date(thread.comments[thread.comments.length - 1].dt);
      dstHTML = dstHTML.replace(
        /{updated_at}/g,
        '<span class="nb-threads-thread-updated-at">' + moment(dt.toISOString()).format(dt_format) + "</span>"
      );
    }

    return dstHTML;
  }

  private static formatThreadHTML(srcHTML: string, thread: ThreadForUI, dt_format: string): string {
    let dstHTML = srcHTML;

    dstHTML = dstHTML.replace(/{id}/g, '<span class="nb-thread-id">' + thread.id + "</span>");
    dstHTML = dstHTML.replace(/{id_without_class}/g, String(thread.id));
    dstHTML = dstHTML.replace(/{title}/g, '<span class="nb-thread-title">' + thread.title + "</span>");
    dstHTML = dstHTML.replace(/{title_without_class}/g, String(thread.title));
    dstHTML = dstHTML.replace(
      /{comments_num}/g,
      '<span class="nb-thread-comments-num">' + thread.comments.length + "</span>"
    );
    dstHTML = dstHTML.replace(
      /{invisible_num}/g,
      '<span class="nb-thread-invisible-num">' + thread.invisible_num + "</span>"
    );

    if (thread.comments.length > 0) {
      const dt = new Date(thread.comments[0].dt);
      dstHTML = dstHTML.replace(
        /{created_at}/g,
        '<span class="nb-thread-created-at">' + moment(dt.toISOString()).format(dt_format) + "</span>"
      );
    }

    if (thread.comments.length > 0) {
      const dt = new Date(thread.comments[thread.comments.length - 1].dt);
      dstHTML = dstHTML.replace(
        /{updated_at}/g,
        '<span class="nb-thread-updated-at">' + moment(dt.toISOString()).format(dt_format) + "</span>"
      );
    }

    return dstHTML;
  }

  private static formatCommentHTML(srcHTML: string, comment: Comment, dt_format: string): string {
    let dstHTML = srcHTML;

    dstHTML = dstHTML.replace(/{id}/g, '<span class="nb-comment-id">' + comment.id + "</span>");
    dstHTML = dstHTML.replace(/{name}/g, '<span class="nb-comment-name">' + comment.name + "</span>");
    dstHTML = dstHTML.replace(/{text}/g, '<span class="nb-comment-text">' + comment.text + "</span>");

    const dt = new Date(comment.dt);
    dstHTML = dstHTML.replace(
      /{dt}/g,
      '<span class="nb-comment-dt">' + moment(dt.toISOString()).format(dt_format) + "</span>"
    );

    return dstHTML;
  }

  private static formatThreadFormHTML(
    srcHTML: string,
    title_label: string,
    title_placeholder: string,
    post_button_text: string
  ): string {
    let dstHTML = srcHTML;

    dstHTML = dstHTML.replace(/{title_label}/g, '<label class="nb-form-title-label">' + title_label + "</label>");
    dstHTML = dstHTML.replace(/{title}/g, '<input class="nb-form-title" placeholder="' + title_placeholder + '">');
    dstHTML = dstHTML.replace(
      /{post_button}/g,
      '<button class="nb-form-post-button">' + post_button_text + "</button>"
    );

    return dstHTML;
  }

  private static formatCommentFormHTML(
    srcHTML: string,
    name_label: string,
    name_placeholder: string,
    text_label: string,
    text_placeholder: string,
    preview_button_text: string,
    post_button_text: string
  ): string {
    let dstHTML = srcHTML;

    dstHTML = dstHTML.replace(/{name_label}/g, '<label class="nb-form-name-label">' + name_label + "</label>");
    dstHTML = dstHTML.replace(/{name}/g, '<input class="nb-form-name" placeholder="' + name_placeholder + '">');
    dstHTML = dstHTML.replace(/{text_label}/g, '<label class="nb-form-text-label">' + text_label + "</label>");
    dstHTML = dstHTML.replace(
      /{text}/g,
      '<textarea class="nb-form-text" placeholder="' + text_placeholder + '"></textarea>'
    );
    dstHTML = dstHTML.replace(
      /{preview_button}/g,
      '<button class="nb-form-preview-button">' + preview_button_text + "</button>"
    );
    dstHTML = dstHTML.replace(
      /{post_button}/g,
      '<button class="nb-form-post-button">' + post_button_text + "</button>"
    );

    return dstHTML;
  }
}

export async function getThreads(url: string) {
  return await NostalgicBBS.getThreads(url);
}

export async function getThread(url: string, threadID: number) {
  return await NostalgicBBS.getThread(url, threadID);
}

export function showThreads(targetID: string, threads: Array<ThreadForUI>, option: Option): void {
  NostalgicBBS.showThreads(targetID, threads, option);
}

export function showThread(targetID: string, thread: ThreadForUI, option: Option): void {
  NostalgicBBS.showThread(targetID, thread, option);
}

export function showThreadFromThreads(
  targetID: string,
  threads: Array<ThreadForUI>,
  threadID: number,
  option: Option
): void {
  NostalgicBBS.showThreadFromThreads(targetID, threads, threadID, option);
}

export function showComments(targetID: string, thread: ThreadForUI, option: Option): void {
  NostalgicBBS.showComments(targetID, thread, option);
}

export function showCommentsFromThreads(
  targetID: string,
  threads: Array<ThreadForUI>,
  threadID: number,
  option: Option
): void {
  NostalgicBBS.showCommentsFromThreads(targetID, threads, threadID, option);
}

export function showThreadForm(
  targetID: string,
  url: string,
  formOption: Option,
  updateTargetID: string,
  threadsOption: Option
): void {
  NostalgicBBS.showThreadForm(targetID, url, formOption, updateTargetID, threadsOption);
}

export function showCommentForm(
  targetID: string,
  url: string,
  threadID: number,
  formOption: Option,
  updateTargetID: string,
  commentsOption: Option
): void {
  NostalgicBBS.showCommentForm(targetID, url, threadID, formOption, updateTargetID, commentsOption);
}

export default NostalgicBBS;
