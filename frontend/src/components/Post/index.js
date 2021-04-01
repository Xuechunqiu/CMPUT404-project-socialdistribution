import React from "react";
import {
  Input,
  Button,
  Checkbox,
  Tag,
  message,
  Upload,
  Modal,
  Switch,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getPost, sendPost, updatePost, sendPostToUserInbox } from "../../requests/requestPost";
import { 
  getFollowerList,
  getFollower,
} from "../../requests/requestFollower";
import {
  getAuthorByAuthorID,
  getRemoteAuthorByAuthorID,
} from "../../requests/requestAuthor";
import { getHostname } from "../Utils";
import { auth } from "../../requests/URL";
const { TextArea } = Input;
const { CheckableTag } = Tag;
const tagsData = ["Movies", "Books", "Music", "Sports", "Life"];

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      username: this.props.username,
      authorID: this.props.authorID,
      title: "",
      content: "",
      visibility: true,
      description: "",
      categories: [],
      previewVisible: false,
      previewImage: "",
      fileList: [],
      previewTitle: "",
      isMarkDown: false,
      imageLink: "",
      postObj: null,
    };
  }

  componentDidMount() {
    if (this.props.postID !== undefined && this.props.enableEdit) {
      getPost({ postID: this.props.postID }).then((res) => {
        this.setState({
          postObj: res.data,
          title: res.data.title,
          description: res.data.description,
          content: res.data.content,
        });
      });
    }
  }

  onTitleChange = ({ target: { value } }) => {
    this.setState({ title: value });
  };

  onDescriptionChange = ({ target: { value } }) => {
    this.setState({ description: value });
  };

  onContentChange = ({ target: { value } }) => {
    this.setState({ content: value });
  };

  onLinkChange = ({ target: { value } }) => {
    this.setState({ imageLink: value });
  };

  // image upload
  handleImageCancel = () => this.setState({ previewVisible: false });

  handleImagePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  handleImageChange = ({ fileList }) => this.setState({ fileList });

  handleSendPost = async () => {
    const source = this.state.authorID;
    //['type', 'title', 'id', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories', 'count', 'size', 'comments', 'published', 'visibility', 'unlisted']
    let params = {
      type: "post",
      title: this.state.title,
      source: source,
      origin: source,
      description: this.state.description,
      contentType: "text/plain",
      content: this.state.content,
      categories: this.state.categories,
      count: 0,
      size: 0,
      visibility: this.state.visibility ? "PUBLIC" : "FRIENDS",
      unlisted: false,
      authorID: this.state.authorID,
      author: this.state.authorID,
    };

    if (params.content.length > 0) {
      if (this.state.isMarkDown) {
        params.contentType = "text/markdown";
      }
      if (this.props.enableEdit) {
        params.postID = this.props.postID;
        updatePost(params).then((response) => {
          if (response.status === 204 || response.status === 200) {
            message.success("Edit success!");
            window.location.href = "/";
          } else {
            message.error("Edit failed!");
          }
        });
      } else {
        //create a post object
        sendPost(params).then((response) => {
          if (response.status === 200) {
            message.success("Post sent!");
            window.location.href = "/";
          } else {
            message.error("Post failed!");
          }
        });
        //if public, send to followers' inbox
        if (this.state.visibility){
          getFollowerList({ object: this.state.authorID }).then((res) => {
            if (res.data.items.length !== 0) {
              for (const follower_id of res.data.items) {
                //send inbox
                let params_ = {
                  URL: `${follower_id}/inbox/box/`,
                  auth: auth,
                  body: params,
                }
                sendPostToUserInbox(params_).then((response) => {
                  if (response.status === 200) {
                    message.success("Post shared!");
                    window.location.reload();
                  } else {
                    message.error("Whoops, an error occurred while sharing.");
                  }
                });
              }
            }
          });
        }else {
                //if private, send to friends' inbox
                getFollowerList({ object: this.state.authorID }).then((res) => {
                  if (res.data.items.length !== 0) {
                    for (const follower_id of res.data.items) {
                      let host = getHostname(follower_id);
                      let n = this.state.authorID.indexOf("/author/");
                      let length = this.state.authorID.length;
                      let param = {
                          actor: this.state.authorID.substring(n + 8, length),
                          object: follower_id,
                        }
                      if (host !== window.location.hostname) {
                        param.remote = true;
                        param.auth = auth;
                        getFollower(param).then((response) => {
                          if (response.data.exist) {
                            //send to friend inbox
                            let params_ = {
                              URL: `${follower_id}/inbox/box/`,
                              auth: auth,
                              body: params,
                            }
                            sendPostToUserInbox(params_).then((response) => {
                              if (response.status === 200) {
                                message.success("Post shared!");
                                window.location.reload();
                              } else {
                                message.error("Whoops, an error occurred while sharing.");
                              }
                            });   
                          }
                        });
                      } else {
                        param.auth = auth;
                        param.remote = false;
                        getFollower(param).then((response) => {
                          if (response.data.exist) {
                            // send to friend inbox
                            let params_ = {
                              URL: `${follower_id}/inbox/box/`,
                              auth: auth,
                              body: params,
                            }
                            sendPostToUserInbox(params_).then((response) => {
                              if (response.status === 200) {
                                message.success("Post shared!");
                                window.location.reload();
                              } else {
                                message.error("Whoops, an error occurred while sharing.");
                              }
                            });
                          }
                        });
                      }
                    }
                  }
                });
             }
        //end
      }
    }
    // if image link given
    if (this.state.imageLink.length > 0) {
      params.contentType = "image/*";
      params.content = this.state.imageLink;
      // if this image is for another post
      if (this.state.content.length > 0) {
        params.unlisted = true;
      }
      // send seperate post for image
      if (this.props.enableEdit) {
        params.postID = this.props.postID;
        updatePost(params).then((response) => {
          if (response.status === 200 || response.status === 204) {
            message.success("Edit success!");
            window.location.href = "/";
          } else {
            message.error("Edit failed!");
          }
        });
      } else {
        sendPost(params).then((response) => {
          if (response.status === 200) {
            message.success("Post sent!");
            window.location.href = "/";
          } else {
            message.error("Post failed!");
          }
        });
        //if public, send to followers' inbox
        if (this.state.visibility){
          getFollowerList({ object: this.state.authorID }).then((res) => {
            if (res.data.items.length !== 0) {
              for (const follower_id of res.data.items) {
                //send inbox
                let params_ = {
                  URL: `${follower_id}/inbox/box/`,
                  auth: auth,
                  body: params,
                }
                sendPostToUserInbox(params_).then((response) => {
                  if (response.status === 200) {
                    message.success("Post shared!");
                    window.location.reload();
                  } else {
                    message.error("Whoops, an error occurred while sharing.");
                  }
                });
              }
            }
          });
        }else {
                //if private, send to friends' inbox
                getFollowerList({ object: this.state.authorID }).then((res) => {
                  if (res.data.items.length !== 0) {
                    for (const follower_id of res.data.items) {
                      let host = getHostname(follower_id);
                      let n = this.state.authorID.indexOf("/author/");
                      let length = this.state.authorID.length;
                      let param = {
                          actor: this.state.authorID.substring(n + 8, length),
                          object: follower_id,
                        }
                      if (host !== window.location.hostname) {
                        param.remote = true;
                        param.auth = auth;
                        getFollower(param).then((response) => {
                          if (response.data.exist) {
                            getRemoteAuthorByAuthorID({
                              URL: follower_id,
                              auth: auth,
                            }).then((response2) => {
                              //send to friend inbox
                              let params_ = {
                                URL: `${follower_id}/inbox/box/`,
                                auth: auth,
                                body: params,
                              }
                              sendPostToUserInbox(params_).then((response) => {
                                if (response.status === 200) {
                                  message.success("Post shared!");
                                  window.location.reload();
                                } else {
                                  message.error("Whoops, an error occurred while sharing.");
                                }
                              });
                            });               
                          }
                        });
                      } else {
                        param.auth = auth;
                        param.remote = false;
                        getFollower(param).then((response) => {
                          if (response.data.exist) {
                            getAuthorByAuthorID({
                              authorID: follower_id,
                            }).then((response2) => {
                              // send to friend inbox
                              let params_ = {
                                URL: `${follower_id}/inbox/box/`,
                                auth: auth,
                                body: params,
                              }
                              sendPostToUserInbox(params_).then((response) => {
                                if (response.status === 200) {
                                  message.success("Post shared!");
                                  window.location.reload();
                                } else {
                                  message.error("Whoops, an error occurred while sharing.");
                                }
                              });
                            });
                          }
                        });
                      }
                    }
                  }
                });
             }
      }//end
    }

    // if upload image
    if (this.state.fileList.length >= 1) {
      const file = this.state.fileList[0];
      params.contentType = file.originFileObj.type;
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      params.content = file.preview;
      // if this image is for another post
      if (this.state.content.length > 0) {
        params.unlisted = true;
      }
      // send seperate post for image
      if (this.props.enableEdit) {
        params.postID = this.props.postID;
        updatePost(params).then((response) => {
          if (response.status === 200 || response.status === 204) {
            message.success("Edit success!");
            window.location.href = "/";
          } else {
            message.error("Edit failed!");
          }
        });
      } else {
        sendPost(params).then((response) => {
          if (response.status === 200) {
            message.success("Post sent!");
            window.location.href = "/";
          } else {
            message.error("Post failed!");
          }
        });
        //if public, send to followers' inbox
        if (this.state.visibility){
          getFollowerList({ object: this.state.authorID }).then((res) => {
            if (res.data.items.length !== 0) {
              for (const follower_id of res.data.items) {
                //send inbox
                let params_ = {
                  URL: `${follower_id}/inbox/box/`,
                  auth: auth,
                  body: params,
                }
                sendPostToUserInbox(params_).then((response) => {
                  if (response.status === 200) {
                    message.success("Post shared!");
                    window.location.reload();
                  } else {
                    message.error("Whoops, an error occurred while sharing.");
                  }
                });
              }
            }
          });
        }else {
                //if private, send to friends' inbox
                getFollowerList({ object: this.state.authorID }).then((res) => {
                  if (res.data.items.length !== 0) {
                    for (const follower_id of res.data.items) {
                      let host = getHostname(follower_id);
                      let n = this.state.authorID.indexOf("/author/");
                      let length = this.state.authorID.length;
                      let param = {
                          actor: this.state.authorID.substring(n + 8, length),
                          object: follower_id,
                        }
                      if (host !== window.location.hostname) {
                        param.remote = true;
                        param.auth = auth;
                        getFollower(param).then((response) => {
                          if (response.data.exist) {
                            getRemoteAuthorByAuthorID({
                              URL: follower_id,
                              auth: auth,
                            }).then((response2) => {
                              //send to friend inbox
                              let params_ = {
                                URL: `${follower_id}/inbox/box/`,
                                auth: auth,
                                body: params,
                              }
                              sendPostToUserInbox(params_).then((response) => {
                                if (response.status === 200) {
                                  message.success("Post shared!");
                                  window.location.reload();
                                } else {
                                  message.error("Whoops, an error occurred while sharing.");
                                }
                              });
                            });               
                          }
                        });
                      } else {
                        param.auth = auth;
                        param.remote = false;
                        getFollower(param).then((response) => {
                          if (response.data.exist) {
                            getAuthorByAuthorID({
                              authorID: follower_id,
                            }).then((response2) => {
                              // send to friend inbox
                              let params_ = {
                                URL: `${follower_id}/inbox/box/`,
                                auth: auth,
                                body: params,
                              }
                              sendPostToUserInbox(params_).then((response) => {
                                if (response.status === 200) {
                                  message.success("Post shared!");
                                  window.location.reload();
                                } else {
                                  message.error("Whoops, an error occurred while sharing.");
                                }
                              });
                            });
                          }
                        });
                      }
                    }
                  }
                });
             }
       
      }
    }
  };

  onSendClick = () => {
    if (
      this.state.title === "" ||
      this.state.description === "" ||
      (this.state.content === "" &&
        this.state.imageLink === "" &&
        this.state.fileList.length === 0)
    ) {
      message.warning("Post content or image is not provided.");
    } else {
      this.handleSendPost();
    }
  };

  onVisibilityChange = (e) => {
    this.setState({ visibility: e.target.checked });
  };

  handleCaterotiesChange = (tag, checked) => {
    const { categories } = this.state;
    const nextSelectedTags = checked
      ? [...categories, tag]
      : categories.filter((t) => t !== tag);
    this.setState({ categories: nextSelectedTags });
  };

  handleMarkDownSwitchChange = (checked) => {
    this.setState({ isMarkDown: checked });
  };

  render() {
    const {
      categories,
      previewVisible,
      previewImage,
      fileList,
      previewTitle,
      postObj,
      title,
      description,
      content,
    } = this.state;

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    let inner;
    if (postObj !== null) {
      // edit post
      inner = (
        <div style={{ margin: "5% 10%" }}>
          <h2 style={{ textAlign: "center" }}>Edit Your Post</h2>
          <Checkbox
            style={{ float: "left" }}
            defaultChecked
            onChange={this.onVisibilityChange}
          >
            Public
          </Checkbox>
          <Switch
            onChange={this.handleMarkDownSwitchChange}
            checkedChildren="CommonMark"
            unCheckedChildren="PlainText"
            style={{ float: "right" }}
          />
          <TextArea
            value={title}
            placeholder="Post Title"
            style={{ margin: "24px 0" }}
            autoSize
            onChange={this.onTitleChange}
          />
          <TextArea
            value={description}
            placeholder="Description"
            style={{ margin: "24px 0" }}
            autoSize
            onChange={this.onDescriptionChange}
          />
          <p style={{ color: "#C5C5C5" }}>
            * If you want to change content to image or image link, please
            remove content first. Otherwise, the image will be marked as
            unlisted.
          </p>
          <TextArea
            value={content}
            placeholder="Write your post"
            onChange={this.onContentChange}
            autoSize={{ minRows: 3, maxRows: 5 }}
            showCount
            style={{ margin: "24px 0" }}
          />
          {/* image link */}
          <TextArea
            type="url"
            placeholder="Enter your image link"
            onChange={this.onLinkChange}
            autoSize
            allowClear
            style={{ margin: "24px 0" }}
          />
          {/* Upload image */}
          <div style={{ margin: "24px 0" }}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handleImagePreview}
              onChange={this.handleImageChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={this.handleImageCancel}
            >
              <img
                alt="uploadImage"
                style={{ width: "80%" }}
                src={previewImage}
              />
            </Modal>
          </div>

          <span style={{ marginRight: 8 }}>Categories:</span>
          {tagsData.map((tag) => (
            <CheckableTag
              key={tag}
              checked={categories.indexOf(tag) > -1}
              onChange={(checked) => this.handleCaterotiesChange(tag, checked)}
            >
              {tag}
            </CheckableTag>
          ))}
          <div style={{ textAlign: "center", margin: "24px auto" }}>
            <Button type="primary" onClick={this.onSendClick}>
              Confirm Edit
            </Button>
          </div>
        </div>
      );
    } else {
      inner = (
        <div style={{ margin: "5% 20%" }}>
          <h2 style={{ textAlign: "center" }}>Create Your Post</h2>
          <Checkbox
            style={{ float: "left" }}
            defaultChecked
            onChange={this.onVisibilityChange}
          >
            Public
          </Checkbox>
          <Switch
            onChange={this.handleMarkDownSwitchChange}
            checkedChildren="CommonMark"
            unCheckedChildren="PlainText"
            style={{ float: "right" }}
          />
          <TextArea
            onChange={this.onTitleChange}
            placeholder="Post Title"
            autoSize
            required
            style={{ margin: "24px 0" }}
          />
          <TextArea
            onChange={this.onDescriptionChange}
            placeholder="Description"
            autoSize
            style={{ margin: "24px 0" }}
          />
          <p style={{ color: "#C5C5C5" }}>
            * If you write both content and image/image link, the image will be
            marked as unlisted.
          </p>
          <TextArea
            placeholder="Write your post"
            onChange={this.onContentChange}
            autoSize={{ minRows: 3, maxRows: 5 }}
            showCount
            style={{ margin: "24px 0" }}
          />
          {/* image link */}
          <TextArea
            type="url"
            placeholder="Enter your image link"
            onChange={this.onLinkChange}
            autoSize
            allowClear
            style={{ margin: "24px 0" }}
          />
          {/* Upload image */}
          <div style={{ margin: "24px 0" }}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handleImagePreview}
              onChange={this.handleImageChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={this.handleImageCancel}
            >
              <img
                alt="uploadImage"
                style={{ width: "80%" }}
                src={previewImage}
              />
            </Modal>
          </div>

          <span style={{ marginRight: 8 }}>Categories:</span>
          {tagsData.map((tag) => (
            <CheckableTag
              key={tag}
              checked={categories.indexOf(tag) > -1}
              onChange={(checked) => this.handleCaterotiesChange(tag, checked)}
            >
              {tag}
            </CheckableTag>
          ))}

          <div style={{ textAlign: "center", margin: "24px auto" }}>
            <Button type="primary" onClick={this.onSendClick}>
              Send
            </Button>
          </div>
        </div>
      );
    }

    return <div>{inner}</div>;
  }
}
