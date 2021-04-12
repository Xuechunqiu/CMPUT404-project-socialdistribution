import { Image, message } from "antd";
import ReactMarkdown from "react-markdown";
import {
  getAuthorByAuthorID,
  getRemoteAuthorByAuthorID,
} from "../requests/requestAuthor";
import { getFollowerList } from "../requests/requestFollower";
import { getFriendList } from "../requests/requestFriends";
import { sendPost, sendPostToUserInbox } from "../requests/requestPost";
import { domainAuthPair } from "../requests/URL";

async function getPostDataSet(postData, remote) {
  const publicPosts = [];
  for (const element of postData) {
    let domain;
    if (remote) {
      domain = getDomainName(element.author.id);
    } else {
      domain = getDomainName(element.author);
    }
    let contentHTML = <p>{element.content}</p>;
    if (element.contentType !== undefined) {
      const isImage = element.contentType.includes("image") ? true : false;
      const isMarkDown = element.contentType.includes("markdown")
        ? true
        : false;
      if (isImage) {
        contentHTML = <Image width={150} src={element.content} />;
      } else if (isMarkDown) {
        contentHTML = <ReactMarkdown source={element.content} />;
      }
    }
    let res = {};
    if (domain !== window.location.hostname) {
      // remote
      // res = await getRemoteAuthorByAuthorID({
      //   URL: element.author,
      //   auth: domainAuthPair[domain],
      // });
      res.data = element.author;
    } else {
      res = await getAuthorByAuthorID({ authorID: element.author });
    }
    let rawPost = element;
    rawPost["authorName"] = res.data.displayName;
    const obj = {
      title: element.title,
      content: <div style={{ margin: "24px" }}>{contentHTML}</div>,
      datetime: <span>{formatDate(element.published)}</span>,
      postID: element.id,
      authorName: res.data.displayName,
      github: res.data.github,
      categories: element.categories,
      rawPost: rawPost,
      remote: false,
    };
    if (domain !== window.location.hostname) {
      obj.remote = true;
    }
    publicPosts.push(obj);
  }
  return publicPosts;
}

async function getFriendDataSet(friendList) {
  const friendDataSet = [];
  for (const item of friendList) {
    const domain = getDomainName(item);
    let author;
    if (domain !== window.location.hostname) {
      author = await getRemoteAuthorByAuthorID({
        URL: item,
        auth: domainAuthPair[domain],
      });
    } else {
      author = await getAuthorByAuthorID({ authorID: item });
    }
    const obj = {
      displayName: author.data.displayName,
      github: author.data.github,
      id: author.data.id,
    };
    friendDataSet.push(obj);
  }
  return friendDataSet;
}

async function getLikeDataSet(likeData, remote) {
  const likeArray = [];
  for (const like of likeData) {
    let domain;
    domain = getDomainName(like.author);
    let authorInfo;
    if (domain !== window.location.hostname) {
      authorInfo = await getRemoteAuthorByAuthorID({
        URL: like.author,
        auth: domainAuthPair[domain],
      });
    } else {
      authorInfo = await getAuthorByAuthorID({
        authorID: like.author,
      });
    }
    likeArray.push({
      authorName: authorInfo.data.displayName,
      authorID: authorInfo.data.id,
      summary: like.summary,
    });
  }
  return likeArray;
}

function getDomainName(url) {
  return new URL(url).hostname;
}

async function sendPostAndAppendInbox(params) {
  //create a post object
  sendPost(params).then((response) => {
    if (response.status === 200) {
      message.success("Post sent!");
      const postData = response.data;
      //team20 asked us to add
      postData.object = response.data.id;
      postData.actor = response.data.author;
      //if public, send to followers' inbox
      if (params.visibility === "PUBLIC") {
        getFollowerList({ object: params.authorID }).then((res) => {
          if (res.data.items.length !== 0) {
            for (const follower_id of res.data.items) {
              //send inbox
              let params_ = {
                URL: `${follower_id}/inbox/`,
                auth: domainAuthPair[getDomainName(`${follower_id}/inbox/`)],
                body: postData,
              };
              sendPostToUserInbox(params_).then((response) => {
                if (response.status === 200) {
                  message.success("Post shared!");
                  window.location.href = "/";
                } else {
                  message.error("Whoops, an error occurred while sharing.");
                }
              });
            }
          } else {
            window.location.href = "/";
          }
        });
      } else {
        //if private, send to friends' inbox
        getFriendList({ object: params.authorID }).then((res) => {
          if (res.data.items.length !== 0) {
            for (const friend_id of res.data.items) {
              let domain = getDomainName(friend_id);
              if (domain !== window.location.hostname) {
                // remote
                //send to friend inbox
                let params_ = {
                  URL: `${friend_id}/inbox/`,
                  auth: domainAuthPair[domain],
                  body: postData,
                };
                sendPostToUserInbox(params_).then((response) => {
                  if (response.status === 200) {
                    message.success("Post shared!");
                    window.location.href = "/";
                  } else {
                    message.error(
                      "Whoops, an error occurred while sending the private post."
                    );
                  }
                });
              } else {
                let params_ = {
                  URL: `${friend_id}/inbox/`,
                  body: postData,
                };
                sendPostToUserInbox(params_).then((response) => {
                  if (response.status === 200) {
                    message.success("Post shared!");
                    window.location.href = "/";
                  } else {
                    message.error(
                      "Whoops, an error occurred while sending the private post."
                    );
                  }
                });
              }
            }
          } else {
            window.location.href = "/";
          }
        });
      }
    } else {
      message.error("Post failed!");
    }
  });
}

function formatDate(timestamp) {
  var date = new Date(timestamp);
  var YY = date.getFullYear() + "-";
  var MM =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hh =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var mm =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return YY + MM + DD + " " + hh + mm + ss;
}

function generateRandomAvatar(name) {
  return "https://ui-avatars.com/api/?background=random&name=" + name;
}

export {
  getPostDataSet,
  getFriendDataSet,
  getLikeDataSet,
  getDomainName,
  sendPostAndAppendInbox,
  formatDate,
  generateRandomAvatar,
};
