import React from 'react';

function Navbar() {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <h1>SmartBudget</h1>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
        <li>Dashboard</li>
        <li>Transactions</li>
        <li>Budgets</li>
        <li>Login/Register</li>
      </ul>
    </nav>
  );
}

export default Navbar;
