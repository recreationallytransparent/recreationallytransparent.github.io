import {gql} from 'graphql-request'

export const ORGANISATIONS = gql`
  query {
    viewer {
      resourcePath
      login
      name
      avatarUrl
      organizations(first: 10) {
        nodes {
          resourcePath
          name
          avatarUrl
          repositories(
        first: 100
        affiliations: [ORGANIZATION_MEMBER]
        ownerAffiliations: [ORGANIZATION_MEMBER]
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        nodes {
          name
           pullRequests(first: 10) {
            nodes {
            changedFiles
            }
           }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
        }
      }
      
    }
  }
`

export const ORGANISTAION_REPO = gql`
  query organisation($organization: String!, $after: String) {
    organization(login: $organization) {
      repositories(
        first: 100
        affiliations: [ORGANIZATION_MEMBER]
        ownerAffiliations: [ORGANIZATION_MEMBER]
        orderBy: { field: UPDATED_AT, direction: DESC }
        after: $after
      ) {
        nodes {
          name
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`