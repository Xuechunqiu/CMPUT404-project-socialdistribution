import React from "react";
import { List, message, Spin } from "antd";
import { getInboxPost } from "../../requests/requestPost";
import { getPostDataSet } from "../Utils";
import PostDisplay from "../PostDisplay";

export default class InboxPost extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      postDataSet: [],
      authorID: this.props.authorID,
      loading: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    getInboxPost({
      authorID: this.state.authorID,
    }).then((res) => {
      if (res.status === 200) {
        getPostDataSet(res.data).then((value) => {
          this.setState({ postDataSet: value, loading: false });
        });
      } else {
        message.error("Fail to get posts.");
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { postDataSet, loading } = this.state;

    return (
      <div style={{ margin: "0 20%" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20%" }}>
            <Spin size="large" /> Loading...
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={postDataSet}
            renderItem={(item) => (
              <li>
                <PostDisplay
                  title={item.title}
                  authorName={item.authorName}
                  github={item.github}
                  content={item.content}
                  datetime={item.datetime}
                  authorID={this.state.authorID}
                  postID={item.postID}
                  rawPost={item.rawPost}
                  categories={item.categories}
                  remote={item.remote}
                  usage="inbox"
                />
              </li>
            )}
          />
        )}
      </div>
    );
  }
}
