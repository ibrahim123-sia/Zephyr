# Zephyr

## Business Overview

Zephyr is an online perfume store where customers can browse men's and women's fragrance collections, add items to their cart, and easily check out using JazzCash. Once an order is placed, the customer also receives an email confirmation so they can keep track of their order status.

For the people running the business (owner/staff), there's a separate **Admin Portal** where they can:

- Add new products and update their prices, images, and details
- View and manage all incoming orders (including updating order status)
- View the list of registered customers/users

In short, this platform works like a small, complete online shop — a shopping experience for customers on the front end, and an admin panel that gives the business owner full control over the store.

---

Zephyr is a full-stack e-commerce web app for a perfume brand. Customers can browse men's and women's fragrance collections, add items to cart, check out with JazzCash (mobile payment gateway), and track their orders. The platform includes JWT-based authentication, Cloudinary-hosted product images, email notifications via Nodemailer, and an admin panel for managing products, orders, and users.

Built with a Node.js/Express backend and a React (Vite) frontend.

## Project Structure

```
backend/    Express API server (MongoDB via Mongoose, JWT auth, Cloudinary uploads)
frontend/   React app (Vite, Redux Toolkit, Tailwind CSS)
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Both `backend/` and `frontend/` require their own `.env` file (not committed to version control). Create one in each directory based on the variables used in the respective codebase.
