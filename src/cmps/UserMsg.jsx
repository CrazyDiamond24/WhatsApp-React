import React, { Component } from 'react'
import { eventBus, SHOW_MSG } from '../services/event-bus.service'

export class UserMsg extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alive: false,
      msg: null,
    }
    this.showMsg = this.showMsg.bind(this)
  }

  componentDidMount() {
    this.unsubscribe = eventBus.on(SHOW_MSG, this.showMsg)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  showMsg(msg) {
    const delay = msg.delay || 2000
    this.setState({ alive: true, msg })

    setTimeout(() => {
      this.setState({ alive: false })
    }, delay)
  }

  render() {
    const { alive, msg } = this.state
    if (!alive) {
      return null
    }

    const alertClass = `alert-${msg.type}`

    return <div className={`alert ${alertClass}`}>{msg.txt}</div>
  }
}
