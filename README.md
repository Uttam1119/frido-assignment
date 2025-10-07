

# Splitwise Clone - Group Expense Management App

A full-stack web application to manage group expenses, track balances, and simplify splitting costs among friends, family, or colleagues. Built using *MERN stack* with enhanced group features.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Usage](#usage)
* [API Endpoints](#api-endpoints)
* [Screenshots](#screenshots)
* [Future Enhancements](#future-enhancements)

---

## Features

* **User Authentication:** Signup, login, and token-based authentication.
* **Groups Management:** Create groups, add members, view group details.
* **Expenses Tracking:** Add expenses with descriptions, amounts, categories, and split types (equal, unequal, percentage).
* **Balances Calculation:** Track who owes or is owed money in each group.
* **Multi-user Collaboration:** Manage expenses for multiple members and settle balances.
* **Responsive UI:** Built with TailwindCSS for a clean, responsive interface.

---

## Tech Stack

* **Frontend:** React, React Router, Context API, TailwindCSS
* **Backend:** Node.js, Express
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JWT (JSON Web Tokens)
* **API Integration:** Fetch API for REST calls

---

## Project Structure

```
frido-assignment/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  │  ├─ authController.js
│  │  │  ├─ expenseController.js
│  │  │  ├─ groupController.js
│  │  │  ├─ groupExpenseController.js
│  │  │  └─ balanceController.js
│  │  ├─ models/
│  │  │  ├─ User.js
│  │  │  ├─ Group.js
│  │  │  ├─ GroupExpense.js
│  │  │  └─ Expense.js
│  │  ├─ routes/
│  │  │  ├─ auth.js
│  │  │  ├─ expenses.js
│  │  │  ├─ group.js
│  │  │  └─ user.js
│  │  ├─ middleware/
│  │  │  └─ authMiddleware.js
│  │  ├─ db.js
│  │  └─ index.js
│  ├─ .env
│  ├─ package.json
│  └─ package-lock.json
└─ frontend/
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ home.jsx
│  │  │  ├─ groups.jsx
│  │  │  ├─ groupDetails.jsx
│  │  │  ├─ addExpense.jsx
│  │  │  ├─ addGroupExpense.jsx
│  │  │  ├─ createGroup.jsx
│  │  │  ├─ balances.jsx
│  │  │  ├─ logIn.jsx
│  │  │  └─ signUp.jsx
│  │  ├─ context/
│  │  │  └─ authContext.jsx
│  │  ├─ api.js
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ index.css
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ package.json
│  ├─ package-lock.json
│  └─ .env
└─ README.md

```

---

## Installation

### Backend

1. Clone the repo:

   ```bash
   git clone https://github.com/Uttam1119/frido-assignment.git
   cd frido-assignment/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup environment variables (`.env`):

   ```env
   MONGODB_URI=<your_mongodb_connection_string>
   PORT=5000
   JWT_SECRET=<your_jwt_secret>
   ```

4. Start server:

   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to frontend:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set environment variables (`.env`):

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start React app:

   ```bash
   npm run dev
   ```

---

## Usage


1. Sign up and log in to access the app.
2. Add personal expenses and split them among multiple people.
3. Create groups and add members.
4. Add group expenses with customizable splits.
5. View group details with expenses and balances.
6. Track who owes or is owed.
7. Settle expenses to clear debts between members.

---

## API Endpoints

### **Auth**

* `POST /api/auth/signup` - Register user
   ![signUp](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/signup.png "signUp")
* `POST /api/auth/login` - Login user
   ![login](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/login.png "login")
---

### **Users**

* `GET /api/user` - Get all users (requires auth)
   ![getAllUsers](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/getAllUsers.png "getAllUsers")

---

### **Personal Expenses**

* `POST /api/expenses/` - Add expense
   ![addExpense](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/addExpense.png "addExpense")
* `GET /api/expenses/` - Get all expenses
   ![getExpense](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/getAllExpenses.png "getExpense")
* `DELETE /api/expenses/:id` - Delete expense
   ![deleteExpense](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/deleteParticularExpense.png "deleteExpense")
* `GET /api/expenses/balances` - Get balances and settlements for expenses
   ![getBalances](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/getBalancesForEveryExpense.png "getBalances")

---

### **Groups**

* `POST /api/group/` - Create group
   ![createGroup](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/createGroup.png "createGroup")
* `GET /api/group/` - Get all groups of logged-in user
   ![getGroups](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/getGroupsForLoggedInUser.png "getGroups")
* `GET /api/group/:id` - Get group details
   ![getgroupDetails](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/getGroupDetails.png "getGroupDetails")

---

### **Group Expenses**

* `POST /api/group/expenses/:groupId` - Add group expense
   ![addGroupExpense](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/addGroupExpense.png "addGroupExpense")
* `GET /api/group/expenses/:groupId` - Get all expenses of a group
   ![getExpencesForAGroup](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/getAllExpensesForAParticularGroup.png "getExpensesForAGroup")
* `PUT /api/group/expenses/:id` - Update group expense
   ![updateGroupExpenses](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/UpdateGroupExpense.png "updateGroupExpenses")
* `DELETE /api/group/expenses/:id` - Delete group expense
   ![deletGroupExpense](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/DeleteGroupExpense.png "deleteGroupExpense")

---

### **Group Balances**

* `GET /api/group/balances/:groupId` - Get balances and settlements for all members in a group
   ![getBalancesForAGroup](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/api_endpoints_images/getBalanceForEveryExpenseOfAGroup.png "getBalancesForAGroup")

---

## Screenshots

**Home Page:**
*Shows all expenses*
![allExpenses](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/UI_images/allExpenses.png "allExpenses")

**Add New Expense form:**
*Shows a form to add new expense*
![addNewExpense](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/UI_images/addNewExpense.png "addNewExpense")

**Balances Page:**
*Shows balance and settlement for expenses*
![balances](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/UI_images/Balances.png "balances")

**Groups Page:**
*Shows all the group of the logged in user*
![Groups](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/UI_images/Groups.png "Groups")

**Create Group form:**
*Shows a form to create a new group*
![createGroup](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/UI_images/createGroup.png "createGroup")

**Group Details:**
*Displays members, expenses, and balances.*
![groupDetails](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/UI_images/groupDetails.png "groupDetails")

**Add Expense to a group:**
*Form pages for group management and expense addition.*
![addGroupExpense](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/UI_images/addGroupExpense.png "addGroupExpense")

**Update Group Expense:**
*Shows edit option to update a group expense*
![updateGroupExpense](https://raw.githubusercontent.com/Uttam1119/frido-assignment/main/UI_images/updateGroupExpense.png "updateGroupExpense")
---

## Future Enhancements

* Real-time updates with WebSockets
* Notifications when a member adds an expense
* Export balances to PDF or CSV
* Payment integration for settling balances

---

## License

MIT License © 2025


