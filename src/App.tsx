import React from 'react'
import {GraphQLClient} from "graphql-request/dist";
import {ORGANISATIONS, ORGANISTAION_REPO} from "./graphql/queries";


export const App = (props: {client: GraphQLClient}) => {
    const organizationRepos = props.client.request(ORGANISATIONS).then(response => {
        console.log('response = ', response)
        // @ts-ignore
        response.viewer.organizations.nodes.map(o => {
            return props.client.request(ORGANISTAION_REPO, {organization: o.name})
        })
    })

    return (<div>app</div>)
}