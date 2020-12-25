/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react';
import ChatBox from '../components/chatBox';
import styles from '../styles/index.module.sass';
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      message: null,
      ws: null,
      userId: null,
      videoId: null,
      username: null,
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // addMessage = (msg) => {
  //   this.setState({ data: [...this.state.data, msg] });
  // };

  // sendMessage = (event) => {
  //   event.preventDefault();
  //   let msg = {
  //     message: this.state.message,
  //     idx: this.state.videoId,
  //     userId: this.state.userId,
  //   };
  //   msg = JSON.stringify(msg);
  //   // console.log(msg);
  //   this.state.ws.send(msg);
  // };

  // recieveMessage = (msg) => {
  //   this.setState({ data: [...this.state.data, msg] });
  // };

  makeConn = (event) => {
    event.preventDefault();
    const ws = new WebSocket(
      `ws://localhost:3000/${this.state.userId}/${this.state.videoId}`
    );
    this.setState({ ws: ws });

    ws.onopen = () => {
      // console.log(ws);
    };

    ws.onclose = (event) => {
      console.log('Socket closed');
    };
  };

  componentWillUnmount() {
    if (this.state.ws !== null) this.state.ws.close();
  }

  render() {
    return (
      <div>
        <form className={styles.form} onSubmit={this.makeConn} method="post">
          <input
            type="text"
            name="userId"
            autoComplete="on"
            placeholder="UserID"
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="videoId"
            autoComplete="on"
            placeholder="GroupID"
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="username"
            autoComplete="on"
            placeholder="Enter name"
            onChange={this.handleChange}
          />
          <button type="submit">Submit</button>
        </form>
        <ChatBox
          ws={this.state.ws}
          userId={this.state.userId}
          videoId={this.state.videoId}
          username={this.state.username}
        />
      </div>
    );
  }
}

export default Home;
