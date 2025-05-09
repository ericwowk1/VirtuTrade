import React from 'react';
import Link from 'next/link';
import UsersList from '../components/UserList';

export default function UsersPage() {
  // Simple array of names for testing
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "Dave",
    "Eve"
  ];

  return (
    <div>
      <h1>Users Page</h1>
      <Link href="/">Back to Home</Link>
      
      {/* The UsersList component only mounts when on the /users route */}
      <UsersList names={names} />
    </div>
  );
}