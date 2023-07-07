import { Component, useCallback, useEffect, useMemo, useState } from 'react'
//use useMemo to avoid expensive computations
import { RobotList } from '../cmps/RobotList'
import { RobotFilter } from '../cmps/RobotFilter'
import { Link } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  loadRobots,
  removeRobot,
  setFilterBy,
} from '../store/actions/robot.actions'
import { ChatWindow } from './ChatWindow'
import {AppHeader} from '../cmps/AppHeader'

export function RobotIndex(props) {
  const robots = useSelector((storeState) => storeState.robotModule.robots)
  const filterBy = useSelector((storeState) => storeState.robotModule.filterBy)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadRobots())
  }, [])

  const onRemoveRobot = useCallback(async (robotId) => {
    try {
      dispatch(removeRobot(robotId))
    } catch (error) {
      console.log('error:', error)
    }
  }, [])

  const onChangeFilter = (filterBy) => {
    dispatch(setFilterBy(filterBy))
    dispatch(loadRobots())
  }

  if (!robots) return <div>Loading...</div>
  console.log('Entity INDEX')
  return (
    <section className='home-page'>
      <section classNmae='contact-list'>
          <AppHeader />
        <RobotFilter filterBy={filterBy} onChangeFilter={onChangeFilter} />
        <Link to='/robot/edit'>Add contact</Link>
        <RobotList robots={robots} onRemoveRobot={onRemoveRobot} />
      </section>

      <section className='chat-window'>
        <ChatWindow />
      </section>
      
    </section>
  )
}
