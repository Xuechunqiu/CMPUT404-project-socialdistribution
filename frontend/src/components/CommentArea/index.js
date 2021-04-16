import React from "react";
import { message, Input, Modal } from "antd";
import { postComment, postRemoteComment } from "../../requests/requestComment";
import { domainAuthPair } from "../../requests/URL";
import { getDomainName } from "../Utils";
import { getAuthorByAuthorID } from "../../requests/requestAuthor";

const { TextArea } = Input;

export default class CommentArea extends React.Component {
  state = {
    commentValue: "",
  };

  handleCommentChange = (e) => {
    this.setState({
      commentValue: e.target.value,
    });
  };

  handleModalOk = () => {
    //post comment
    let params = {
      author: this.props.authorID,
      postID: this.props.postID,
      comment: this.state.commentValue,
      contentType: "text/plain",
    };
    if (this.props.remote) {
      params.URL = `${this.props.postID}/comment/`;
      params.auth = domainAuthPair[getDomainName(params.URL)];
      getAuthorByAuthorID({ authorID: this.props.authorID }).then((res) => {
        // team 4 can't support localhost author id
        res.data.id =
          "https://c404posties.herokuapp.com/author/31079a931e164d1c973d5dc23d45fd9d";
        params.author = res.data;
        postRemoteComment(params).then((res) => {
          if (res.status === 200) {
            message.success("Remote comment post success!");
            window.location.reload();
          } else {
            message.error("Remote comment send fails");
          }
        });
      });
    } else {
      postComment(params).then((res) => {
        if (res.status === 200) {
          message.success("Comment post success!");
          window.location.reload();
        } else {
          message.error("Comment send fails");
        }
      });
    }
    this.props.handleCommentModalVisiblility();
  };

  handleModalCancel = () => {
    this.props.handleCommentModalVisiblility();
  };

  onContentChange = ({ target: { value } }) => {
    this.setState({ commentValue: value });
  };

  render() {
    return (
      <Modal
        title="Comment"
        visible={this.props.visible}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
      >
        <TextArea
          onChange={this.onContentChange}
          placeholder="Write your comment..."
          autoSize={{ minRows: 3, maxRows: 8 }}
          allowClear
          style={{ margin: "24px 24px" }}
        />
      </Modal>
    );
  }
}
