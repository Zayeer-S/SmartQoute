import React from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import './CustomerPage.css';
import CustomerSidebar from '../../pages/customer/CustomerSidebar';

interface Props {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<Props> = ({ children }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`customerPage ${isCollapsed ? 'sidebarCollapsed' : ''}`}
      data-testid="customer-layout"
    >
      <CustomerSidebar />
      <main className="main" data-testid="customer-main">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
