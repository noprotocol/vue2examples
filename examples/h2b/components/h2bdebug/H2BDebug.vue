<template>
    <div class="h2b-debug">
        <transition name="h2b-debug-button-transition">
            <div v-if="!isActive" class="h2b-debug-button" @click="isActive = true">
                debug
            </div>
        </transition>

        <transition name="h2b-debug-window-transition">
            <div v-if="isActive" class="h2b-debug-window" v-bind:class="{ 'm-loading': isLoading }">
                <button class="h2b-close-button" @click="isActive = false"></button>

                <div v-if="hasToken" class="h2b-code">
                    Session token:<br/><span class="h2b-em">{{ this.$store.state.h2b.token }}</span>
                    <ul>
                        <li><a href="#" class="h2b-link" @click.prevent="startSession()">Reset session</a></li><!--
                        --><li><a href="#" class="h2b-link" @click.prevent="closeSession()">Close session</a></li>
                    </ul>
                </div>
                <div v-else-if="canSend" class="h2b-code">
                    <ul><li><a href="#" class="h2b-link" @click.prevent="startSession()">Start session</a></li></ul>
                </div>
                <div v-else class="h2b-code">
                    <ul><li>Starting session...</li></ul>
                </div>

                <div v-if="hasToken">
                    <div class="h2b-code">
                        Send message:<br/>
                        <input type="text" v-model="customMessage" @keyup.enter="sendMessage(customMessage)"/><br/>
                        <ul class="h2b-suggestions" v-if="answers">
                            <li v-for="answer in answers"><a href="/#" class="h2b-suggestion" @click.prevent="sendMessage(answer)">"{{ answer }}" </a></li>
                        </ul>
                    </div>

                    <div class="h2b-code">
                        Autocomplete: <span class="h2b-suggestion m-no-click">{ from start }</span>
                        <ul>
                            <li v-for="(list, name) in autocompletes"><a href="/#" class="h2b-link" @click.prevent="autocomplete(name)">{{ name }}</a></li>
                        </ul>
                    </div>
                </div>

                <div v-if="hasToken">
                    <div class="h2b-code">
                        Last received:
                        <a href="/#" class="h2b-suggestion" @click.prevent="expandReceived = false" v-if="expandReceived">{ collapse }</a>
                        <a href="/#" class="h2b-suggestion" @click.prevent="expandReceived = true" v-else>{ expand }</a>
                        <pre v-if="expandReceived">{{ lastReceived }}</pre>
                    </div>
                </div>

                <div v-if="hasToken">
                    <div class="h2b-code">
                        Last sent:
                        <a href="/#" class="h2b-suggestion" @click.prevent="expandSent = false" v-if="expandSent">{ collapse }</a>
                        <a href="/#" class="h2b-suggestion" @click.prevent="expandSent = true" v-else>{ expand }</a>
                        <pre v-if="expandSent">{{ lastSent }}</pre>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import Vue from 'vue';
    import './H2BDebug.scss';

    let autocompletes = {
        'Junior':           ["Start", "Ik ben al lid", "18 jaar of jonger"],
        'Basis':            ["Start", "Ik ben al lid", "Van 26 tot 67 jaar", "Ja", "elk kwartaal", "1 of 2 items per keer", "Ja"],
        'Basis 67+':        ["Start", "Ik ben al lid", "Ouder dan 67 jaar", "Ja", "elke 2 maanden", "3 tot 8 items per keer", "Ja"],
        'Totaal':           ["Start", "Ik ben al lid", "Van 26 tot 67 jaar", "Ja", "elke week", "meer dan 8 items per keer", "Ja"],
        'Totaal Jongeren':  ["Start", "Ik ben al lid", "Van 19 tot 25 jaar", "Ja", "1 tot 2 keer per maand", "3 tot 8 items per keer", "Ja"],
        'PC':               ["Start", "Ik ben al lid", "Van 26 tot 67 jaar", "Nee"],
    };

    export default {
        data: () => ({
            customMessage: "",
            isActive: true,
            isLoading: false,
            expandReceived: false,
            expandSent: false,
            autocompletes: autocompletes,
        }),
        computed: {
            hasToken() { return (this.$store.state.h2b.token != ''); },
            canSend() { return (this.$store.getters.h2bCanSend); },
            lastReceived() { return this.$store.state.h2b.received; },
            lastSent() { return this.$store.state.h2b.sent; },
            answers() { let tAns = { ...this.$store.state.h2b.received.items }; Vue.set(tAns, 'static', '_static_'); return tAns; },
        },
        methods: {
            autocomplete( index ) {
                let list = autocompletes[index].slice(0);
                if (typeof list != 'undefined') {
                    this.isLoading = true;
                    this.queueH2BSend( list );
                }
            },
            queueH2BSend( queue ) {
                if (queue.length > 0) {
                    let token = this.$store.state.h2b.token;
                    this.$store.dispatch('h2bSend', {
                        token: token,
                        message: queue[0]
                    }).then((msg) => {
                        console.log(queue);
                        queue.shift();
                        this.queueH2BSend( queue );
                    });
                }
                else {
                    // Parse: this.$store.state.h2b.received
                    this.isLoading = false;
                }
            },
            startSession() {
                this.isLoading = true;
                this.$store.dispatch('h2bCloseSession');
                this.$store.dispatch('h2bStartSession').then((msg) => {
                    // Parse: msg
                    this.isLoading = false;
                });
            },
            closeSession() {
                this.$store.dispatch('h2bCloseSession');
            },
            sendMessage( message ) {
                this.isLoading = true;
                let token = this.$store.state.h2b.token;
                this.$store.dispatch('h2bSend', {
                    token: token,
                    message: message
                }).then((msg) => {
                    // Parse: msg
                    this.isLoading = false;
                    this.customMessage = "";
                });
            },
        }
    }
</script>
