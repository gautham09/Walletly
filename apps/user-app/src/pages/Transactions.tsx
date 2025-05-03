// src/pages/Transactions.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../components/SideBar';
import { BACKEND_URL } from "../config";
import { AppBar } from '../components/Appbar';
import { useUser } from '../atoms/usecontext';

type Transaction = {
  id: number;
  status: string;
  token: string;
  provider: string;
  amount: number;
  startTime: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const {user} = useUser();

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/wallet/transactions`, { withCredentials: true })
      .then(res => {
        setTransactions(res.data);
        console.log(`transactions = r${res.data}`);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch transactions', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
    <AppBar name={user?.name ?? 'Anonymous'}></AppBar>
    <div className="flex">
      <SideBar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Transactions</h1>
        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Provider</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Start Time</th>
                <th className="p-3 border">Token</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-100">
                  <td className="p-3 border">{tx.id}</td>
                  <td className="p-3 border">{tx.user.name} ({tx.user.email})</td>
                  <td className="p-3 border">₹ {tx.amount}</td>
                  <td className="p-3 border">{tx.provider}</td>
                  <td className={`p-3 border ${getStatusColor(tx.status)}`}>{tx.status}</td>
                  <td className="p-3 border">{new Date(tx.startTime).toLocaleString()}</td>
                  <td className="p-3 border text-xs break-all">{tx.token}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </div>
  );
}

function getStatusColor(status: string) {
  if (status === 'SUCCESS') return 'text-green-600';
  if (status === 'PENDING') return 'text-yellow-600';
  if (status === 'FAILED') return 'text-red-600';
  return '';
}
