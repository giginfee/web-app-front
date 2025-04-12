export const GET_ISSUE = gql`
  query findOneIssue($id: Int!) {
    findOneIssue(id: $id) {
      __typename
      ... on Issue {
        id
        title
        body
        isResolved
        isActive
        category
        userId
        user {
          name
        }
        createdAt
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const GET_ISSUES = gql`
  query getIssues(
    $limit: Int!
    $offset: Int!
    $category: String
    $isResolved: Boolean
    $title: String
    $userId: Int
  ) {
    getIssues(
      limit: $limit
      offset: $offset
      category: $category
      isResolved: $isResolved
      title: $title
      userId: $userId
    ) {
      __typename
      ... on Issues {
        issues {
          id
          title
          body
          isResolved
          isActive
          category
          userId
        }
        total
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const GET_COMMENTS = gql`
  query getComments($limit: Int!, $offset: Int!, $issueId: Int!) {
    getComments(limit: $limit, offset: $offset, issueId: $issueId) {
      __typename
      ... on Comments {
        comments {
          id
          body
          userId
          issueId
          user {
            name
          }
          createdAt
        }
        total
      }
      ... on InternalError {
        message
      }
    }
  }
`;
