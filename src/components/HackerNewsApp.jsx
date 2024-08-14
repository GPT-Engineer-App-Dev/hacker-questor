import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const fetchTopStories = async () => {
  const { data } = await axios.get('https://hn.algolia.com/api/v1/search?tags=front_page');
  return data.hits;
};

const HackerNewsApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading stories</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ul className="space-y-4">
        {filteredStories.map(story => (
          <li key={story.objectID} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{story.title}</h2>
            <p className="text-gray-600">Upvotes: {story.points}</p>
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Read more
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HackerNewsApp;