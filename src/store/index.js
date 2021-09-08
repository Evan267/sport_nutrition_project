import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    isAdmin: null,
    modif: false,
    visibleNav: true,
    userView: false
  },
  mutations: {
    viewUser(state, boolean) {
      state.userView = boolean;
    },
    viewNav(state, boolean) {
      state.visibleNav = boolean;
    },
    getUserId(state, userId) {
      state.user = userId;
    },
    getAdmin(state, admin) {
      state.isAdmin = admin;
    },
    modif(state, modification){
      state.modif = modification;
    }
  },
  actions: {
  },
  modules: {
  }
})
