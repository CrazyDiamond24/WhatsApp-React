import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { deleteMsg } from '../store/actions/user.actions';

export function MsgOptionsModal({
  position,
  closeModal,
  user,
  loggedInUser,
  message,
}) {
  const msgModalRef = useRef();
  const dispatch = useDispatch();

  const deleteMsgHandler = () => {
    dispatch(deleteMsg(message.id, loggedInUser._id  ));
    console.log(
      'message from modal',
      message,
      'user (recipient)',
      user._id,
      'logged in (sender)',
      loggedInUser._id
    );
    closeModal();
  };

  return (
    <>
      <div
        ref={msgModalRef}
        className="msg-options-modal"
        style={{
          top: position.top + 20,
          left: position.left - 170,
        }}
      >
        <ul>
          <li onClick={deleteMsgHandler}>Delete message</li>
        </ul>
      </div>
    </>
  );
}
