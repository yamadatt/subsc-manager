import React from 'react';

function SubscriptionList({ items, rate }) {
  if (items.length === 0) return <p>登録されたサブスクはありません。</p>;

  const displayPrice = (item) => {
    const basePrice = item.currency === 'USD' && rate ? item.price * rate : item.price;
    return basePrice.toFixed(0) + '円';
  };

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item.name} - {displayPrice(item)} ({item.interval === 'monthly' ? '月額' : '年額'})
        </li>
      ))}
    </ul>
  );
}

export default SubscriptionList;
