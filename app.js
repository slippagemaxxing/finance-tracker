// ============================================
// Finance Tracker App - Main JavaScript
// ============================================

// App State
let transactions = [];
let editingId = null;
let currentFilter = ‘all’;
let charts = {
monthly: null,
category: null
};

// ============================================
// Initialize App
// ============================================

document.addEventListener(‘DOMContentLoaded’, () => {
initializeApp();
setupEventListeners();
checkForInstallPrompt();
});

function initializeApp() {
loadTransactions();
processRecurringTransactions();
setDefaultDate();
updateDashboard();
updateAllTransactionsList();
updateCharts();
updateRecurringList();
}

// ============================================
// Data Management
// ============================================

function loadTransactions() {
const stored = localStorage.getItem(‘financeTrackerData’);
if (stored) {
try {
const data = JSON.parse(stored);
transactions = data.transactions || [];
} catch (e) {
console.error(‘Error loading data:’, e);
transactions = [];
}
}
}

function saveTransactions() {
const data = {
transactions: transactions,
lastSaved: new Date().toISOString(),
version: ‘1.0’
};
localStorage.setItem(‘financeTrackerData’, JSON.stringify(data));
}

function processRecurringTransactions() {
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

```
let needsSave = false;

transactions.forEach(transaction => {
    if (transaction.recurring) {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();
        
        // Check if we need to create a new instance for this month
        const hasCurrentMonthInstance = transactions.some(t => {
            if (t.recurringParentId === transaction.id) {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            }
            return false;
        });
        
        // If original transaction is from a previous month and no instance exists for current month
        if ((transactionYear < currentYear || 
            (transactionYear === currentYear && transactionMonth < currentMonth)) &&
            !hasCurrentMonthInstance) {
            
            // Create new instance for current month
            const newTransaction = {
                ...transaction,
                id: generateId(),
                date: new Date(currentYear, currentMonth, transactionDate.getDate()).toISOString().split('T')[0],
                recurringParentId: transaction.id,
                recurring: false // Instance itself is not recurring
            };
            
            transactions.push(newTransaction);
            needsSave = true;
        }
    }
});

if (needsSave) {
    saveTransactions();
}
```

}

