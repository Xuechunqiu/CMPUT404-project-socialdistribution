import React from "react";
import { Button, message } from "antd";
import { UserSwitchOutlined } from "@ant-design/icons";
import {
  deleteFriend,
  deleteRemoteFriend,
} from "../../requests/requestFriends";
import UnfollowModal from "../UnfollowModal";
import { domainAuthPair } from "../../requests/URL";
import { getDomainName } from "../Utils";

export default class SingleFriend extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      isModalVisible: false,
      friendID: this.props.friendID,
      ButtonDisabled: false,
      authorID: this.props.authorID,
    };
  }

  handleClickUnfollow = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  handleModalVisibility = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  removeFriend = () => {
    var n = this.state.authorID.indexOf("/author/");
    var m = this.state.friendID.indexOf("/author/");
    var length = this.state.authorID.length;
    var length1 = this.state.friendID.length;
    const domain = getDomainName(this.state.friendID);
    if (domain !== window.location.hostname) {
      let params = {
        actor: this.state.authorID,
        object: this.props.friendID,
        auth: domainAuthPair[domain],
      };
      let params1 = {
        actor: this.state.friendID.substring(m + 8, length1),
        object: this.state.authorID,
        remote: true,
      };
      deleteFriend(params1).then((response) => {
        if (response.status === 200) {
          message.success("Friend Successfully deleted.");
          window.location.reload();
        } else {
          message.error("Friend deleted Failed!");
        }
      });
      deleteRemoteFriend(params).then((response) => {
        if (response.status === 200) {
          message.success("Remote Friend Successfully Deleted.");
          //window.location.reload();
        } else {
          message.error("Remote Friend Delete Failed!");
        }
      });
    } else {
      let params1 = {
        actor: this.props.authorID.substring(n + 8, length),
        object: this.props.friendID,
      };
      let params = {
        actor: this.props.friendID.substring(m + 8, length1),
        object: this.props.authorID,
      };
      deleteFriend(params).then((response) => {
        if (response.status === 200) {
          message.success("My Friend Successfully deleted.");
          window.location.reload();
        } else {
          message.error("My Friend deleted Failed!");
        }
      });
      deleteFriend(params1).then((response) => {
        if (response.status === 200) {
          message.success("Friend Successfully deleted.");
          window.location.reload();
        } else {
          message.error("Friend deleted Failed!");
        }
      });
    }
  };

  render() {
    return (
      <div>
        <Button style={{ float: "right" }} onClick={this.handleClickUnfollow}>
          {<UserSwitchOutlined />} Unbefriend
        </Button>
        <UnfollowModal
          visible={this.state.isModalVisible}
          handleModalVisibility={this.handleModalVisibility}
          dosomething={this.removeFriend}
        />
      </div>
    );
  }
}
