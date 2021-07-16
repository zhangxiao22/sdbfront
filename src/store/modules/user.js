import { getUserInfo, logout } from '@/api/api'
import router, { resetRouter } from '@/router'
import { removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    userName: '',
    userId: '',
    jobId: '',
    jobName: '',
    orgId: '',
    orgInfoList: [],
    permissionPack: { label: '', value: '' }
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_STATE: (state, data) => {
    Object.assign(state, data)
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  // SET_NAME: (state, name) => {
  //   state.userName = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_ROLES: (state, roles) => {
    state.permissionPack.label = roles
  }
}

const actions = {
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log('process.env =', process.env)
      getUserInfo().then(response => {
        const { data } = response

        commit('SET_STATE', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        commit('SET_ROLES', [])
        this.commit('permission/SET_ROUTES', [])
        resolve()
      })
        .catch(error => {
          reject(error)
        })
    })
  }

  // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     // removeToken() // must remove  token  first
  //     commit('RESET_STATE')
  //     commit('SET_ROLES', [])

  //     resolve()
  //   })
  // }
  // dynamically modify permissions
  // async changeRoles({ commit, dispatch }, role) {
  //   // const token = role + '-token'

  //   // commit('SET_TOKEN', token)
  //   // setToken(token)

  //   const { roles } = await dispatch('getInfo')

  //   resetRouter()

  //   // generate accessible routes map based on roles
  //   const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
  //   // dynamically add accessible routes
  //   router.addRoutes(accessRoutes)

  //   // reset visited views and cached views
  //   dispatch('tagsView/delAllViews', null, { root: true })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

