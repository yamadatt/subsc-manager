import React, { useState } from 'react';

function SubscriptionForm({ rate, onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('JPY');
  const [interval, setInterval] = useState('monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    onAdd({ name, price: Number(price), currency, interval });
    setName('');
    setPrice('');
  };

  const convertedPrice = currency === 'USD' && rate ? (price * rate).toFixed(0) : price;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="サービス名"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="価格"
        required
      />
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="JPY">円</option>
        <option value="USD">ドル</option>
      </select>
      <select value={interval} onChange={(e) => setInterval(e.target.value)}>
        <option value="monthly">月額</option>
        <option value="yearly">年額</option>
      </select>
      {currency === 'USD' && rate && (
        <p className="hint">約 {convertedPrice} 円</p>
      )}
      <button type="submit">追加</button>
    </form>
  );
}

export default SubscriptionForm;
