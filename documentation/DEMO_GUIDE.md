# 🚀 E-Commerce Microservices System - Demo Guide

This guide will help you set up and demonstrate the key features of the application.

## 🛠️ Prerequisites
Ensure you have the following installed:
- **Docker Desktop** (Running - check the whale icon in taskbar)
- **Node.js** (v18 or higher)
- **Git**

## 🏁 Step 1: Start the Backend (Microservices)
1.  **Open the Project Folder:**
    - Go to your Downloads folder: `C:\Users\abhay\Downloads\ECommerce_Microservices_System`
2.  **Open Terminal (Command Prompt):**
    - Click on the **Address Bar** at the top of the folder window (where it says the path).
    - Type `cmd` and press **Enter**.
    - A black window (Command Prompt) will open in this folder.
3.  **Start Services:**
    - Type the following command and press Enter:
      ```powershell
      docker-compose up -d
      ```
4.  **Wait:**
    - Wait about 30-60 seconds.
    - To check if it's ready, type `docker ps`. You should see a long list of running services.

## 🖥️ Step 2: Start the Frontend
1.  **Open Frontend Folder:**
    - Go into the `frontend` folder: `C:\Users\abhay\Downloads\ECommerce_Microservices_System\frontend`
2.  **Open Another Terminal:**
    - Click the address bar again.
    - Type `cmd` and press **Enter**.
    - A **second** black window will open.
3.  **Start the App:**
    - Type this command and press Enter:
      ```powershell
      npm run dev -- --host
      ```
    - You will see a message like `Local: http://localhost:5173/`.
    - Keep this window **open** (do not close it).

## 🎭 Step 3: Demo Flow (Walkthrough)

Now, go to your browser (Chrome/Edge) and visit: **[http://localhost:5173](http://localhost:5173)**

### 1. **Login & Security** (Keycloak)
- Click **Login**.
- **Username:** `john`
- **Password:** `password123`
- Show that you are logged in.

### 2. **Browse Products** (Inventory Service)
- Show the products on the home page.
- Explain: *"These products are fetched from the Inventory Microservice."*
- Click "Add to Cart" on a product.

### 3. **Shopping Cart** (Local State)
- Go to the **Cart** page (top right).
- Click **Checkout**.

### 4. **Payment** (Stripe & Payment Service)
- Enter Test Card Details:
  - **Card:** `4242 4242 4242 4242`
  - **Expiry:** `12/30`
  - **CVC:** `123`
  - **ZIP:** `12345`
- Click **Pay**.
- Explain: *"This talks to the Payment Microservice and Stripe."*

### 5. **Order Success** (Order Service)
- You will be redirected to the **Orders** page.
- Explain: *"The Order Service has validated the payment and saved the order."*

## 🧹 Cleanup
To stop everything when done:
1. Go to the **Backend** terminal (the first one).
2. Type: `docker-compose down`
