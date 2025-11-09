// ============================================
// frontend/src/components/forms/TransactionForm.jsx
// ============================================
import React, { useState } from 'react';

const TransactionForm = ({ initialData = {}, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        type: initialData.type || 'Pengeluaran',
        amount: initialData.amount || '',
        category: initialData.category || '',
        description: initialData.description || '',
        date: initialData.date
            ? initialData.date.split('T')[0]
            : new Date().toISOString().split('T')[0],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount),
        });
    };

    const expenseCategories = [
        'Makanan',
        'Transportasi',
        'Buku',
        'Alat Tulis',
        'Internet',
        'Hiburan',
        'Kesehatan',
        'Lain-lain',
    ];

    const incomeCategories = [
        'Uang Saku',
        'Beasiswa',
        'Part-time',
        'Freelance',
        'Hadiah',
        'Lain-lain',
    ];

    const categories =
        formData.type === 'Pengeluaran' ? expenseCategories : incomeCategories;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-3">
                    Transaction Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                type: 'Pemasukan',
                                category: '',
                            }))
                        }
                        className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            formData.type === 'Pemasukan'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        💰 Income
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                type: 'Pengeluaran',
                                category: '',
                            }))
                        }
                        className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            formData.type === 'Pengeluaran'
                                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/30'
                                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        💸 Expense
                    </button>
                </div>
            </div>

            {/* Amount & Date */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Amount (Rp) *
                    </label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="0"
                        step="1000"
                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="50000"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Date *
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Category *
                </label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                    <option value="" className="bg-gray-900">
                        Select category
                    </option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-gray-900">
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Description (optional)
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    placeholder="Additional notes..."
                />
            </div>

            {/* Amount Preview */}
            {formData.amount && (
                <div
                    className={`p-4 rounded-lg border ${
                        formData.type === 'Pemasukan'
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                    }`}
                >
                    <p className="text-sm text-white/70 mb-1">Amount:</p>
                    <p
                        className={`text-2xl font-bold ${
                            formData.type === 'Pemasukan'
                                ? 'text-green-400'
                                : 'text-red-400'
                        }`}
                    >
                        {formData.type === 'Pemasukan' ? '+' : '-'} Rp{' '}
                        {parseFloat(formData.amount).toLocaleString('id-ID')}
                    </p>
                </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                >
                    {initialData._id ? 'Update Transaction' : 'Add Transaction'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-medium text-white hover:bg-white/10 transition-all"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
