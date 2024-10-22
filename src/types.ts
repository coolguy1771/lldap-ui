export type User = {
  avatar: string;
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  creationDate: string;
  uuid: string;
  attributes: { name: string; value: string[] }[];
  groups: Group[];
};

export type Group = {
  id: number;
  displayName: string;
  creationDate: string;
  uuid: string;
  attributes: { name: string; value: string[] }[];
  users: User[];
};
