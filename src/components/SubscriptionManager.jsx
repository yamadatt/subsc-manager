import { useState, useEffect } from 'react'
import './SubscriptionManager.css'

function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('JPY')
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [exchangeRate, setExchangeRate] = useState(null)

  useEffect(() => {
    if (currency === 'USD') {
      fetch('https://open.er-api.com/v6/latest/USD')
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates.JPY))
        .catch(() => {})
    }
  }, [currency])

  const handleSubmit = (e) => {
    e.preventDefault()
    let jpyPrice = parseFloat(price)
    if (currency === 'USD' && exchangeRate) {
      jpyPrice = parseFloat(price) * exchangeRate
    }
    const newSub = {
      name,
      price: parseFloat(price),
      currency,
      billingCycle,
      jpyPrice,
    }
    setSubscriptions([...subscriptions, newSub])
    setName('')
    setPrice('')
  }

  return (
    <div className="subsc-container">
      <h1>Subscription Manager</h1>
      <form onSubmit={handleSubmit} className="subsc-form">
        <input
          type="text"
          placeholder="Service name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="JPY">JPY</option>
          <option value="USD">USD</option>
        </select>
        <select
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value)}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button type="submit">Add</button>
      </form>
      <ul className="subsc-list">
        {subscriptions.map((sub, idx) => (
          <li key={idx}>
            {sub.name}: {sub.price} {sub.currency} ({sub.billingCycle})
            {sub.currency === 'USD' && exchangeRate && (
              <span> → {sub.jpyPrice.toFixed(0)} JPY</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SubscriptionManager
