import React from 'react';
import { Link } from 'react-router-dom';
import { CLIENT_ROUTES } from '../../constants/client.routes';

const CantAccessPage: React.FC = () => {
  return (
    <main data-testid="cant-access-page">
      <h1>Can't access your account?</h1>
      <p>
        If you have forgotten your password or are having trouble signing in, please contact your
        administrator or support team directly to have your access restored.
      </p>
      <Link to={CLIENT_ROUTES.LOGIN} data-testid="back-to-login">
        Back to sign in
      </Link>
    </main>
  );
};

export default CantAccessPage;
