import gql from "graphql-tag";

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      ... on Token {
        token
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const REGISTER = gql`
  mutation register($name: String!, $email: String!, $password: String!) {
    register(data: { name: $name, email: $email, password: $password }) {
      ... on User {
        id
        name
        email
        isConfirmed
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const CREATE_ISSUE = gql`
  mutation createIssue($title: String!, $body: String!, $category: String!) {
    createIssue(data: { title: $title, body: $body, category: $category }) {
      ... on Issue {
        id
        title
        body
        userId
        isResolved
        isActive
        category
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const UPDATE_ISSUE = gql`
  mutation updateIssue(
    $id: Int!
    $title: String
    $body: String
    $category: String
    $isResolved: Boolean
  ) {
    updateIssue(
      id: $id
      data: {
        title: $title
        body: $body
        category: $category
        isResolved: $isResolved
      }
    ) {
      __typename
      ... on Issue {
        id
        title
        body
        userId
        isResolved
        isActive
        category
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const REMOVE_ISSUE = gql`
  mutation removeIssue($id: Int!) {
    removeIssue(id: $id) {
      __typename
      ... on InternalError {
        message
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation createComment($body: String!, $issueId: Int!) {
    createComment(data: { body: $body, issueId: $issueId }) {
      __typename
      ... on Comment {
        id
        body
        userId
        issueId
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation updateComment($id: Int!, $body: String!) {
    updateComment(id: $id, data: { body: $body }) {
      __typename
      ... on Comment {
        id
        body
        userId
        issueId
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($id: Int!) {
    removeComment(id: $id) {
      __typename
      ... on InternalError {
        message
      }
    }
  }
`;
