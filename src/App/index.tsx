import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Routes } from 'routes';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <meta name='description' content='Web' />
      </Helmet>
      <Routes />
      {/* <ErrorMessage /> */}
    </HelmetProvider>
  );
}

export default App;
