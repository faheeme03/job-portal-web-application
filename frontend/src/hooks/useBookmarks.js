import { useState, useEffect } from 'react';

export function useBookmarks() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('savedJobs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(bookmarkedJobs));
  }, [bookmarkedJobs]);

  const toggleBookmark = (jobId) => {
    setBookmarkedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const isBookmarked = (jobId) => bookmarkedJobs.includes(jobId);

  return { bookmarkedJobs, toggleBookmark, isBookmarked };
}
