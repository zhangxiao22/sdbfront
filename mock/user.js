
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    // introduction: 'I am a super administrator',
    suBranchName: '支行名称1',
    avatar: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3772671935,4236099565&fm=26&gp=0.jpg',
    name: '管理员'
  },
  'editor-token': {
    roles: ['editor'],
    // introduction: 'I am an editor',
    suBranchName: '支行名称2',
    avatar: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1155743917,3051821294&fm=26&gp=0.jpg',
    name: '一般用户'
  }
}

module.exports = [
  // user login
  // {
  //   url: '/vue-admin-template/user/login',
  //   type: 'post',
  //   response: config => {
  //     const { username } = config.body
  //     const token = tokens[username]

  //     // mock error
  //     if (!token) {
  //       return {
  //         code: 60204,
  //         message: 'Account and password are incorrect.'
  //       }
  //     }

  //     return {
  //       code: 20000,
  //       data: token
  //     }
  //   }
  // },

  // get user info
  {
    url: '/login/getLoginUserInfo',
    type: 'post',

    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!token) {
        return {
          code: 401,
          message: '登陆失败'
        }
      }

      return {
        code: 200,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]
