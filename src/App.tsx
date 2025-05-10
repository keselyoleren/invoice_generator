import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext';
import Layout from './components/Layout';
import InvoiceList from './pages/InvoiceList';
import CreateInvoice from './pages/CreateInvoice';
import EditInvoice from './pages/EditInvoice';

function App() {
  return (
    <InvoiceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<InvoiceList />} />
            <Route path="create" element={<CreateInvoice />} />
            <Route path="edit/:id" element={<EditInvoice />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </InvoiceProvider>
  );
}

export default App;