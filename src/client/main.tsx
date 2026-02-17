import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import CustomerPage from './pages/customer/CustomerPage';
import CreateTicketPage from './pages/customer/CreateTicketPage';
import AdminPage from './pages/admin/AdminPage';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/customer' element={<CustomerPage />} />
        <Route path='/customer/create' element={<CreateTicketPage />} />
        <Route path='/admin' element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

