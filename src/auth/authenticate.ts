import {GraphQLClient} from "graphql-request/dist";

let state = window.localStorage.getItem('githubstate')
if (state === null) {
    const array = new Uint32Array(4)
    const random = window.crypto.getRandomValues(array)
    state = random.join()
    window.localStorage.setItem('githubstate', state)
}

const search = window.location.search
const urlParams = new URLSearchParams(search)
const code = urlParams.get('code')
const urlState = urlParams.get('state')

const clientId = 'Iv1.708928d7c0f0f32d'
// todo put this somewhere else
const clientSecret = 'd2197f9c128e15ab080695591f00d765308ceed4'

const redirectToOAuthFlow = () => {
    const parts = encodeURIComponent(window.location.toString())
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${parts}&state=${state}`
}

interface GitHubToken {
    access_token: string,
    expires_in: string
    refresh_token: string,
    refresh_token_expires_in: string
    scope: string
    token_type: string
}

const exchangeGithubCodeForToken(code: string, state: string, ): Promise<GitHubToken> {

}

const authenticate = (client: GraphQLClient) => {
    if (code === null) {
        redirectToOAuthFlow()
    } else if (urlState !== state) {
        throw Error('hax0r')
    } else {

    }


}