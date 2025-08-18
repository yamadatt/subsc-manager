import { useState, useEffect } from 'react'
import './SubscriptionManager.css'

function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('JPY')
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [exchangeRate, setExchangeRate] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    currency: 'JPY',
    billingCycle: 'monthly'
  })

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
      id: Date.now(), // 一意のIDを追加
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

  const handleDelete = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id))
  }

  const handleEdit = (subscription) => {
    setEditingId(subscription.id)
    setEditForm({
      name: subscription.name,
      price: subscription.price.toString(),
      currency: subscription.currency,
      billingCycle: subscription.billingCycle
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      name: '',
      price: '',
      currency: 'JPY',
      billingCycle: 'monthly'
    })
  }

  const handleSaveEdit = (id) => {
    let jpyPrice = parseFloat(editForm.price)
    if (editForm.currency === 'USD' && exchangeRate) {
      jpyPrice = parseFloat(editForm.price) * exchangeRate
    }

    const updatedSubscriptions = subscriptions.map(sub => 
      sub.id === id 
        ? {
            ...sub,
            name: editForm.name,
            price: parseFloat(editForm.price),
            currency: editForm.currency,
            billingCycle: editForm.billingCycle,
            jpyPrice
          }
        : sub
    )
    
    setSubscriptions(updatedSubscriptions)
    setEditingId(null)
    setEditForm({
      name: '',
      price: '',
      currency: 'JPY',
      billingCycle: 'monthly'
    })
  }

  // 月額合計を計算（年額は12で割る）
  const calculateMonthlyTotal = () => {
    return subscriptions.reduce((total, sub) => {
      const monthlyPrice = sub.billingCycle === 'yearly' ? sub.jpyPrice / 12 : sub.jpyPrice
      return total + monthlyPrice
    }, 0)
  }

  return (
    <div className="subsc-container">
      <div className="header">
        <h1>💳 サブスクリプション管理</h1>
        <p className="subtitle">あなたのサブスクを一元管理</p>
      </div>

      <div className="form-card">
        <h2>新しいサブスクを追加</h2>
        <form onSubmit={handleSubmit} className="subsc-form">
          <div className="form-group">
            <label>サービス名</label>
            <input
              type="text"
              placeholder="Netflix, Spotify など"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>料金</label>
              <input
                type="number"
                step="0.01"
                placeholder="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>通貨</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="JPY">円 (JPY)</option>
                <option value="USD">ドル (USD)</option>
              </select>
            </div>
            <div className="form-group">
              <label>支払い周期</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
              >
                <option value="monthly">月額</option>
                <option value="yearly">年額</option>
              </select>
            </div>
          </div>
          <button type="submit" className="add-btn">
            ➕ 追加
          </button>
        </form>
      </div>

      {subscriptions.length > 0 && (
        <div className="summary-card">
          <h2>📊 月額合計</h2>
          <div className="total-amount">
            ¥{calculateMonthlyTotal().toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
            <span className="per-month">/月</span>
          </div>
          <p className="summary-text">
            {subscriptions.length}個のサブスクリプション
          </p>
        </div>
      )}

      {subscriptions.length > 0 ? (
        <div className="subscriptions-section">
          <h2>📋 サブスクリプション一覧</h2>
          <div className="table-container">
            <table className="subsc-table">
              <thead>
                <tr>
                  <th>サービス名</th>
                  <th>料金</th>
                  <th>支払い周期</th>
                  <th>円換算</th>
                  <th>月額換算</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub, index) => (
                  <tr 
                    key={sub.id} 
                    className="subsc-row"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="service-name-cell">
                      {editingId === sub.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="edit-input"
                        />
                      ) : (
                        <span className="service-name">{sub.name}</span>
                      )}
                    </td>
                    <td className="price-cell">
                      {editingId === sub.id ? (
                        <div className="edit-price-group">
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.price}
                            onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                            className="edit-input edit-price-input"
                          />
                          <select
                            value={editForm.currency}
                            onChange={(e) => setEditForm({...editForm, currency: e.target.value})}
                            className="edit-select"
                          >
                            <option value="JPY">JPY</option>
                            <option value="USD">USD</option>
                          </select>
                        </div>
                      ) : (
                        <span className="original-price">
                          {sub.price.toLocaleString()} {sub.currency}
                        </span>
                      )}
                    </td>
                    <td className="cycle-cell">
                      {editingId === sub.id ? (
                        <select
                          value={editForm.billingCycle}
                          onChange={(e) => setEditForm({...editForm, billingCycle: e.target.value})}
                          className="edit-select"
                        >
                          <option value="monthly">月額</option>
                          <option value="yearly">年額</option>
                        </select>
                      ) : (
                        <span className="billing-cycle">
                          {sub.billingCycle === 'monthly' ? '月額' : '年額'}
                        </span>
                      )}
                    </td>
                    <td className="jpy-cell">
                      {sub.currency === 'USD' && exchangeRate ? (
                        <span className="jpy-price">
                          ¥{sub.jpyPrice.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
                        </span>
                      ) : (
                        <span className="jpy-price">
                          ¥{sub.jpyPrice.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
                        </span>
                      )}
                    </td>
                    <td className="monthly-cell">
                      <span className="monthly-equivalent">
                        ¥{(sub.billingCycle === 'yearly' ? sub.jpyPrice / 12 : sub.jpyPrice).toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="action-cell">
                      {editingId === sub.id ? (
                        <div className="edit-actions">
                          <button 
                            className="save-btn"
                            onClick={() => handleSaveEdit(sub.id)}
                            title="保存"
                          >
                            ✅
                          </button>
                          <button 
                            className="cancel-btn"
                            onClick={handleCancelEdit}
                            title="キャンセル"
                          >
                            ❌
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEdit(sub)}
                            title="編集"
                          >
                            ✏️
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete(sub.id)}
                            title="削除"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📱</div>
          <h3>まだサブスクリプションがありません</h3>
          <p>上のフォームから最初のサブスクを追加してみましょう！</p>
        </div>
      )}
    </div>
  )
}

export default SubscriptionManager
