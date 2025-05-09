import React from 'react';
import UserItem from './UserItem';

type UsersListProps = {
  names: string[];
};

export default function UsersList({ names }: UsersListProps) {
  return (
    <div className="p-4 border border-blue-200 rounded bg-blue-50">
      <h2 className="text-xl font-bold mb-4">Users List</h2>
      <p className="mb-4">This component receives data from the users page and passes it to child components</p>
      
      {/* Each name is passed down to a UserItem component */}
      {names.map((name, index) => (
        <UserItem key={index} name={name} />
      ))}
    </div>
  );
}