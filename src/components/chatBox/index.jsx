/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { FcRight, FcLeft } from 'react-icons/fc';
import style from '../../styles/components/chatBox.module.sass';

const ChatBox = ({ ws, userId, videoId, username }) => {
  const [message, setMessage] = useState(null);
  const [store, setStore] = useState([]);
  const storeRef = useRef();
  const addMessage = (msg) => {
    // console.log(msg);
    const value = String(msg.data).trim();
    const data = JSON.parse(JSON.parse(JSON.stringify(value)));
    let child = null;
    if (data.userId === userId) {
      child = (
        <li className={style.right_li} key={data.id}>
          <span className={style.username}>You</span>
          <FcLeft className={style.icon} />
          <span className={style.text}>{data.message}</span>
        </li>
      );
    } else {
      child = (
        <li className={style.left_li} key={data.id}>
          <span className={style.username}>{data.username}</span>

          <FcRight className={style.icon} />

          <span className={style.text}>{data.message}</span>
        </li>
      );
    }
    setStore([...storeRef.current, child]);
  };

  const sendMessage = (event) => {
    storeRef.current = store;
    let msg = {
      message,
      userId,
      videoId,
      username,
    };
    msg = JSON.stringify(msg);
    ws.send(msg);
    event.preventDefault();
  };

  useEffect(() => {
    const conn = ws;
    storeRef.current = store;
    // console.log('mounted chaatbox');
    if (conn) {
      conn.onmessage = addMessage;
    }

    return () => {
      // console.log('exiting compoment');
      // if (ws) {
      //   ws.close();
      // }
    };
  }, [ws]);

  const handleChange = (event) => {
    // storeRef.current = store;
    setMessage(event.target.value);
  };

  return (
    <div className={style.box}>
      <div className={style.container}>
        <ul className={style.list}>{store}</ul>
      </div>
      <form className={style.messageForm} onSubmit={sendMessage}>
        <input
          type="text"
          autoComplete="off"
          name="message"
          onChange={handleChange}
        />
        <button type="submit">
          <AiOutlineSend />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
