import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CLIENT_ROUTES } from '../constants/client.routes';

const NotFoundPage: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <main data-testid="not-found-page">
      <h1>404</h1>
      <p>
        The page <code>{pathname}</code> could not be found.
      </p>
      <Link to={CLIENT_ROUTES.LOGIN} data-testid="not-found-home-link">
        Go to sign in
      </Link>
    </main>
  );
};

export default NotFoundPage;
