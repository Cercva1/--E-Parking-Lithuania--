# --E-Parking-Lithuania--
Web-based parking reservation system built with HTML, CSS and Vanilla JavaScript. Includes authentication, booking lifecycle, payment simulation and cancellation logic.


# 🚗 E-Parking Lithuania

E-Parking Lithuania is a web-based parking reservation system built using HTML, CSS, and Vanilla JavaScript.

The project simulates a real-world parking management platform where users can register, log in, browse parking places, create bookings, simulate payments, and manage cancellations.

---

## 🔹 Features

- User Registration & Login (LocalStorage-based authentication)
- Dashboard with available parking locations
- Dynamic booking system
- Payment simulation (card validation)
- Double-booking prevention
- Cancellation with refund policy (1-hour rule)
- User-specific booking history
- Profile management
- Theme customization
- Responsive UI design

---

## 🏗 Project Structure

### 📁 HTML
- `index.html` – Landing page
- `login.html` – User login page
- `register.html` – User registration page
- `dashboard.html` – Main system interface
- `profile.html` – User profile management
- `booking.html` – Optional standalone booking page

### 📁 JavaScript
- `data.js` – Parking data (simulated database)
- `auth.js` – Authentication logic
- `booking.js` – Core booking & business logic
- `theme.js` – Theme switching system

### 📁 CSS
- `style.css` – Complete UI and design system

---

## ⚙️ Technical Overview

The project follows a modular structure:

- HTML → Structure
- CSS → Presentation
- JavaScript → Business logic

LocalStorage is used to simulate:
- User database
- Session management
- Booking storage
- Theme persistence

The booking lifecycle includes:
1. Authentication
2. Reservation creation
3. Payment simulation
4. Conflict prevention
5. Cancellation logic with refund conditions

---

## 🚀 Future Improvements

In a production environment, this system could be extended with:

- Backend API integration
- Database storage (e.g., PostgreSQL, MongoDB)
- Secure password hashing (bcrypt)
- JWT authentication
- Real-time parking availability
- Payment gateway integration (Stripe, PayPal)

---

## 👨‍💻 Author

Developed as an academic project demonstrating frontend architecture, booking lifecycle management, and UI/UX design principles.


