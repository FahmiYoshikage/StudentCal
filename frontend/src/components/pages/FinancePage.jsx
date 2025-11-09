// components/FinancePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EXPENSE_CATEGORIES = [
    'Makanan',
    'Transportasi',
    'Buku & ATK',
    'Internet & Pulsa',
    'Hiburan',
    'Kesehatan',
    'Pakaian',
    'Lainnya',
];

const INCOME_CATEGORIES = [
    'Uang Saku',
    'Beasiswa',
    'Part-time',
    'Freelance',
    'Hadiah',
    'Lainnya',
];

export default function FinancePage() {
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [formData, setFormData] = useState({
        type: 'Pengeluaran',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const year = selectedMonth.getFullYear();
            const month = selectedMonth.getMonth() + 1;

            const [summaryRes, transactionsRes] = await Promise.all([
                axios.get(
                    `${API_URL}/api/transactions/summary/monthly?year=${year}&month=${month}`,
                    { withCredentials: true }
                ),
                axios.get(`${API_URL}/api/transactions`, {
                    withCredentials: true,
                }),
            ]);

            setSummary(summaryRes.data);
            setTransactions(transactionsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching finance data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
            };

            if (editingTransaction) {
                await axios.put(
                    `${API_URL}/api/transactions/${editingTransaction._id}`,
                    payload,
                    { withCredentials: true }
                );
                alert('✅ Transaction updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/transactions`, payload, {
                    withCredentials: true,
                });
                alert('✅ Transaction added successfully!');
            }

            setShowModal(false);
            setEditingTransaction(null);
            resetForm();
            fetchData();
        } catch (error) {
            alert('❌ Error: ' + error.response?.data?.error || error.message);
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setFormData({
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description || '',
            date: new Date(transaction.date).toISOString().split('T')[0],
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return;

        try {
            await axios.delete(`${API_URL}/api/transactions/${id}`, {
                withCredentials: true,
            });
            alert('✅ Transaction deleted successfully!');
            fetchData();
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'Pengeluaran',
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const changeMonth = (direction) => {
        const newMonth = new Date(selectedMonth);
        newMonth.setMonth(newMonth.getMonth() + direction);
        setSelectedMonth(newMonth);
    };

    const getCategoryIcon = (category) => {
        const icons = {
            Makanan: '🍔',
            Transportasi: '🚗',
            'Buku & ATK': '📚',
            'Internet & Pulsa': '📱',
            Hiburan: '🎮',
            Kesehatan: '💊',
            Pakaian: '👕',
            'Uang Saku': '💰',
            Beasiswa: '🎓',
            'Part-time': '💼',
            Freelance: '💻',
            Hadiah: '🎁',
        };
        return icons[category] || '💵';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading finance data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        💰 Pelacak Keuangan
                    </h1>
                    <p className="text-gray-600">
                        Manage your finances and track your spending
                    </p>
                </div>

                {/* Month Selector */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        ← Previous
                    </button>

                    <h2 className="text-xl font-semibold">
                        {selectedMonth.toLocaleString('id-ID', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </h2>

                    <button
                        onClick={() => changeMonth(1)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Next →
                    </button>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm opacity-90">
                                    Total Pemasukan
                                </span>
                                <span className="text-2xl">📈</span>
                            </div>
                            <p className="text-3xl font-bold">
                                {formatCurrency(summary.totalIncome)}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm opacity-90">
                                    Total Pengeluaran
                                </span>
                                <span className="text-2xl">📉</span>
                            </div>
                            <p className="text-3xl font-bold">
                                {formatCurrency(summary.totalExpense)}
                            </p>
                        </div>

                        <div
                            className={`bg-gradient-to-br ${
                                summary.balance >= 0
                                    ? 'from-blue-400 to-blue-600'
                                    : 'from-orange-400 to-orange-600'
                            } rounded-lg shadow-lg p-6 text-white`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm opacity-90">
                                    Saldo Bulan Ini
                                </span>
                                <span className="text-2xl">
                                    {summary.balance >= 0 ? '💎' : '⚠️'}
                                </span>
                            </div>
                            <p className="text-3xl font-bold">
                                {formatCurrency(summary.balance)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Category Breakdown */}
                {summary &&
                    Object.keys(summary.categoryBreakdown).length > 0 && (
                        <div className="bg-white rounded-lg shadow mb-8 p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Breakdown Pengeluaran per Kategori
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.entries(summary.categoryBreakdown)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([category, amount]) => {
                                        const percentage =
                                            (amount / summary.totalExpense) *
                                            100;
                                        return (
                                            <div
                                                key={category}
                                                className="border rounded-lg p-4"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {getCategoryIcon(
                                                            category
                                                        )}{' '}
                                                        {category}
                                                    </span>
                                                </div>
                                                <p className="text-xl font-bold text-gray-900">
                                                    {formatCurrency(amount)}
                                                </p>
                                                <div className="mt-2 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-red-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {percentage.toFixed(1)}%
                                                    dari total
                                                </p>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                {/* Quick Add Form */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                        ➕ Tambah Transaksi Cepat
                    </h3>
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-5 gap-4"
                    >
                        <div>
                            <select
                                value={formData.type}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        type: e.target.value,
                                        category: '',
                                    });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Pengeluaran">Pengeluaran</option>
                                <option value="Pemasukan">Pemasukan</option>
                            </select>
                        </div>

                        <div>
                            <input
                                type="number"
                                required
                                min="0"
                                step="1000"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        amount: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Jumlah (Rp)"
                            />
                        </div>

                        <div>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Pilih Kategori</option>
                                {(formData.type === 'Pengeluaran'
                                    ? EXPENSE_CATEGORIES
                                    : INCOME_CATEGORIES
                                ).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Deskripsi (opsional)"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Tambah
                            </button>
                        </div>
                    </form>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold">
                            📜 Riwayat Transaksi
                        </h3>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="text-6xl mb-4 block">💸</span>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum Ada Transaksi
                            </h3>
                            <p className="text-gray-600">
                                Mulai catat keuangan Anda dengan menambahkan
                                transaksi pertama
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Tipe
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {transactions.map((transaction) => (
                                        <tr
                                            key={transaction._id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(
                                                    transaction.date
                                                ).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        transaction.type ===
                                                        'Pemasukan'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {transaction.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="flex items-center">
                                                    <span className="mr-2">
                                                        {getCategoryIcon(
                                                            transaction.category
                                                        )}
                                                    </span>
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {transaction.description || '-'}
                                            </td>
                                            <td
                                                className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${
                                                    transaction.type ===
                                                    'Pemasukan'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {transaction.type ===
                                                'Pemasukan'
                                                    ? '+'
                                                    : '-'}
                                                {formatCurrency(
                                                    transaction.amount
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(transaction)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            transaction._id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
