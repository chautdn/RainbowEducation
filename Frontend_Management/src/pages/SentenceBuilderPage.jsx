import React from 'react';
import SentenceBuilder from '../components/lesson/SentenceBuilder';

const SentenceBuilderPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <SentenceBuilder />
      </div>
    </div>
  );
};

export default SentenceBuilderPage; 