function generateId() {
return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============================================
// Transaction CRUD
// ============================================

function addTransaction(transactionData) {
const transaction = {
id: generateId(),
…transactionData,
createdAt: new Date().toISOString()
};

```
transactions.push(transaction);
saveTransactions();
updateAll();

showNotification('Transaction added successfully! ✅');
```

}

function updateTransaction(id, transactionData) {
const index = transactions.findIndex(t => t.id === id);
if (index !== -1) {
transactions[index] = {
…transactions[index],
…transactionData,
updatedAt: new Date().toISOString()
};
saveTransactions();
updateAll();
showNotification(‘Transaction updated! ✅’);
}
}

function deleteTransaction(id) {
const transaction = transactions.find(t => t.id === id);
if (!transaction) return;

```
// Confirm deletion
if (!confirm(`Delete "${transaction.description}"?`)) return;

// If it's a recurring transaction, ask if they want to delete all instances
if (transaction.recurring) {
    const deleteAll = confirm('This is a recurring transaction. Delete all future instances?');
    if (deleteAll) {
        // Delete the parent and all instances
        transactions = transactions.filter(t => 
            t.id !== id && t.recurringParentId !== id
        );
    } else {
        // Delete only this transaction
        transactions = transactions.filter(t => t.id !== id);
    }
} else {
    transactions = transactions.filter(t => t.id !== id);
}

saveTransactions();
updateAll();
showNotification('Transaction deleted! 🗑️');
```

}

function editTransaction(id) {
const transaction = transactions.find(t => t.id === id);
if (!transaction) return;

```
editingId = id;

// Populate form
document.getElementById('transactionType').value = transaction.type;
document.getElementById('transactionAmount').value = Math.abs(transaction.amount);
document.getElementById('transactionDescription').value = transaction.description;
document.getElementById('transactionDate').value = transaction.date;
document.getElementById('transactionNotes').value = transaction.notes || '';
document.getElementById('transactionRecurring').checked = transaction.recurring || false;

// Update button text
document.getElementById('submitTransactionBtn').textContent = 'Update Transaction';
document.getElementById('cancelEditBtn').style.display = 'block';

// Switch to transactions tab and scroll to form
switchTab('transactions');
document.querySelector('.add-transaction-card').scrollIntoView({ behavior: 'smooth' });
```

}

function cancelEdit() {
editingId = null;
document.getElementById(‘transactionForm’).reset();
setDefaultDate();
document.getElementById(‘submitTransactionBtn’).textContent = ‘Add Transaction’;
document.getElementById(‘cancelEditBtn’).style.display = ‘none’;
}

// ============================================
// Calculations
// ============================================

function calculateBalance() {
return transactions.reduce((total, t) => {
if (t.type === ‘income’) return total + t.amount;
return total - t.amount;
}, 0);
}

function calculateMonthlyIncome() {
const now = new Date();
return transactions
.filter(t => {
const tDate = new Date(t.date);
return t.type === ‘income’ &&
tDate.getMonth() === now.getMonth() &&
tDate.getFullYear() === now.getFullYear();
})
.reduce((sum, t) => sum + t.amount, 0);
}

function calculateMonthlyExpenses() {
const now = new Date();
return transactions
.filter(t => {
const tDate = new Date(t.date);
return t.type !== ‘income’ &&
tDate.getMonth() === now.getMonth() &&
tDate.getFullYear() === now.getFullYear();
})
.reduce((sum, t) => sum + t.amount, 0);
}

function calculateTotalSavings() {
return transactions
.filter(t => t.type === ‘savings’)
.reduce((sum, t) => sum + t.amount, 0);
}

function calculateMonthlyBills() {
const now = new Date();
return transactions
.filter(t => {
const tDate = new Date(t.date);
return (t.type === ‘bill’ || t.type === ‘subscription’) &&
tDate.getMonth() === now.getMonth() &&
tDate.getFullYear() === now.getFullYear();
})
.reduce((sum, t) => sum + t.amount, 0);
}

function getCategoryBreakdown() {
const categories = {};
const now = new Date();

```
transactions
    .filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === now.getMonth() && 
               tDate.getFullYear() === now.getFullYear() &&
               t.type !== 'income';
    })
    .forEach(t => {
        const category = t.type.charAt(0).toUpperCase() + t.type.slice(1);
        categories[category] = (categories[category] || 0) + t.amount;
    });

return categories;
```

}

// ============================================
// UI Updates
// ============================================

function updateDashboard() {
const balance = calculateBalance();
const monthIncome = calculateMonthlyIncome();
const monthExpenses = calculateMonthlyExpenses();
const savings = calculateTotalSavings();
const bills = calculateMonthlyBills();

```
// Update balance
document.getElementById('currentBalance').textContent = formatCurrency(balance);

// Update trend
const trend = monthIncome - monthExpenses;
const trendElement = document.getElementById('balanceTrend');
if (trend > 0) {
    trendElement.textContent = `↗ +${formatCurrency(trend)} this month`;
    trendElement.style.color = 'var(--success)';
} else if (trend < 0) {
    trendElement.textContent = `↘ ${formatCurrency(trend)} this month`;
    trendElement.style.color = 'var(--danger)';
} else {
    trendElement.textContent = 'No change this month';
    trendElement.style.color = 'var(--text-secondary)';
}

// Update stats
document.getElementById('monthIncome').textContent = formatCurrency(monthIncome);
document.getElementById('monthExpenses').textContent = formatCurrency(monthExpenses);
document.getElementById('totalSavings').textContent = formatCurrency(savings);
document.getElementById('monthlyBills').textContent = formatCurrency(bills);

// Update recent transactions
updateRecentTransactions();
```

}

function updateRecentTransactions() {
const listElement = document.getElementById(‘recentTransactionsList’);
const recent = […transactions]
.sort((a, b) => new Date(b.date) - new Date(a.date))
.slice(0, 5);

```
if (recent.length === 0) {
    listElement.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <p>No transactions yet</p>
        </div>
    `;
    return;
}

listElement.innerHTML = recent.map(t => createTransactionHTML(t, false)).join('');
```

}

function updateAllTransactionsList() {
const listElement = document.getElementById(‘allTransactionsList’);

```
let filtered = [...transactions];

// Apply filter
if (currentFilter !== 'all') {
    filtered = filtered.filter(t => t.type === currentFilter);
}

// Sort by date (newest first)
filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

if (filtered.length === 0) {
    listElement.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <p>No transactions found</p>
        </div>
    `;
    return;
}

listElement.innerHTML = filtered.map(t => createTransactionHTML(t, true)).join('');
```

}

function createTransactionHTML(transaction, showActions = true) {
const icon = getTransactionIcon(transaction.type);
const amount = transaction.type === ‘income’ ? transaction.amount : -transaction.amount;
const amountClass = amount >= 0 ? ‘positive’ : ‘negative’;
const formattedDate = formatDate(transaction.date);
const recurring = transaction.recurring ? ’ 🔄’ : ‘’;

```
return `
    <div class="transaction-item" data-id="${transaction.id}">
        <div class="transaction-icon">${icon}</div>
        <div class="transaction-details">
            <div class="transaction-description">${transaction.description}${recurring}</div>
            <div class="transaction-meta">${formattedDate} • ${transaction.type}</div>
        </div>
        <div class="transaction-amount ${amountClass}">${formatCurrency(amount)}</div>
        ${showActions ? `
            <div class="transaction-actions">
                <button class="icon-btn edit-btn" data-id="${transaction.id}" aria-label="Edit">✏️</button>
                <button class="icon-btn delete-btn" data-id="${transaction.id}" aria-label="Delete">🗑️</button>
            </div>
        ` : ''}
    </div>
`;
```

}

function updateRecurringList() {
const listElement = document.getElementById(‘recurringList’);
const recurring = transactions.filter(t => t.recurring);

```
if (recurring.length === 0) {
    listElement.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">🔄</div>
            <p>No recurring transactions</p>
        </div>
    `;
    return;
}

listElement.innerHTML = recurring.map(t => {
    const icon = getTransactionIcon(t.type);
    const amount = t.type === 'income' ? t.amount : -t.amount;
    const amountClass = amount >= 0 ? 'positive' : 'negative';
    
    return `
        <div class="recurring-item">
            <div class="transaction-icon">${icon}</div>
            <div class="transaction-details">
                <div class="transaction-description">${t.description}</div>
                <div class="transaction-meta">
                    <span class="recurring-badge">Monthly</span>
                </div>
            </div>
            <div class="transaction-amount ${amountClass}">${formatCurrency(amount)}</div>
        </div>
    `;
}).join('');
```

}

function updateCharts() {
updateMonthlyChart();
updateCategoryChart();
}

function updateMonthlyChart() {
const ctx = document.getElementById(‘monthlyChart’);
if (!ctx) return;

```
// Get last 6 months of data
const months = [];
const incomeData = [];
const expenseData = [];

for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    months.push(date.toLocaleDateString('en-US', { month: 'short' }));
    
    const income = transactions
        .filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'income' && 
                   tDate.getMonth() === month && 
                   tDate.getFullYear() === year;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => {
            const tDate = new Date(t.date);
            return t.type !== 'income' && 
                   tDate.getMonth() === month && 
                   tDate.getFullYear() === year;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    
    incomeData.push(income);
    expenseData.push(expenses);
}

// Destroy existing chart
if (charts.monthly) {
    charts.monthly.destroy();
}

// Create new chart
charts.monthly = new Chart(ctx, {
    type: 'line',
    data: {
        labels: months,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Expenses',
                data: expenseData,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: { size: 12 }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value.toFixed(0);
                    }
                }
            }
        }
    }
});
```

}

function updateCategoryChart() {
const ctx = document.getElementById(‘categoryChart’);
if (!ctx) return;

```
const breakdown = getCategoryBreakdown();
const labels = Object.keys(breakdown);
const data = Object.values(breakdown);

