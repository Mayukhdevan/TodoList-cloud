import { Component } from 'react'
import { MdSettings } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid'
import TodoListItem from '../TodoListItem'
import { Icon } from '@iconify/react'
import './index.css'

class Home extends Component {
  state = {
    textInput: '',
    todoList: [],
  }

  componentDidMount() {
    console.log('mounted')
    this.fetchTodoList()
  }

  componentWillUnmount() {
    console.log('unmounted')
  }

  updateState = data => {
    console.log(data)
    const updatedData = data.map(eachItem => ({
      username: eachItem.username,
      todoId: eachItem.todo_id,
      todo: eachItem.todo,
      taskDone: eachItem.task_done,
    }))

    this.setState({ todoList: updatedData })
  }

  fetchTodoList = async () => {
    const jwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1heXVraF9kZXZhbiIsImlhdCI6MTY3ODk3MTY1OX0.xOXBuccSYC7Ew838C-ECJ0IKkUlGhNd88ydg6nFCSVk'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('http://localhost:8000/', options)
    if (response.ok) {
      const data = await response.json()
      this.updateState(data)
    } else {
      console.log('Failed to fetch')
    }
  }

  onInput = e => this.setState({ textInput: e.target.value })

  updateDb = async newTodo => {
    const jwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1heXVraF9kZXZhbiIsImlhdCI6MTY3ODk3MTY1OX0.xOXBuccSYC7Ew838C-ECJ0IKkUlGhNd88ydg6nFCSVk'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(newTodo),
    }

    const response = await fetch('http://localhost:8000/add', options)
    const data = await response.json()

    if (response.ok) {
      console.log(data)
    } else {
      console.log(data)
    }
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
    const jwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1heXVraF9kZXZhbiIsImlhdCI6MTY3ODk3MTY1OX0.xOXBuccSYC7Ew838C-ECJ0IKkUlGhNd88ydg6nFCSVk'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'DELETE',
    }

    const response = await fetch(`http://localhost:8000/todo/${id}`, options)
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
    const jwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1heXVraF9kZXZhbiIsImlhdCI6MTY3ODk3MTY1OX0.xOXBuccSYC7Ew838C-ECJ0IKkUlGhNd88ydg6nFCSVk'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(updatedTaskDone),
    }

    const response = await fetch(`http://localhost:8000/todo/${id}`, options)
    const data = await response.json()
    console.log(data)
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

  render() {
    const { textInput, todoList } = this.state

    return (
      <div className='home-container'>
        <div className='responsive-container'>
          <h1 className='app-title'>TODO LIST</h1>
          <div className='animation-container'>
            <div className='logout-container'>
              <button className='logout-btn'>Logout</button>
            </div>
            <button className='settings-btn'>
              <MdSettings className='icons' />
            </button>
          </div>
          <ul>
            {todoList.map(eachItem => (
              <TodoListItem
                key={eachItem.todoId}
                todoItem={eachItem}
                onDeleteTodo={this.deleteTodo}
                onCheckTodo={this.onCheckTodo}
              />
            ))}
          </ul>

          <div>
            <input
              className='text-input'
              type='text'
              placeholder='Write something...'
              onChange={this.onInput}
              onKeyDown={e => e.key === 'Enter' && this.onSave(e)}
              value={textInput}
            />
            <Icon icon='jam:write-f' className='icons' />
          </div>
          <button className='edit-btn' type='submit' onClick={this.onSave}>
            <Icon icon='ic:baseline-save-as' className='icons' />
          </button>
        </div>
      </div>
    )
  }
}

export default Home
