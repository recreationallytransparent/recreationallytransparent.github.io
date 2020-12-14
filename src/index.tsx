
import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import {App} from './App'
import {getClient} from "./auth/client";
import {authenticate} from "./auth/authenticate";
let base = process.env.PUBLIC_URL as string
if (!base) {
    base = 'http://localhost:3000'
}

const client = getClient()
authenticate(client).then(client => {
    ReactDOM.render(
        <React.StrictMode>
            <App client={client}/>
        </React.StrictMode>,
        document.getElementById('root')
    )
})



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()