if (labels.length === 0) {
    // Destroy existing chart if no data
    if (charts.category) {
        charts.category.destroy();
        charts.category = null;
    }
    ctx.parentElement.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📊</div>
            <p>No expense data this month</p>
        </div>
    `;
    return;
}

// Destroy existing chart
if (charts.category) {
    charts.category.destroy();
}

// Create new chart
charts.category = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(74, 144, 226, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(123, 104, 238, 0.8)'
            ],
            borderWidth: 2,
            borderColor: 'var(--bg-primary)'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: { size: 12 }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = formatCurrency(context.parsed);
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    }
});
```

}

function updateAll() {
updateDashboard();
updateAllTransactionsList();
updateCharts();
updateRecurringList();
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
// Tab navigation
document.querySelectorAll(’.tab-btn’).forEach(btn => {
btn.addEventListener(‘click’, (e) => {
const tab = e.currentTarget.dataset.tab;
switchTab(tab);
});
});

```
// Transaction form
document.getElementById('transactionForm').addEventListener('submit', handleFormSubmit);
document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);

// Quick add button
document.getElementById('quickAddBtn').addEventListener('click', () => {
    switchTab('transactions');
    document.querySelector('.add-transaction-card').scrollIntoView({ behavior: 'smooth' });
});

// Settings
document.getElementById('settingsBtn').addEventListener('click', openSettings);
document.getElementById('closeSettingsBtn').addEventListener('click', closeSettings);

// Data management
document.getElementById('exportDataBtn').addEventListener('click', exportData);
document.getElementById('importDataBtn').addEventListener('click', () => {
    document.getElementById('importFileInput').click();
});
document.getElementById('importFileInput').addEventListener('change', importData);
document.getElementById('resetDataBtn').addEventListener('click', resetData);

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentFilter = e.currentTarget.dataset.filter;
        updateAllTransactionsList();
    });
});

// Transaction actions (using event delegation)
document.addEventListener('click', (e) => {
    if (e.target.closest('.edit-btn')) {
        const id = e.target.closest('.edit-btn').dataset.id;
        editTransaction(id);
    } else if (e.target.closest('.delete-btn')) {
        const id = e.target.closest('.delete-btn').dataset.id;
        deleteTransaction(id);
    }
});

// Close modal on backdrop click
document.getElementById('settingsModal').addEventListener('click', (e) => {
    if (e.target.id === 'settingsModal') {
        closeSettings();
    }
});
```

}

