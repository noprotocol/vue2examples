import Vue from 'vue'
import Example from './components/Example'


const example = new Vue(Example)
example.$mount('example')

// Inject webpack's livereload script, when it's not embedded into the bundle but the dev-server is running.
if (INJECT_WEBPACK_DEV_SERVER_SCRIPT && location.hostname === 'localhost') {
    const s = document.createElement('script')
    s.async = true
    s.src = 'http://localhost:8080/webpack-dev-server.js'
    document.head.appendChild(s)
}
