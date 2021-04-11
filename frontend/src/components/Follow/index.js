import React from "react";
import { Tabs } from "antd";
import { UserAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import Friends from "../Friends";
import Followers from "../Followers";
const { TabPane } = Tabs;

export default class Follow extends React.Component {
  state = {
    authorID: this.props.authorID,
  };

  render() {
    return (
      <Tabs defaultActiveKey="followers" tabPosition="left">
        <TabPane
          tab={
            <span>
              <UserAddOutlined />
              Followers
            </span>
          }
          key={"followers"}
        >
          <Followers authorID={this.props.authorID} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <UsergroupAddOutlined />
              Friends
            </span>
          }
          key={"friends"}
        >
          <Friends authorID={this.props.authorID} />
        </TabPane>
      </Tabs>
    );
  }
}
