import Vue from 'vue';
import api from '../api';

const h2bStates = {
    READY: 'ready',
    SENDING: 'sending',
};

const h2bStore = {
    // Initial state
    state: {
        received: {},
        sent: {},
        token: '',
        status: h2bStates.READY
    },

    // Actions
    actions: {
        h2bStartSession ({commit} ) {
            commit('h2bSetStatus', h2bStates.SENDING);


            // ----- START
            // A fake temporary response that simulates H2B messages
            let fakeResponse = {
                "message": "Dit is de vraag die gesteld wordt of het bericht van de bot.",
                "items": [
                    "Dit zijn",
                    "de mogelijke",
                    "antwoorden."
                ],
                "token": "GgFJQ7EfHh8UWHQa42YpfFlFQNMqZ1NFRQlpjaFviTxcuVkEffNVdWCgcqL8"
            };
            return new Promise(
                (resolve, reject) => {
                    setTimeout(() => {
                        resolve("");
                        commit('h2bReceive', fakeResponse);
                        commit('h2bStartSession', fakeResponse.token);
                        commit('h2bSetStatus', h2bStates.READY);
                    }, 1000);
                }
            );
            // ----- END


            // If you have a valid message route
            return api.post( api.routes.message, {} ).do((response) => {
                commit('h2bReceive', response);
                commit('h2bStartSession', response.token);
                commit('h2bSetStatus', h2bStates.READY);
            }).toPromise();
        },
        h2bCloseSession ({commit}) {
            commit('h2bCloseSession');
        },
        h2bSend ({commit}, message) {
            commit('h2bSetStatus', h2bStates.SENDING);
            commit('h2bHasSent', message);


            // ----- START
            // A fake temporary response that simulates H2B messages
            let fakeResponse = {
                "message": "De bot heeft ontvangen: " + message.message + ", en stuurt dit terug.",
                "items": [
                    "Nog twee",
                    "antwoorden."
                ],
                "token": "GgFJQ7EfHh8UWHQa42YpfFlFQNMqZ1NFRQlpjaFviTxcuVkEffNVdWCgcqL8"
            };
            return new Promise(
                (resolve, reject) => {
                    setTimeout(() => {
                        resolve("");
                        commit('h2bReceive', fakeResponse);
                        commit('h2bSetStatus', h2bStates.READY);
                    }, 1000);
                }
            );
            // ----- END


            // If you have a valid message route
            return api.post( api.routes.message, message ).do( (response) => {
                commit('h2bReceive', response);
                commit('h2bSetStatus', h2bStates.READY);
            }).toPromise();
        },
    },

    // Mutations
    mutations: {
        h2bSetStatus (state, status) {
            state.status = status;
        },
        h2bHasSent (state, message) {
            state.sent = message;
        },
        h2bReceive (state, message) {
            state.received = message;
        },
        h2bStartSession (state, token) {
            state.token = token;
            state.status = h2bStates.READY;
        },
        h2bCloseSession (state) {
            state.received = {};
            state.sent = {};
            state.token = '';
            state.status = h2bStates.READY;
        }
    },

    // Getters
    getters: {
        h2bCanSend: state => {
            return (state.status == h2bStates.READY);
        }
    }
};

export default h2bStore;