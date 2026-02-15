# How to Import E-Commerce Microservices as Maven Project

## Option 1: IntelliJ IDEA (Recommended for Spring Boot)

### Step 1: Open IntelliJ IDEA

### Step 2: Import Project
1. Click **File** → **Open**
2. Navigate to: `c:\Users\abhay\Downloads\ECommerce_Microservices_System`
3. Select the folder and click **OK**

### Step 3: IntelliJ Auto-Detects Maven
- IntelliJ will automatically detect the `pom.xml` file
- You'll see a popup: **"Maven projects need to be imported"**
- Click **Import Changes** or **Enable Auto-Import**

### Step 4: Wait for Dependencies to Download
- In the bottom right corner, you'll see "Importing..." progress
- This downloads Spring Boot, Kafka, PostgreSQL drivers, etc.
- Can take 2-5 minutes on first import

### Step 5: Verify Project Structure
You should see:
```
ECommerce_Microservices_System
├── 📦 common-models
├── 📦 eureka-server
├── 📦 api-gateway
├── 📦 order-service
└── 📦 inventory-service
```

### Step 6: Run a Service
1. Navigate to any service (e.g., `eureka-server/src/main/java/com/ecommerce/eureka/`)
2. Right-click on `EurekaServerApplication.java`
3. Click **Run 'EurekaServerApplication'**

---

## Option 2: VS Code

### Step 1: Install Extensions
1. Open VS Code
2. Install these extensions:
   - **Extension Pack for Java** (by Microsoft)
   - **Spring Boot Extension Pack** (by VMware)

### Step 2: Open Folder
1. Click **File** → **Open Folder**
2. Select: `c:\Users\abhay\Downloads\ECommerce_Microservices_System`

### Step 3: VS Code Detects Maven
- VS Code will show: **"Java Project Detected"**
- Click **Import** or **Reload Window**
- The Java extension will download dependencies

### Step 4: Build Project
1. Open terminal in VS Code (Ctrl + `)
2. Run:
   ```bash
   ./mvnw clean install
   ```
   (If mvnw doesn't exist, you'll need Maven installed)

### Step 5: Run a Service
1. In Explorer, navigate to service
2. Right-click on `*Application.java` file
3. Select **Run Java**

---

## Option 3: Eclipse

### Step 1: Open Eclipse

### Step 2: Import Maven Project
1. **File** → **Import**
2. Select **Maven** → **Existing Maven Projects**
3. Click **Next**

### Step 3: Select Root Directory
1. Click **Browse**
2. Navigate to: `c:\Users\abhay\Downloads\ECommerce_Microservices_System`
3. Click **Select Folder**

### Step 4: Select All Modules
- Eclipse will detect all 5 `pom.xml` files:
  - ✅ `/pom.xml` (parent)
  - ✅ `/common-models/pom.xml`
  - ✅ `/eureka-server/pom.xml`
  - ✅ `/api-gateway/pom.xml`
  - ✅ `/order-service/pom.xml`
  - ✅ `/inventory-service/pom.xml`
- Make sure all are checked
- Click **Finish**

### Step 5: Wait for Build
- Eclipse will download dependencies
- Check progress in bottom-right corner

---

## Troubleshooting

### "Cannot resolve dependencies"
- Check internet connection
- Maven needs to download from Maven Central

### "Project build error: Unknown packaging: pom"
- Make sure you selected the ROOT folder, not a subfolder

### "Java version mismatch"
- This project requires **Java 17+**
- Set Java 17 in IDE settings

### "Module not found: common-models"
- Build parent project first:
  ```bash
  mvn clean install
  ```

---

## What Happens After Import?

1. **Maven downloads dependencies** (~200MB on first build)
2. **Project structure appears** in IDE
3. **You can run each service** individually
4. **Code completion & IntelliSense** work for Spring Boot

---

## Next Steps After Import

1. ✅ Project imported successfully
2. Start Docker Desktop for infrastructure
3. Run services in this order:
   - Eureka Server (port 8761)
   - API Gateway (port 8080)
   - Order Service (port 8081)
   - Inventory Service (port 8082)

Need help with any step? Let me know!
