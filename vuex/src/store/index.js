import Vue from "vue";
import Vuex from "../vuex/vuex";
import { setTimeout } from "core-js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    age: 10,
    name: "",
  },
  modules: {
    a: {
      state: {
        x: 1,
      },
      modules: {
        c: {
          state: {
            z: 3,
          },
        },
      },
    },
    b: {
      state: {
        y: 1,
      },
    },
  },
  getters: {
    myAge(state) {
      return state.age + 10;
    },
  },
  actions: {
    subAge({ commit }, data) {
      setTimeout(() => {
        commit("subAge", data);
        commit("setName", `name${Math.random(1)}`);
      }, 1000);
    },
  },
  mutations: {
    addAge(state, data) {
      state.age += data;
    },
    subAge(state, data) {
      state.age -= data;
    },
    setName(state, data) {
      state.name = data;
    },
  },
});
