import { LoginModel } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Local } from '@/utils/storage'

const state = {
  token: getToken(),
  phone: '',
  accountType: '',
  roles: ['admin']
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ACCOUNT_TYPE: (state, accountType) => {
    state.accountType = accountType
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      LoginModel.managerLogin({ data: userInfo }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_PHONE', data.phone)
        commit('SET_ACCOUNT_TYPE', data.accountType)
        commit('SET_ROLES', ['admin'])
        Local.set('user', data)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login
  setUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      const data = Local.get('user') || {}
      commit('SET_TOKEN', data.token)
      commit('SET_PHONE', data.phone)
      commit('SET_ACCOUNT_TYPE', data.accountType)
      commit('SET_ROLES', ['admin'])
      resolve()
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      Local.remove('user')
      removeToken()
      resetRouter()

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
