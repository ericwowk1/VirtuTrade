import React from 'react';

type UserItemProps = {
  name: string;
}

export default function UserItem({ name }: UserItemProps) {
  return (
    <div className="p-2 border border-gray-200 rounded mb-2 bg-gray-50">
      <p>User: <strong>{name}</strong></p>
      <p className="text-sm text-gray-500">This is a nested component inside UsersList</p>
    </div>
  );
}