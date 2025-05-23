import React from 'react';
import useProcessPage from './hooks/useProcessPage';
import ProcessPageForm from './ProcessPageForm';
import ProcessPageResults from './ProcessPageResults';

/**
 * ProcessPage - Main video processing page
 * Uses modular components for clean separation of concerns
 */
const ProcessPage = () => {
  // Get all state and handlers from custom hook
  const hookData = useProcessPage();
  
  const {
    // State
    results,
    // ... (all other state is passed to child components)
  } = hookData;

  return (
    <div className="section">
      {!results ? (
        <ProcessPageForm {...hookData} />
      ) : (
        <ProcessPageResults {...hookData} />
      )}
    </div>
  );
};

export default ProcessPage;
