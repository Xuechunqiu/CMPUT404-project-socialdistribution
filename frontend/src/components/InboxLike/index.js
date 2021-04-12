import React from "react";
import { List, message, Avatar, Spin } from "antd";
import { getinboxlike } from "../../requests/requestLike";
import { generateRandomAvatar, getLikeDataSet } from "../Utils";

export default class InboxLike extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      likelist: [],
      authorID: this.props.authorID,
      loading: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    getinboxlike({ authorID: this.state.authorID }).then((res) => {
      if (res.status === 200) {
        getLikeDataSet(res.data).then((value) => {
          this.setState({ likelist: value, loading: false });
        });
      } else {
        message.error("Request failed!");
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { likelist, loading } = this.state;
    return (
      <div style={{ margin: "0 20%" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20%" }}>
            <Spin size="large" /> Loading...
          </div>
        ) : (
          <List
            bordered
            itemLayout="horizontal"
            pagination={{
              pageSize: 10,
            }}
            dataSource={likelist}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src={generateRandomAvatar(item.authorName)} />
                  }
                  title={item.authorName}
                  description={item.summary}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}
