import {Component} from 'react'
import {MdSettings} from 'react-icons/md'
import {v4 as uuidv4} from 'uuid'
import TodoListItem from '../TodoListItem'
import {Icon} from '@iconify/react'
import './index.css'

class Home extends Component {
  state = {textInput: '', todoList: [
    {
    todoId: uuidv4(),
    todo: 'Need to complete the projects',
    taskDone: false,
    },
    {
    todoId: uuidv4(),
    todo: 'Need to complete the projects',
    taskDone: false,
    }
  ]}

  onInput = e => this.setState({textInput: e.target.value})

  
  onSave = e => {
    e.preventDefault()

    const {textInput, todoList} = this.state
    const newTodo = {todoId: uuidv4(), todo: textInput, taskDon: false}
    this.setState(prevState => ({
      todoList: [...prevState.todoList, newTodo],
      textInput: '',
    }))
  } 

  deleteTodo = id => {
    const {todoList} = this.state
    this.setState(prevState => ({todoList: prevState.todoList.filter(eachTodo => eachTodo.todoId !== id)}))
  }

  render() {
    const {textInput, todoList} = this.state


    return (
      <div className="home-container">
        <div className="logout-container">
          <button className="logout-btn">Logout</button>
          <button className="settings-btn">
            <MdSettings />
          </button>
        </div>
        <ul>
          {todoList.map(eachItem => <TodoListItem key={eachItem.todoId} todoItem={eachItem} onDeleteTodo={this.deleteTodo}/>)}
        </ul>

        <div>
          <input className='text-input' type='text' placeHolder='Write something...' onChange={this.onInput} value={textInput}/>
          <Icon icon='jam:write-f'/>
        </div>
        <button className='edit-btn' type='submit' onClick={this.onSave}>
          <Icon icon='ic:baseline-save-as'/>
        </button>
      </div>
    )
  }
}

export default Home