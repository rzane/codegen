import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost?: Maybe<Post>;
};


export type MutationCreatePostArgs = {
  data: PostInput;
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type PostInput = {
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  post?: Maybe<Post>;
};


export type QueryPostArgs = {
  id: Scalars['ID'];
};

export type PostVariables = {
  id: Scalars['ID'];
};


export type Post = { __typename?: 'Query', post?: Maybe<{ __typename?: 'Post', id: string, title: string }> };

export type CreatePostVariables = {
  data: PostInput;
};


export type CreatePost = { __typename?: 'Mutation', createPost?: Maybe<{ __typename?: 'Post', id: string, title: string }> };


export const PostDocument = gql`
    query Post($id: ID!) {
  post(id: $id) {
    id
    title
  }
}
    `;

/**
 * __usePost__
 *
 * To run a query within a React component, call `usePost` and pass it any options that fit your needs.
 * When your component renders, `usePost` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePost({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePost(baseOptions?: ApolloReactHooks.QueryHookOptions<Post, PostVariables>) {
        return ApolloReactHooks.useQuery<Post, PostVariables>(PostDocument, baseOptions);
      }
export function usePostLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Post, PostVariables>) {
          return ApolloReactHooks.useLazyQuery<Post, PostVariables>(PostDocument, baseOptions);
        }
export type PostHookResult = ReturnType<typeof usePost>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostQueryResult = ApolloReactCommon.QueryResult<Post, PostVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($data: PostInput!) {
  createPost(data: $data) {
    id
    title
  }
}
    `;
export type CreatePostMutationFn = ApolloReactCommon.MutationFunction<CreatePost, CreatePostVariables>;

/**
 * __useCreatePost__
 *
 * To run a mutation, you first call `useCreatePost` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePost` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPost, { data, loading, error }] = useCreatePost({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePost(baseOptions?: ApolloReactHooks.MutationHookOptions<CreatePost, CreatePostVariables>) {
        return ApolloReactHooks.useMutation<CreatePost, CreatePostVariables>(CreatePostDocument, baseOptions);
      }
export type CreatePostHookResult = ReturnType<typeof useCreatePost>;
export type CreatePostMutationResult = ApolloReactCommon.MutationResult<CreatePost>;
export type CreatePostMutationOptions = ApolloReactCommon.BaseMutationOptions<CreatePost, CreatePostVariables>;