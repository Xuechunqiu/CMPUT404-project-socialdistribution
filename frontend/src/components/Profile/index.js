import React from "react";
import { Descriptions, message, Card, Avatar } from "antd";
import { EditOutlined, LogoutOutlined } from "@ant-design/icons";
import { getAuthorByUsername } from "../../requests/requestAuthor";
import ProfileChange from "../ProfileChange";
import GitHubCalendar from "react-github-calendar";
import { GithubOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import { generateRandomAvatar } from "../Utils";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      authorID: this.props.authorID,
      username: this.props.username,
      displayName: this.props.displayName,
      github: this.props.github,
      isModalVisible: false,
    };
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateDisplay() {
    if (!this.state.username) {
      // Either we can found username from state(props) or cookies or it is impossible to know
      const usernameFromCookies = localStorage.getItem("username");
      if (usernameFromCookies && this._isMounted) {
        this.setState({ username: usernameFromCookies });
      }
    }
    if (!this.state.authorID) {
      // Either we can found authorID from state(props) or cookies or it is impossible to know
      const authorIDFromCookies = localStorage.getItem("authorID");
      if (authorIDFromCookies && this._isMounted) {
        this.setState({ authorID: authorIDFromCookies });
      }
    }
    if (this.state.username) {
      getAuthorByUsername({ username: this.state.username }).then(
        (response) => {
          if (response.status === 200) {
            if (Object.keys(response.data).length === 1) {
              message.error(response.data.msg);
            } else {
              localStorage.setItem("displayName", response.data.displayName);
              localStorage.setItem("github", response.data.github);
              if (this._isMounted) {
                this.setState({
                  displayName: response.data.displayName,
                  github: response.data.github,
                });
              }
            }
          }
        }
      );
    }
  }

  componentDidMount() {
    this.updateDisplay();
  }

  handleClick = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  handleChangeModalVisibility = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    this.updateDisplay();
  };

  render() {
    return (
      <div style={{ margin: "5% 20%" }}>
        <Card
          style={{
            marginTop: 16,
            marginLeft: "auto",
            marginRight: "auto",
            width: 400,
          }}
          cover={
            <img
              alt="coverImage"
              src="https://media4.giphy.com/media/5PSPV1ucLX31u/giphy.gif"
            />
          }
          actions={[
            <EditOutlined key="edit" onClick={this.handleClick} />,
            <LogoutOutlined key="logout" onClick={this.props.logout} />,
          ]}
        >
          <Meta
            // TODO: change avatar
            avatar={
              <Avatar src={generateRandomAvatar(this.state.displayName)} />
            }
            title={this.state.displayName}
            description={
              <div>
                <p>Username: {this.state.username}</p>
                <p>Github: {this.state.github}</p>
              </div>
            }
          />
        </Card>

        <ProfileChange
          authorID={this.props.authorID}
          displayName={this.state.displayName}
          github={this.state.github}
          visible={this.state.isModalVisible}
          handleChangeModalVisibility={this.handleChangeModalVisibility}
        />
        <div style={{ marginTop: "5%", textAlign: "center" }}>
          <GithubOutlined />
          <Descriptions title="My Github Activity"></Descriptions>
          <GitHubCalendar
            username={
              /([a-zA-Z0-9_-])+(?!.*[a-zA-Z0-9_-]+)/.exec(this.state.github)[0]
            }
            years={[2021]}
            blockMargin={5}
          />
        </div>
      </div>
    );
  }
}
