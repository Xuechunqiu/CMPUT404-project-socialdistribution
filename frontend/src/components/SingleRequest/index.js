import React from "react";
import { Tag, Button, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  deleteRequest,
  deleteRemoteRequest,
} from "../../requests/requestFriendRequest";
import {
  createFriend,
  createRemoteFriend,
} from "../../requests/requestFriends";
import { domainAuthPair } from "../../requests/URL";
import { getDomainName } from "../Utils";

export default class SingleRequest extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      isRejected: false,
      isAccepted: false,
      ButtonDisabled: false,
      authorID: this.props.authorID,
      remote: this.props.remote,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleClickClose = () => {
    var n = this.props.actorID.indexOf("/author/");
    var length = this.props.actorID.length;
    if (this.state.remote) {
      let params = {
        URL:
          this.props.authorID +
          "/request/" +
          this.props.actorID.substring(n + 8, length),
        auth: domainAuthPair[getDomainName(this.props.authorID)],
        remote: true,
      };
      deleteRemoteRequest(params).then((response) => {
        if (response.status === 200) {
          message.success("Request Rejected.");
          //window.location.reload();
        } else {
          message.error("Reject Failed!");
        }
      });
    } else {
      let params = {
        actor: this.props.actorID.substring(n + 8, length),
        object: this.props.authorID,
      };
      deleteRequest(params).then((response) => {
        if (response.status === 200) {
          message.success("Request Rejected.");
          //window.location.reload();
        } else {
          message.error("Reject Failed!");
        }
      });
    }
    this.setState((prevState) => {
      return {
        isRejected: true,
        ButtonDisabled: true,
      };
    });
  };

  handleClickAccept = () => {
    var n = this.props.actorID.indexOf("/author/");
    var length = this.props.actorID.length;
    var m = this.props.authorID.indexOf("/author/");
    var length1 = this.props.authorID.length;
    if (this.state.remote) {
      let params = {
        object: this.props.authorID,
        actor: this.props.actorID.substring(n + 8, length),
        auth: domainAuthPair[getDomainName(this.props.authorID)],
        remote: true,
      };
      let params1 = {
        auth: domainAuthPair[getDomainName(this.props.actorID)],
        object: this.props.authorID,
        actor: this.props.actorID,
        URL: this.props.actorID.substring(0, n) + "/friendrequest/accept/",
      };
      createFriend(params).then((response) => {
        if (response.status === 204) {
          message.success("Friend Created!");
          //window.location.reload();
        } else {
          message.error("Friend Create Failed!");
        }
      });
      createRemoteFriend(params1).then((response) => {
        if (response.status === 204) {
          message.success("Remote Friend Created!");
          //window.location.reload();
        } else {
          message.error("Remote Friend Failed!");
        }
      });
      params.URL =
        this.props.authorID +
        "/request/" +
        this.props.actorID.substring(n + 8, length);
      deleteRemoteRequest(params).then((response) => {
        if (response.status === 200) {
          message.success("Request Deleted.");
          //window.location.reload();
        } else {
          message.error("Delete Failed!");
        }
      });
    } else {
      let params = {
        actor: this.props.actorID.substring(n + 8, length),
        object: this.props.authorID,
      };
      let params1 = {
        object: this.props.actorID,
        actor: this.props.authorID.substring(m + 8, length1),
      };
      // create friend for current author
      createFriend(params).then((response) => {
        if (response.status === 204) {
          // create friend for another actor
          createFriend(params1).then((response) => {
            if (response.status === 204) {
              message.success("Friend created!");
              //window.location.reload();
            } else {
              message.error("Friend Failed!");
            }
          });
        } else {
          message.error("My Friend Failed!");
        }
      });

      deleteRequest(params).then((response) => {
        if (response.status === 200) {
          message.success("Request Deleted.");
          //window.location.reload();
        } else {
          message.error("Delete Failed!");
        }
      });
    }
    this.setState((prevState) => {
      return {
        isAccepted: true,
        ButtonDisabled: true,
      };
    });
  };

  render() {
    const { isRejected, isAccepted, ButtonDisabled } = this.state;
    return (
      <div>
        <span style={{ float: "right" }}>
          <Button
            disabled={ButtonDisabled}
            icon={<CheckCircleOutlined style={{ color: "#70B668" }} />}
            onClick={this.handleClickAccept}
          ></Button>
          <Button
            style={{ marginLeft: "16px" }}
            disabled={ButtonDisabled}
            icon={<CloseCircleOutlined style={{ color: "#eb2f96" }} />}
            onClick={this.handleClickClose}
          ></Button>
        </span>
        <Tag visible={isRejected}>Request rejected.</Tag>
        <Tag visible={isAccepted}>Request accepted.</Tag>
      </div>
    );
  }
}
