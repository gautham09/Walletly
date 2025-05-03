// src/pages/Wallet.tsx
import { useState } from 'react';
import axios from 'axios';
import SideBar from '../components/SideBar';
import { BACKEND_URL } from '../config';
import { AppBar } from '../components/Appbar';
import { useUser } from '../atoms/usecontext';

export default function Wallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>('');

  const { user } = useUser();

  // Dummy bank list
  const banks = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'];

  const fetchBalance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/wallet/balance`, { withCredentials: true });
      setBalance(res.data.balance);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedBank) {
      alert('Please select a bank to withdraw');
      return;
    }
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert('Please enter a valid amount to withdraw');
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/wallet/withdraw`, 
        { 
          bankProvider: selectedBank,
          amount: withdrawAmount 
        }, 
        { withCredentials: true }
      );
      alert(`Withdrawal of ₹${res.data.withdrawnAmount} to ${selectedBank} successful`);
      setWithdrawAmount('');  // Clear input
      fetchBalance(); // Refresh balance
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to withdraw');
    }
  };

  return (
    <div>
      <AppBar name={user?.name ?? 'Anonymous'} />
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-bold mb-6">Wallet</h1>

          <button
            onClick={fetchBalance}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            {loading ? 'Loading...' : 'Show Balance'}
          </button>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {balance !== null && (
            <>
              <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-xl font-semibold">Balance: ₹ {balance}</h2>
              </div>

              <label className="block mb-2 font-medium">Select Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">-- Select Bank --</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>

              <label className="block mb-2 font-medium">Enter Amount to Withdraw</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Enter amount in ₹"
                className="w-full p-2 border rounded mb-4"
                min="1"
              />

              <button
                onClick={handleWithdraw}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Withdraw Money
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
