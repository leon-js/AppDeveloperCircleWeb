import React, { Component, Fragment } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { action, observable, runInAction } from 'mobx'
import { observer, inject } from 'mobx-react'
import styles from '../style/lpstyle.module.sass'

@Form.create()
@inject('UserStore')
@observer
class NormalLoginForm extends Component {

  constructor(props) {
    super(props)
    this.ajax = this.ajax.bind(this)
    this.debonce = this.debonce.bind(this)
    this.handlechange = this.handlechange.bind(this)
  }

  @observable
  uNameValidateStatus = ''

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { history, UserStore } = this.props

        console.log('Received values of form: ', values)
        UserStore.setName(values.username)
        localStorage.setItem('login', 1)
        console.log(this.props)
        history.push('/')
      }
    });
  };

  @action
  ajax(content) {
    console.log(content)
    let validateStatus = ''
    if (content === 'lianglihao') {
      validateStatus = 'success'
    } else {
      validateStatus = 'error'
    }
    runInAction(() => {
      this.uNameValidateStatus = validateStatus
    })
  }

  @action
  debonce(fun, delay) {
    const that = this

    return function(args) {
      // that.uNameValidateStatus = 'validating'
      runInAction(() => {
        that.uNameValidateStatus = 'validating'
      })
      // var _this = this, _arguments = arguments
      clearTimeout(fun.id)
      fun.id = setTimeout(() => {
        fun(args)
        // fun.apply(_this, arguments)
      }, delay)
    }
  }

  handlechange(key, v) {
    if (key === 'username' && v.target.value !== '') {
      const inputDebonce = this.debonce(this.ajax, 1000)
      inputDebonce(v.target.value)
    }

  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        <Form className={styles.loginForm}>
          {/* <Form.Item hasFeedback={false}
            label="Warning"
            validateStatus="warning"
          >
            <Input id="warning"
              placeholder="Warning"
            />
          </Form.Item> */}
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }]
            })(
              <Input
                // onKeyUp={v => {this.handlechange('username', v)}}
                placeholder="Username"
                prefix={
                  <Icon style={{ color: 'rgba(0,0,0,.25)' }}
                    type="user"
                  />
                }
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }]
            })(
              <Input
                placeholder="Password"
                prefix={
                  <Icon style={{ color: 'rgba(0,0,0,.25)' }}
                    type="lock"
                  />}
                type="password"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: false
            })(<Checkbox style={{color: '#fff'}}>Remember me</Checkbox>)}
            <p className={styles.loginFormForgot}
              style={{color: '#fff'}}
            >
              Forgot password
            </p>
            <Button className={styles.loginFormButton}
              htmlType="submit"
              onClick={this.handleSubmit}
              type="primary"
            >
            Log in
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

// const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

// export default WrappedNormalLoginForm
export default NormalLoginForm