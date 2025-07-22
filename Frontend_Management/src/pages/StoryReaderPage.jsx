import React from 'react';
import StoryReader from '../components/lesson/StoryReader';

const StoryReaderPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <StoryReader />
      </div>
    </div>
  );
};

export default StoryReaderPage; 