# Advanced Auction Bidding Platform

An innovative platform redefining the online auction experience, combining hybrid auction models, AI-driven analytics, and robust security to deliver unparalleled performance. This repository provides the full-stack implementation, development guidelines, and roadmap for our revolutionary bidding ecosystem.

---

## **Platform Overview**

### **Core Features**
#### User Features:
- **Streamlined Onboarding:** Secure registration with two-factor authentication (2FA).  
- **Intuitive Browsing:** Explore auctions by category, price, and popularity with advanced filtering.  
- **Real-Time Bidding:** Participate in auctions with live updates and seamless notifications.  

#### Seller Features:
- **Customizable Auctions:** Create auctions with formats like reserve price, "buy-now," and time-limited options.  
- **Performance Analytics:** Monitor trends, insights, and revenue using AI-based tools.  
- **Inventory Management:** Automate scheduling and promotions for optimized visibility.
- **Advanced Dashboard:** Manage Auctions, Customers, make notifications, auction personilize, and more....  

#### Admin Features:
- **Platform Oversight:** Manage users, auctions, and disputes with a comprehensive dashboard.  
- **Fraud Detection:** AI-driven anomaly detection to safeguard platform integrity.  
- **Dynamic Reporting:** Generate insights into revenue, activity, and trends.
- **Advanced Dashboard:** Manage Auctions, Customers, Sellers, Reports, Complaints  make notifications, auction personilize, and more....  
---

## **Screenshots**
### Homepage
![Homepage Screenshot](./assets/homepage.png)
![Auction Screenshot](./assets/auctionpage.png)
### Auction Page
![Auction 01 Screenshot](./assets/auction.png)

![Auction 01 Screenshot](./assets/auction1.png)

![Auction 01 Screenshot](./assets/auction2.png)

### Seller Page
![Admin Panel Screenshot](./assets/seller.png)

---

## **Technology Stack**

| Component           | Technology                               |
|---------------------|------------------------------------------|
| **Frontend**        | Next.js, Tailwind CSS, ShadCN            |
| **Backend**         | Node.js, Express.js, Prisma, Socket      |
| **Database**        | PostgresSQL, Redis                       |
| **AI/Analytics**    | BullMQ (TensorFlow, analytics)           |
| **Authentication**  | JWT, OAuth 2.0, 2FA, Google, Facebook    |

---

## **How to Get Started**

### Prerequisites
- **Node.js**: Version 16.x or higher.
- **PostgresSQL**: Version 8.0 or higher.
- **Redis server**


### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/prabhukumarsaw/bidbuy-platform.git
    ```
2. **Backend Setup**
   ```bash
   cd backend
   pnpm install
   cp .env.example .env  # Configure environment variables
   pnpm prisma migrate dev  # Run database migrations
   pnpm prisma db seed  # (Optional) Seed initial data
   pnpm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   pnpm install
   cp .env.example .env  # Configure frontend environment variables
   pnpm dev
   ```

4. **Database & Redis Configuration**
   - Ensure PostgreSQL and Redis are running
   - Update `.env` files with correct database and Redis connection strings

5. **Run the Application**
   - Backend runs at `http://localhost:5000`
   - Frontend runs at `http://localhost:3000`

## Usage
- Register/Login via Auth0
- Create an auction and set a starting price
- Place bids on active deals
- View auction history and bid status in real time

## Troubleshooting
- Check logs for errors: `pnpm logs`
- Ensure correct environment variables are set
- Restart services after changes: `pnpm restart`

## Contributing
Feel free to fork the repository and submit pull requests.

## License
MIT License

### 💖 Support This Project
