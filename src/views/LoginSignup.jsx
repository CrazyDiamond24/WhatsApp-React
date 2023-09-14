import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { doSignup, doLogin } from "../store/actions/user.actions"
import chatbotImg from "../assets/imgs/chat-bot.png"
import chatPeopleImg from "../assets/imgs/chat-people.png"
import { showErrorMsg } from "../services/event-bus.service"

export function LoginSignup({ status }) {
  const state = status === "login"
  const [hasAccount, setHasAccount] = useState(state)
  const [signupCred, setSignupCred] = useState({
    username: "",
    password: "",
    fullName: "",
    img: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
    msgs: [],
    contacts: [
      {
        _id: "64cfc89fad3456953c4b3cec",
        fullName: "gpt",
        username: "comedian gpt",
        img: "data:image/jpeg;base64,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",
      },
      {
        _id: "64fa1049d908474e38ba7d0b",
        fullName: "gpt",
        username: "love gpt",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7qipDBh8Ub7TO9zbREbtbwMcup-32_prk9Q&usqp=CAU",
      },
    ],
    status: "",
    isOnline: false,
    lastSeen: null,
    groups: [],
    story: [],
    userPref: {
      fontSize: 16,
      fontColor: "#222222",
      headerBgColor: "#084b41",
      fontFamily: "",
      backgroundImage: "",
    },
  })

  const users = useSelector((storeState) => storeState.userModule.users)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function handleToggle() {
    setHasAccount((prevHasAccount) => !prevHasAccount)
  }
  
  async function handleSubmit(e) {
    console.log('users', users)
    e.preventDefault()
    const isRegistered = users?.some((user) => {
      return user.username === signupCred.username
    })
    setHasAccount(isRegistered)
    if (isRegistered && state) {
      dispatch(doLogin(signupCred))
      navigate("/")
    } else if (
      !signupCred.password ||
      !signupCred.username
    ) {
      showErrorMsg("Please fill up all of the fields")
    } else {
      const answer = await dispatch(doSignup(signupCred))
      if (answer) {
        showErrorMsg("You are now registered. Enjoy!")
        return navigate("/")
      }
      showErrorMsg("Username is already taken.")
      return setHasAccount(false)
    }
    setHasAccount(true)
  }

  return (
    <div className="login-signup-container">
      <div className="form-container">
        <h2>{hasAccount ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="chat-people-img-container">
            <img
              className="chat-people-img"
              src={chatPeopleImg}
              alt="Chatpeople"
            />
            <img
              className="chat-people-img"
              src={chatPeopleImg}
              alt="Chatpeople"
            />
          </div>

          {!hasAccount && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={signupCred.fullName}
                onChange={(e) =>
                  setSignupCred({ ...signupCred, fullName: e.target.value })
                }
                required
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={signupCred.username}
              onChange={(e) =>
                setSignupCred({ ...signupCred, username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={signupCred.password}
              onChange={(e) =>
                setSignupCred({ ...signupCred, password: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <button type="submit">{hasAccount ? "Login" : "Sign Up"}</button>
          </div>
        </form>
        <p>
          {hasAccount ? "Don't have an account? " : "Already have an account? "}
          <span onClick={handleToggle}>{hasAccount ? "Sign Up" : "Login"}</span>
        </p>

        <img className="chat-bot-img" src={chatbotImg} alt="Chatbot" />
      </div>
    </div>
  )
}
