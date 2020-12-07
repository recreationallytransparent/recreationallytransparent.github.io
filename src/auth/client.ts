import {GraphQLClient} from "graphql-request/dist";

const githubBaseUrl = "https://github.com"

export const getClient = () => {
    const client = new GraphQLClient(githubBaseUrl)
    return client
}