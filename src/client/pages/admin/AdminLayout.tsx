import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/contexts/useAuth';
import { CLIENT_ROUTES } from '../../constants/client.routes';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logout();
    void navigate(CLIENT_ROUTES.LOGIN);
  };

  const fullName = user
    ? [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ')
    : '';

  return (
    <div data-testid="admin-layout">
      <nav aria-label="Admin navigation">
        <span>Smartquote</span>

        <ul role="list">
          <li>
            <NavLink to={CLIENT_ROUTES.ADMIN.TICKETS} data-testid="nav-tickets">
              Tickets
            </NavLink>
          </li>
          <li>
            <NavLink to={CLIENT_ROUTES.ADMIN.QUOTES} data-testid="nav-quotes">
              Quotes
            </NavLink>
          </li>
          <li>
            <NavLink to={CLIENT_ROUTES.ADMIN.ANALYTICS} data-testid="nav-analytics">
              Analytics
            </NavLink>
          </li>
          <li>
            <NavLink to={CLIENT_ROUTES.ADMIN.SLA_POLICIES} data-testid="nav-sla-policies">
              SLA Policies
            </NavLink>
          </li>
          <li>
            <NavLink to={CLIENT_ROUTES.ADMIN.SETTINGS} data-testid="nav-settings">
              Settings
            </NavLink>
          </li>
        </ul>

        <div>
          {user && (
            <div data-testid="sidebar-user">
              <span>{fullName}</span>
              <span>{user.role.name}</span>
            </div>
          )}
          <button type="button" onClick={() => void handleLogout()} data-testid="logout-btn">
            Sign out
          </button>
        </div>
      </nav>

      <main data-testid="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
