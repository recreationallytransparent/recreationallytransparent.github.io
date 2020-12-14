import {GraphQLClient} from "graphql-request/dist";

let cachedState = window.localStorage.getItem('githubstate')
const cachedToken = window.localStorage.getItem('githubtoken')
let state: string
if (cachedState === null) {
    const array = new Uint32Array(4)
    const random = window.crypto.getRandomValues(array)
    state = random.join()
    window.localStorage.setItem('githubstate', state)
} else {
    state = cachedState
}

const search = window.location.search
const urlParams = new URLSearchParams(search)
const code = urlParams.get('code')
const urlState = urlParams.get('state')
const clientId = 'Iv1.708928d7c0f0f32d'


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
    expires: number
}

interface GithubErrorResponse {
    error: string
    error_description: string
    error_url: string
}

function isToken(x: GitHubToken | GithubErrorResponse): x is GitHubToken {
    return (x as GitHubToken).access_token !== undefined
}

function expired(x: GitHubToken): boolean {
    return x.expires < (new Date().getTime() / 1000)
}

async function exchangeGithubCodeForToken (code: string, state: string, redirectUri: string): Promise<GitHubToken | GithubErrorResponse>  {
    const endpoint = 'https://e3s7u0c1fg.execute-api.ap-southeast-2.amazonaws.com/token'
    const request = fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({code, state, redirect_url: redirectUri})
    }).then(x => x.json())
        .then(json => {
            if (json.error) {
                return json as GithubErrorResponse
            }

            const x: GitHubToken = {
                ...json,
                expires: (new Date().getTime() / 1000) + json.expires_in
            }
            return x
        })
        .catch(e => {
            console.error('wow = ', e)
            throw e
        })

    return request
}

function setBearer(client: GraphQLClient, token: GitHubToken): GraphQLClient {
    console.log('set bearer: ', token)
    client.setHeaders({
        authorization: `Bearer ${token.access_token}`
    })
    return client
}

export async function authenticate(client: GraphQLClient): Promise<GraphQLClient> {
    const parsedCachedToken = cachedToken ? JSON.parse(cachedToken) as GitHubToken : undefined
    console.log('parsed cached token ' , cachedToken)
    if (parsedCachedToken && !expired(parsedCachedToken)) {
        console.log('using cached token: ', parsedCachedToken)
        return setBearer(client, parsedCachedToken)
    }
    if (code === null) {
        redirectToOAuthFlow()
        return client
    } else if (urlState !== state) {
        throw Error('hax0r')
    } else {
        const token = await exchangeGithubCodeForToken(code, state, encodeURIComponent(window.location.toString()))
        if (isToken(token)) {
            console.log('token = ', token)
            window.localStorage.setItem('githubtoken', JSON.stringify(token))
            return setBearer(client, token)
        } else {
            console.error('error getting token: ', token)
            throw Error(token.error)
        }

    }
}