<template>
    <div class="root">
        <H2BDebug></H2BDebug>

        <h2>Received:</h2>
        <span>{{ received.message }}</span>
        <pre>{{ received }}</pre>

        <h2>Sent:</h2>
        <span>{{ sent.message }}</span>
        <pre>{{ sent }}</pre>

        <h2>Answers:</h2>
        <ul>
            <li v-for="answer in answers"><a href="#" @click.prevent="sendMessage(answer)">{{ answer }}</a></li>
        </ul>
    </div>
</template>

<script>
import store from '../services/store'

import './Example.scss';

import H2BDebug from './h2bdebug/H2BDebug';

export default {
    name: 'H2B-Example',
    store,
    components: {
        H2BDebug
    },
    computed: {
        received() { return this.$store.state.h2b.received; },
        sent() { return this.$store.state.h2b.sent; },
        answers() { return this.$store.state.h2b.received.items },
    },
    methods: {
        startSession() {
            this.$store.dispatch('h2bStartSession').then((msg) => {
                // Console.log("Initiated session");
            });
        },
        sendMessage(message) {
            this.$store.dispatch('h2bSend', {
                token: this.$store.state.h2b.token,
                message: message
            }).then((res) => {
                // Console.log("Received a new message");
            });
        }
    },
    created() {
        if (this.$store.state.h2b.token == '') {
            setTimeout(() => {
                this.startSession();
            }, 200);
        }
    }
}

</script>