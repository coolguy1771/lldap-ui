import { gql } from "@apollo/client";

export const ADD_USER_TO_GROUP = gql`
  mutation AddUserToGroup($user: String!, $group: Int!) {
    addUserToGroup(userId: $user, groupId: $group) {
      ok
    }
  }
`;

export const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!) {
    createGroup(name: $name) {
      id
      displayName
    }
  }
`;

export const CREATE_GROUP_ATRTIBUTES = gql`
  mutation CreateGroupAttribute(
    $name: String!
    $attributeType: AttributeType!
    $isList: Boolean!
    $isVisible: Boolean!
  ) {
    addGroupAttribute(
      name: $name
      attributeType: $attributeType
      isList: $isList
      isVisible: $isVisible
      isEditable: false
    ) {
      ok
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      creationDate
    }
  }
`;

export const CREATE_USER_ATTRIBUTE = gql`
  mutation CreateUserAttribute(
    $name: String!
    $attributeType: AttributeType!
    $isList: Boolean!
    $isVisible: Boolean!
    $isEditable: Boolean!
  ) {
    addUserAttribute(
      name: $name
      attributeType: $attributeType
      isList: $isList
      isVisible: $isVisible
      isEditable: $isEditable
    ) {
      ok
    }
  }
`;

export const DELETE_GROUP = gql`
  mutation DeleteGroupQuery($groupId: Int!) {
    deleteGroup(groupId: $groupId) {
      ok
    }
  }
`;

export const DELETE_GROUP_ATTRIBUTE = gql`
  mutation DeleteGroupAttributeQuery($name: String!) {
    deleteGroupAttribute(name: $name) {
      ok
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUserQuery($user: String!) {
    deleteUser(userId: $user) {
      ok
    }
  }
`;

export const DELETE_USER_ATTRIBUTE = gql`
  mutation DeleteUserAttributeQuery($name: String!) {
    deleteUserAttribute(name: $name) {
      ok
    }
  }
`;

export const GET_GROUP_BY_ID = gql`
  query GetGroupDetails($id: Int!) {
    group(groupId: $id) {
      id
      displayName
      creationDate
      uuid
      users {
        id
        displayName
      }
    }
  }
`;

export const GET_GROUPS = gql`
  query GetGroupList {
    groups {
      id
      displayName
      creationDate
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserDetails($id: String!) {
    user(userId: $id) {
      id
      email
      avatar
      displayName
      creationDate
      uuid
      groups {
        id
        displayName
      }
      attributes {
        name
        value
      }
    }
    schema {
      userSchema {
        attributes {
          name
          attributeType
          isList
          isVisible
          isEditable
          isHardcoded
          isReadonly
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query ListUsersQuery($filters: RequestFilter) {
    users(filters: $filters) {
      id
      email
      displayName
      firstName
      lastName
      creationDate
    }
  }
  query ListUserNames($filters: RequestFilter) {
    users(filters: $filters) {
      id
      displayName
    }
  }
`;

export const REMOVE_USER_FROM_GROUP = gql`
  mutation RemoveUserFromGroup($user: String!, $group: Int!) {
    removeUserFromGroup(userId: $user, groupId: $group) {
      ok
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      ok
    }
  }
`;