function switchTab(tabName) {
// Update tab buttons
document.querySelectorAll(’.tab-btn’).forEach(btn => {
btn.classList.remove(‘active’);
if (btn.dataset.tab === tabName) {
btn.classList.add(‘active’);
}
});

```
// Update tab content
document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
    if (content.id === tabName) {
        content.classList.add('active');
    }
});
```

}

function handleFormSubmit(e) {
e.preventDefault();

```
const type = document.getElementById('transactionType').value;
const amount = parseFloat(document.getElementById('transactionAmount').value);
const description = document.getElementById('transactionDescription').value;
const date = document.getElementById('transactionDate').value;
const notes = document.getElementById('transactionNotes').value;
const recurring = document.getElementById('transactionRecurring').checked;

const transactionData = {
    type,
    amount,
    description,
    date,
    notes,
    recurring
};

if (editingId) {
    updateTransaction(editingId, transactionData);
    cancelEdit();
} else {
    addTransaction(transactionData);
    e.target.reset();
    setDefaultDate();
}
```

}

// ============================================
// Settings & Data Management
// ============================================

function openSettings() {
document.getElementById(‘settingsModal’).classList.add(‘active’);
}

function closeSettings() {
document.getElementById(‘settingsModal’).classList.remove(‘active’);
}

function exportData() {
const data = {
transactions: transactions,
exportDate: new Date().toISOString(),
version: ‘1.0’
};

```
const dataStr = JSON.stringify(data, null, 2);
const dataBlob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = `finance-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
link.click();

showNotification('Data exported successfully! 📥');
```

}

function importData(e) {
const file = e.target.files[0];
if (!file) return;

```
const reader = new FileReader();
reader.onload = (event) => {
    try {
        const data = JSON.parse(event.target.result);
        
        if (!data.transactions || !Array.isArray(data.transactions)) {
            throw new Error('Invalid data format');
        }
        
        if (confirm('This will replace all your current data. Continue?')) {
            transactions = data.transactions;
            saveTransactions();
            updateAll();
            showNotification('Data imported successfully! 📤');
            closeSettings();
        }
    } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
    }
};
reader.readAsText(file);

