import './index.css'
import { Icon } from '@iconify/react'

const TodoListItem = props => {
  const { todoItem, onDeleteTodo, onCheckTodo } = props
  const { todoId, todo, taskDone } = todoItem

  const checkedCls = taskDone ? 'checked-class' : 'no'

  return (
    <li className='todo-item' onClick={() => onCheckTodo(todoId)}>
      <div className='todo-text-container'>
        <p className={`todo-text ${checkedCls}`}>{todo}</p>
      </div>
      <button
        className='delete-btn'
        type='button'
        onClick={() => onDeleteTodo(todoId)}
      >
        <Icon icon='material-symbols:delete-sweep' className='delete-icon' />
      </button>
    </li>
  )
}

export default TodoListItem
