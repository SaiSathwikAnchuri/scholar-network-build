// This page is no longer needed as we redirect to dashboard
// But keeping it for fallback purposes

import { Navigate } from 'react-router-dom';

const Index = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Index;
