import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Initial state
const state = {
};

// Actions
const actions = {
};

// Mutations
const mutations = {
};

// Getters
const getters = {
};

import h2b from './store/h2bStore';
const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules: { h2b }
});

export default store;
