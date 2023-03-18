import { Component } from 'react'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

import './index.css'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      username: '',
      password: '',
      gender: 'male',
      showSubmitError: false,
      errorMsg: '',
      showSubmitSuccess: false,
      successMsg: '',
      signUp: false,
      redirect: false,
    }
  }

  onChangeUsername = event => {
    this.setState({ username: event.target.value })
  }

  onChangeName = event => {
    this.setState({ name: event.target.value })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })

    this.setState(prevState => ({ redirect: !prevState.redirect }))
  }

  onSubmitFailure = errorMsg => {
    this.setState({ showSubmitError: true, errorMsg })
  }

  submitForm = async event => {
    event.preventDefault()
    const { username, password } = this.state

    const userDetails = { username, password }
    const url = 'https://mayukh-nodeapi.onrender.com/login/'
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwtToken)
    } else {
      this.onSubmitFailure(data.err_msg)
    }
  }

  renderPasswordField = () => {
    const { password } = this.state
    return (
      <>
        <label className='input-label' htmlFor='password'>
          Password
        </label>
        <input
          type='password'
          id='password'
          className='password-input-field'
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderNameField = () => {
    const { name } = this.state
    return (
      <>
        <label className='input-label' htmlFor='username'>
          Name
        </label>
        <input
          type='text'
          id='name'
          className='username-input-field'
          value={name}
          onChange={this.onChangeName}
        />
      </>
    )
  }

  renderUsernameField = () => {
    const { username } = this.state
    return (
      <>
        <label className='input-label' htmlFor='username'>
          Username
        </label>
        <input
          type='text'
          id='username'
          className='username-input-field'
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  handleSignUp = data => {
    const msg = data.message
    console.log(msg)

    this.setState({
      showSubmitError: false,
      errorMsg: '',
      showSubmitSuccess: true,
      successMsg: msg,
    })
  }

  registerUser = async event => {
    event.preventDefault()
    const { name, gender, username, password } = this.state

    const userDetails = { username, password, name, gender }
    const url = 'https://mayukh-nodeapi.onrender.com/register/'
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.handleSignUp(data)
    } else {
      this.onSubmitFailure(data.err_msg)
    }
  }

  renderSignUp = () => {
    const { showSubmitError, errorMsg, showSubmitSuccess, successMsg } =
      this.state

    console.log(showSubmitSuccess)

    return (
      <form className='form' onSubmit={this.registerUser}>
        <h1 className='login-heading'>TODO LIST</h1>
        <div className='input-container'>{this.renderNameField()}</div>
        <div className='input-container'>{this.renderUsernameField()}</div>
        <div className='input-container'>{this.renderPasswordField()}</div>
        <div className='radio-container'>
          <div className='radio-field'>
            <input
              className='radio-inputs'
              type='radio'
              id='male'
              value='male'
              name='gender'
              onChange={e => this.setState({ gender: e.target.value })}
            />
            <label className='gender-input-label' htmlFor='male'>
              Male
            </label>
          </div>
          <div className='radio-field'>
            <input
              className='radio-inputs'
              type='radio'
              id='female'
              value='female'
              name='gender'
              onChange={e => this.setState({ gender: e.target.value })}
            />
            <label className='gender-input-label' htmlFor='female'>
              Female
            </label>
          </div>
        </div>
        <button type='submit' className='login-button'>
          Sign Up
        </button>
        <p className='signup-instead'>
          Already have an account?{' '}
          <span onClick={this.toggleSignView}>Login!</span>
        </p>
        {showSubmitSuccess && <p className='success-message'>{successMsg}</p>}
        {showSubmitError && <p className='error-message'>*{errorMsg}</p>}
      </form>
    )
  }

  renderSignIn = () => {
    const { showSubmitError, errorMsg } = this.state

    return (
      <form className='form' onSubmit={this.submitForm}>
        <h1 className='login-heading'>TODO LIST</h1>
        <div className='input-container'>{this.renderUsernameField()}</div>
        <div className='input-container'>{this.renderPasswordField()}</div>
        <button type='submit' className='login-button'>
          Login
        </button>
        <p className='signup-instead'>
          Don't have an account?{' '}
          <span onClick={this.toggleSignView}>Sign up instead!</span>
        </p>
        {showSubmitError && <p className='error-message'>*{errorMsg}</p>}
      </form>
    )
  }

  toggleSignView = () =>
    this.setState(prevState => ({ signUp: !prevState.signUp }))

  render() {
    const { signUp } = this.state

    const signUpCls = signUp ? 'toggle-signup' : ''

    const jwtToken = Cookies.get('jwt_token')
    if (typeof jwtToken !== 'undefined') {
      return <Navigate to='/' />
    }
    return (
      <div className='login-bg-container'>
        <div className='login-responsive-container'>
          <img
            src='undraw_sign__up_nm4k.svg'
            className='login-image'
            alt='website login'
          />
          <div className='form-container'>
            <button
              type='button'
              className={`toggle-sign-view-btn ${signUpCls}`}
              onClick={this.toggleSignView}
            >
              <span className='login-span'>Login</span>
              <span className='signup-span'>Sign Up</span>
            </button>
            {signUp ? this.renderSignUp() : this.renderSignIn()}
          </div>
        </div>
      </div>
    )
  }
}

export default Login
