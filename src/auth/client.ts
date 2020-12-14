import {GraphQLClient} from "graphql-request/dist";


export const getClient = () => {
    const client = new GraphQLClient("https://api.github.com/graphql")
    return client
}