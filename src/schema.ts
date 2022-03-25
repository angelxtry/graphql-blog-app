import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    me: User
    posts: [Post!]!
    profile(userId: ID!): Profile
  }

  type Mutation {
    createPost(input: CreatePostInput!): PostPayload!
    updatePost(id: ID!, input: UpdatePostInput!): PostPayload!
    deletePost(postId: ID!): PostPayload!
    publishPost(postId: ID!): PostPayload!
    unPublishPost(postId: ID!): PostPayload!
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    profile: Profile
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  interface ErrorType {
    message: String!
  }

  type SignUpResultSuccess {
    success: Boolean!
  }

  type SignUpInvalidInputError implements ErrorType {
    message: String!
  }

  type SignUpAlreadyExistError implements ErrorType {
    message: String!
  }

  union SignUpPayload =
      SignUpResultSuccess
    | SignUpInvalidInputError
    | SignUpAlreadyExistError

  type SignInResultSuccess {
    token: String!
  }

  type SignInUserNotFoundError implements ErrorType {
    message: String!
  }

  type SignInInvalidPasswordError implements ErrorType {
    message: String!
  }

  union SignInPayload =
      SignInResultSuccess
    | SignInUserNotFoundError
    | SignInInvalidPasswordError

  type UserError {
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }

  input CreatePostInput {
    title: String!
    content: String!
  }

  input UpdatePostInput {
    title: String
    content: String
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
    bio: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }
`;
