import { Component, useEffect, useState } from 'react'
import { robotService } from '../services/robot.service'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from '../customHooks/useForm'

export function RobotEdit(props) {
  const [robot, handleChange, setRobot] = useForm(robotService.getEmptyRobot())

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadRobot()
  }, [])

  async function loadRobot() {
    const robotId = params.id
    if (robotId) {
      try {
        const robot = await robotService.getById(robotId)
        setRobot(robot)
      } catch (error) {
        console.log('error:', error)
      }
    }
  }

  async function onSaveRobot(ev) {
    ev.preventDefault()
    try {
      await robotService.save({ ...robot })
      navigate('/')
    } catch (error) {
      console.log('error:', error)
    }
  }

  const { model, type } = robot
  return (
    <section className='robot-edit'>
      <h1>{robot._id ? 'Edit' : 'Add'} Entity</h1>
      <form onSubmit={onSaveRobot}>
        <label htmlFor='model'>Text</label>
        <input
          value={model}
          onChange={handleChange}
          type='text'
          name='model'
          id='model'
        />

        <label htmlFor='type'>dropdown</label>
        <select value={type} onChange={handleChange} name='type' id='type'>
          <option disabled value=''>
            option
          </option>
        </select>

        <button>Save</button>
      </form>
    </section>
  )
}
