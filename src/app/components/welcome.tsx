import React from 'react';

type WelcomeProps = {
  title: string;
  description: string;
}

export default function welcome({ title, description }: WelcomeProps) {
  return (
    <div className="text-center my-8 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-lg">{description}</p>
    </div>
  );
}