// Reset file input
e.target.value = '';
```

}

function resetData() {
if (!confirm(‘⚠️ This will permanently delete ALL your data. Are you absolutely sure?’)) {
return;
}

```
if (!confirm('This action cannot be undone. Delete everything?')) {
    return;
}

transactions = [];
saveTransactions();
updateAll();
closeSettings();
showNotification('All data has been reset 🗑️');
```

}

// ============================================
// Utilities
// ============================================

function formatCurrency(amount) {
return new Intl.NumberFormat(‘en-US’, {
style: ‘currency’,
currency: ‘USD’,
minimumFractionDigits: 2
}).format(amount);
}

function formatDate(dateString) {
const date = new Date(dateString);
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

```
// Reset time for comparison
today.setHours(0, 0, 0, 0);
yesterday.setHours(0, 0, 0, 0);
const compareDate = new Date(date);
compareDate.setHours(0, 0, 0, 0);

if (compareDate.getTime() === today.getTime()) {
    return 'Today';
} else if (compareDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
} else {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
}
```

}

function getTransactionIcon(type) {
const icons = {
income: ‘💵’,
expense: ‘💸’,
bill: ‘📋’,
subscription: ‘🔄’,
savings: ‘🏦’
};
return icons[type] || ‘💰’;
}

function setDefaultDate() {
const today = new Date().toISOString().split(‘T’)[0];
document.getElementById(‘transactionDate’).value = today;
}

function showNotification(message) {
// Create notification element
const notification = document.createElement(‘div’);
notification.className = ‘notification glass’;
notification.textContent = message;
notification.style.cssText = `position: fixed; top: calc(80px + env(safe-area-inset-top)); left: 50%; transform: translateX(-50%) translateY(-100px); padding: 1rem 1.5rem; border-radius: 1rem; z-index: 1001; opacity: 0; transition: all 0.3s ease; font-weight: 600; text-align: center; max-width: 90%;`;

```
document.body.appendChild(notification);

// Animate in
setTimeout(() => {
    notification.style.transform = 'translateX(-50%) translateY(0)';
    notification.style.opacity = '1';
}, 10);

// Remove after delay
setTimeout(() => {
    notification.style.transform = 'translateX(-50%) translateY(-100px)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
}, 3000);
```

}

// ============================================
// PWA Install Prompt
// ============================================

let deferredPrompt;

function checkForInstallPrompt() {
// Listen for install prompt
window.addEventListener(‘beforeinstallprompt’, (e) => {
e.preventDefault();
deferredPrompt = e;

```
    // Show custom install banner
    const banner = document.getElementById('installBanner');
    if (banner && !localStorage.getItem('installBannerDismissed')) {
        banner.style.display = 'block';
    }
});

// Install button
const installBtn = document.getElementById('installBtn');
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('App installed');
        }
        
        deferredPrompt = null;
        document.getElementById('installBanner').style.display = 'none';
    });
}

// Close install banner
const closeInstallBtn = document.getElementById('closeInstallBtn');
if (closeInstallBtn) {
    closeInstallBtn.addEventListener('click', () => {
        document.getElementById('installBanner').style.display = 'none';
        localStorage.setItem('installBannerDismissed', 'true');
    });
}
```

}

// ============================================
// Service Worker Registration
// ============================================

if (‘serviceWorker’ in navigator) {
window.addEventListener(‘load’, () => {
navigator.serviceWorker.register(‘service-worker.js’)
.then(registration => console.log(‘SW registered:’, registration))
.catch(error => console.log(‘SW registration failed:’, error));
});
}