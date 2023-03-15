import './index.css'
import {Icon} from '@iconify/react'

const TodoListItem = props => {
  const {todoItem, onDeleteTodo} = props
  const {todoId, todo} = todoItem

  return (
    <li className='todo-item'>
      <p className='todo-text'>{todo}</p>
      <button className="delete-btn" type="button" onClick={() => onDeleteTodo  (todoId)}>
        <Icon icon='material-symbols:delete-sweep'/>
      </button>
    </li>
  )
}

export default TodoListItem