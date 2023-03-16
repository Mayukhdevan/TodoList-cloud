import { Component } from 'react'
import { MdSettings } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid'
import TodoListItem from '../TodoListItem'
import { Icon } from '@iconify/react'
import './index.css'

class Home extends Component {
  state = {
    textInput: '',
    todoList: [
      {
        todoId: uuidv4(),
        todo: 'Need to complete the projects',
        taskDone: false,
      },
      {
        todoId: uuidv4(),
        todo: 'Need to complete the projects',
        taskDone: false,
      },
    ],
  }

  componentDidMount() {
    this.fetchSomeData()
  }

  fetchSomeData = async () => {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        username: 'mayukh_devan',
        password: 'mayukh@555',
        name: 'Mayukh Devan',
        gender: 'male',
      }),
    }

    fetch('http://localhost:8000/register', options)
      .then(res => res.json())
      .then(data => console.log(data))
  }

  onInput = e => this.setState({ textInput: e.target.value })

  onSave = e => {
    e.preventDefault()

    const { textInput } = this.state
    const newTodo = { todoId: uuidv4(), todo: textInput, taskDon: false }
    this.setState(prevState => ({
      todoList: [...prevState.todoList, newTodo],
      textInput: '',
    }))
  }

  deleteTodo = id => {
    this.setState(prevState => ({
      todoList: prevState.todoList.filter(eachTodo => eachTodo.todoId !== id),
    }))
  }

  render() {
    const { textInput, todoList } = this.state

    return (
      <div className='home-container'>
        <div className='logout-container'>
          <button className='logout-btn'>Logout</button>
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
    )
  }
}

export default Home
