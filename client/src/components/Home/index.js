import { Component } from 'react'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'
import { MdSettings } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid'
import TodoListItem from '../TodoListItem'
import NoTodo from '../NoTodo'
import { Icon } from '@iconify/react'
import './index.css'

class Home extends Component {
  state = {
    textInput: '',
    todoList: [],
    isSettingsExpanded: false,
    isInputFocused: false,
    logout: false,
  }

  componentDidMount() {
    console.log('mounted')
    this.fetchTodoList()
  }

  componentWillUnmount() {
    console.log('unmounted')
  }

  updateState = data => {
    const updatedData = data.map(eachItem => ({
      username: eachItem.username,
      todoId: eachItem.todo_id,
      todo: eachItem.todo,
      taskDone: eachItem.task_done === 1 ? true : false,
    }))
    this.setState({ todoList: updatedData })
  }

  fetchTodoList = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(
      'https://mayukh-nodeapi.onrender.com/',
      options
    )
    if (response.ok) {
      const data = await response.json()
      this.updateState(data)
    } else {
      console.log('Failed to fetch')
    }
  }

  onInput = e => this.setState({ textInput: e.target.value })

  updateDb = async newTodo => {
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(newTodo),
    }

    await fetch('https://mayukh-nodeapi.onrender.com/add', options)
  }

  onSave = e => {
    e.preventDefault()

    const { textInput } = this.state
    const newTodo = { todoId: uuidv4(), todo: textInput, taskDone: false }
    this.setState(
      prevState => ({
        todoList: [...prevState.todoList, newTodo],
        textInput: '',
      }),
      () => this.updateDb(newTodo)
    )
  }

  deleteFromDb = async id => {
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    }

    const response = await fetch(
      `https://mayukh-nodeapi.onrender.com/todo/${id}`,
      options
    )
    const data = await response.json()

    console.log(data)
  }

  deleteTodo = id => {
    this.setState(
      prevState => ({
        todoList: prevState.todoList.filter(eachTodo => eachTodo.todoId !== id),
      }),
      () => this.deleteFromDb(id)
    )
  }

  checkUpdateDb = async (updatedTaskDone, id) => {
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(updatedTaskDone),
    }

    await fetch(`https://mayukh-nodeapi.onrender.com/todo/${id}`, options)
  }

  onCheckTodo = id => {
    this.setState(prevState => ({
      todoList: prevState.todoList.map(eachTodo => {
        if (eachTodo.todoId === id) {
          this.checkUpdateDb({ taskDone: !eachTodo.taskDone }, id)
          return {
            ...eachTodo,
            taskDone: !eachTodo.taskDone,
          }
        }
        return {
          ...eachTodo,
        }
      }),
    }))
  }

  onLogout = () => {
    Cookies.remove('jwt_token')
    this.setState({ logout: true })
  }

  render() {
    if (Cookies.get('jwt_token') === undefined) {
      return <Navigate to='/login' replace={true} />
    }

    const { textInput, todoList, isSettingsExpanded, isInputFocused } =
      this.state

    const inputFocusCls = isInputFocused ? 'expand-textarea' : ''
    const logoutConteinerCls = isSettingsExpanded
      ? 'logout-container-expand'
      : ''
    const logoutBtnCls = isSettingsExpanded ? 'logout-btn-expand' : ''
    const logoutSettingsCls = isSettingsExpanded ? 'settings-btn-expand' : ''

    return (
      <div className='home-container'>
        <div className='responsive-container'>
          <h1 className='app-title'>TODO LIST</h1>

          <div className={`logout-container ${logoutConteinerCls}`}>
            <button
              className={`logout-btn ${logoutBtnCls}`}
              type='button'
              onClick={this.onLogout}
            >
              Logout
            </button>
            <button
              className={`settings-btn ${logoutSettingsCls}`}
              type='button'
              onClick={() =>
                this.setState(prevState => ({
                  isSettingsExpanded: !prevState.isSettingsExpanded,
                }))
              }
            >
              <MdSettings className='icons' />
            </button>
          </div>
        </div>
        {todoList.length === 0 ? (
          <NoTodo />
        ) : (
          <ul className='todo-list-container'>
            {todoList.map(eachItem => (
              <TodoListItem
                key={eachItem.todoId}
                todoItem={eachItem}
                onDeleteTodo={this.deleteTodo}
                onCheckTodo={this.onCheckTodo}
              />
            ))}
          </ul>
        )}

        <div className='editor-section'>
          <div className={`text-input-container ${inputFocusCls}`}>
            <input
              onFocus={() => this.setState({ isInputFocused: true })}
              onBlur={() => this.setState({ isInputFocused: false })}
              className='text-input'
              type='text'
              placeholder='Write something...'
              onChange={this.onInput}
              onKeyDown={e => e.key === 'Enter' && this.onSave(e)}
              value={textInput}
            />
            <button
              className='edit-btn'
              type='button'
              onClick={this.focusTextArea}
            >
              <Icon icon='jam:write-f' className='icons' />
            </button>
          </div>
          <button className='save-btn' type='submit' onClick={this.onSave}>
            <Icon icon='ic:baseline-save-as' className='icons' />
          </button>
        </div>
      </div>
    )
  }
}

export default Home
