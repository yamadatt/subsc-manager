import React, { useState } from 'react';
import SubscriptionForm from './components/SubscriptionForm';
import SubscriptionList from './components/SubscriptionList';
import useExchangeRate from './hooks/useExchangeRate';
import './index.css';

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const { rate, loading } = useExchangeRate();

  const addSubscription = (sub) => {
    setSubscriptions([...subscriptions, sub]);
  };

  return (
    <div className="container">
      <h1>Subsc Manager</h1>
      {loading && <p>Loading exchange rate...</p>}
      <SubscriptionForm rate={rate} onAdd={addSubscription} />
      <SubscriptionList items={subscriptions} rate={rate} />
    </div>
  );
}

export default App;
