# 💰 Finance Tracker

A beautiful, privacy-focused personal finance web app with a Liquid Glass iOS aesthetic. Track income, expenses, bills, and subscriptions - all data stays on your device.

## ✨ Features

- **📊 Dashboard** - Real-time overview of your finances
- **💳 Transaction Management** - Add, edit, and delete transactions
- **🔄 Recurring Transactions** - Auto-generate monthly bills and subscriptions
- **📈 Visual Insights** - Beautiful charts showing spending trends
- **💾 Data Privacy** - All data stored locally on your device
- **📱 PWA Support** - Install as an app on your iPhone
- **🌙 Auto Theme** - Adapts to light/dark mode
- **✈️ Offline Ready** - Works without internet after first load
- **💎 Liquid Glass Design** - Premium iOS-style aesthetics

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. **Create a GitHub account** (if you don’t have one)
- Go to [github.com](https://github.com)
- Click “Sign up”
1. **Create a new repository**
- Click the “+” icon → “New repository”
- Name it: `finance-tracker` (or any name you like)
- Make it **Public**
- Don’t initialize with README
- Click “Create repository”
1. **Upload the files**
- Click “uploading an existing file”
- Drag and drop ALL files:
  - `index.html`
  - `styles.css`
  - `app.js`
  - `service-worker.js`
  - `manifest.json`
- Click “Commit changes”
1. **Enable GitHub Pages**
- Go to repository Settings
- Scroll to “Pages” section (left sidebar)
- Under “Source”, select “main” branch
- Click “Save”
- Wait 1-2 minutes
1. **Access your app**
- Your app will be live at: `https://YOUR-USERNAME.github.io/finance-tracker/`
- Example: `https://johndoe.github.io/finance-tracker/`

### Option 2: Run Locally

1. Download all files to a folder
1. Open `index.html` in a modern browser
1. That’s it! (Note: Service worker won’t work locally without HTTPS)

## 📱 Install on iPhone

1. **Open in Safari**
- Visit your GitHub Pages URL in Safari (must use Safari, not Chrome)
1. **Add to Home Screen**
- Tap the Share button (square with arrow)
- Scroll and tap “Add to Home Screen”
- Tap “Add”
1. **Launch**
- Find the app icon on your home screen
- Tap to open
- Enjoy full-screen, app-like experience!

## 📖 How to Use

### Adding Transactions

1. Go to the **Transactions** tab
1. Fill in the form:
- **Type**: Income, Expense, Bill, Subscription, or Savings
- **Amount**: Enter the dollar amount
- **Description**: What is this transaction?
- **Date**: When did it occur?
- **Notes**: Optional additional details
- **Repeat monthly**: Check if this recurs every month
1. Click “Add Transaction”

### Dashboard

- **Current Balance**: Total across all transactions
- **This Month Income**: All income this month
- **This Month Expenses**: All spending this month
- **Total Savings**: Sum of all savings transactions
- **Monthly Bills**: Bills + subscriptions this month
- **Recent Activity**: Last 5 transactions

### Insights Tab

- **Monthly Overview**: Line chart showing 6 months of income vs expenses
- **Spending by Category**: Pie chart breaking down where your money goes
- **Recurring Transactions**: List of all monthly repeating transactions

### Recurring Transactions

When you mark a transaction as “Repeat monthly”:

- The app automatically creates a new instance each month
- Original transaction stays as the template
- You can edit/delete individual instances or the whole series

### Data Management

**Export Data (Backup)**

1. Tap the ⚙️ Settings icon
1. Click “Export Data”
1. Save the JSON file somewhere safe (iCloud, email to yourself, etc.)

**Import Data (Restore)**

1. Tap the ⚙️ Settings icon
1. Click “Import Data”
1. Select your backup JSON file
1. Confirm the import

**Reset All Data**

1. Tap the ⚙️ Settings icon
1. Click “Reset All Data”
1. Confirm (⚠️ This cannot be undone!)

## 🔒 Privacy & Security

- **100% Local Storage** - All data is stored in your browser’s localStorage
- **No Server** - No data is ever sent to any server
- **No Tracking** - No analytics or tracking of any kind
- **No Login** - No account required
- **Your Device Only** - Data stays on the device you’re using

### Important Notes

- If you clear browser data, you’ll lose your transactions
- Export backups regularly!
- Data is NOT synced across devices
- Uninstalling the app removes all data

## 🛠️ Technical Details

### Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Liquid Glass effects, animations
- **Vanilla JavaScript** - No frameworks
- **Chart.js** - Data visualization
- **localStorage** - Data persistence
- **Service Worker** - Offline functionality
- **Web App Manifest** - PWA installation

### Browser Requirements

- Modern browser with JavaScript enabled
- localStorage support
- For PWA: Safari on iOS, Chrome on Android

### File Structure

```
finance-tracker/
├── index.html          # Main HTML structure
├── styles.css          # All styling (Liquid Glass aesthetic)
├── app.js             # Application logic
├── service-worker.js  # Offline support
├── manifest.json      # PWA configuration
└── README.md          # This file
```

## 🎨 Customization

### Change Colors

Edit `styles.css` and modify the CSS variables:

```css
:root {
    --accent-primary: #4A90E2;    /* Primary blue */
    --accent-secondary: #7B68EE;   /* Secondary purple */
    --success: #10b981;            /* Green */
    --danger: #ef4444;             /* Red */
    /* ... etc */
}
```

### Change App Name

1. Edit `index.html` - change `<title>` and header text
1. Edit `manifest.json` - change `name` and `short_name`

## 🐛 Troubleshooting

### App won’t install on iPhone

- Make sure you’re using Safari (not Chrome)
- Try refreshing the page
- Check that the manifest.json loaded correctly

### Data disappeared

- Did you clear browser data?
- Check if you’re on the same browser/device
- Restore from a backup JSON file

### Charts not showing

- Make sure Chart.js CDN is accessible
- Check browser console for errors
- Try refreshing the page

### Service worker not working

- Only works on HTTPS (or localhost)
- GitHub Pages provides HTTPS automatically
- Clear cache and re-register

## 📊 Data Format

Your data is stored in this format:

```json
{
  "transactions": [
    {
      "id": "unique-id",
      "type": "income",
      "amount": 5000,
      "description": "Salary",
      "date": "2026-02-01",
      "notes": "Monthly paycheck",
      "recurring": true,
      "createdAt": "2026-02-01T12:00:00.000Z"
    }
  ],
  "lastSaved": "2026-02-06T10:30:00.000Z",
  "version": "1.0"
}
```

## 🚧 Future Enhancements

Potential features to add:

- [ ] Budget goals and limits
- [ ] Multiple accounts
- [ ] Tags for transactions
- [ ] Search and advanced filtering
- [ ] CSV export
- [ ] Spending predictions
- [ ] Bill payment reminders
- [ ] Multiple currencies
- [ ] Encrypted cloud backup (optional)

## 📄 License

This project is free and open source. Use it however you like!

## 🤝 Contributing

Feel free to fork and modify for your own use!

## ⚠️ Disclaimer

This is a personal finance tracking tool. It does not:

- Connect to banks
- Provide financial advice
- Guarantee data accuracy
- Replace professional financial planning

Always maintain offline backups of important financial data.

## 💡 Tips for Best Results

1. **Export backups weekly** - Keep your data safe
1. **Be consistent** - Add transactions regularly
1. **Use recurring** - Set up monthly bills/subscriptions once
1. **Review monthly** - Check the Insights tab to understand spending
1. **Keep notes** - Add context to help remember transactions later

## 📞 Support

Since this runs entirely on your device, there’s no official support. However:

- Check the browser console for errors
- Review this README for common issues
- Make sure you’re using a modern browser
- Try the app in an incognito window to rule out extensions

-----

**Enjoy tracking your finances with privacy and style! 💰✨**