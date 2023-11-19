import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const RegistrationPage = ({ handleNameChange, handlePasswordChange, handleRegistration, registrationStatus }) => {
  return (
    <div className="page">
      <h2>Registration</h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" onChange={handleNameChange} />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" onChange={handlePasswordChange} />
      </div>
      <button className="register-button" onClick={handleRegistration}>Register</button>
      <div className="status">{registrationStatus}</div>
    </div>
  );
};

const LoginPage = ({ handleNameChange, handlePasswordChange, handleLogin, loginError }) => {
  return (
    <div className="page">
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" onChange={handleNameChange} />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" onChange={handlePasswordChange} />
      </div>
      <button className="login-button" onClick={handleLogin}>Login</button>
      <div className="error">{loginError}</div>
    </div>
  );
};

const PaymentPage = ({ handlePayment, paymentStatus }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
  };

  const handleExpiryDateChange = (e) => {
    setExpiryDate(e.target.value);
  };

  const handleCvvChange = (e) => {
    setCvv(e.target.value);
  };

  return (
    <div className="payment-page">
      <h2>Payment</h2>
      <div className="form-group">
        <label htmlFor="cardNumber">Card Number:</label>
        <input type="text" id="cardNumber" onChange={handleCardNumberChange} />
      </div>
      <div className="form-group">
        <label htmlFor="expiryDate">Expiry Date:</label>
        <input type="text" id="expiryDate" onChange={handleExpiryDateChange} />
      </div>
      <div className="form-group">
        <label htmlFor="cvv">CVV:</label>
        <input type="password" id="cvv" onChange={handleCvvChange} />
      </div>
      <button className="payment-button" onClick={handlePayment}>Make Payment</button>
      <div className="payment-status">{paymentStatus}</div>
    </div>
  );
};

const TicketBookingPage = ({
  name,
  handleNameChange,
  handleSeatSelection,
  handlePriceChange,
  handleBooking,
  handlePayment,
  selectedSeat,
  selectedPrice,
  bookingStatus,
  paymentStatus
}) => {
  return (
    <div className="page">
      <h2>Ticket Booking</h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={handleNameChange} />
      </div>
      <div className="seat-selection">
        <h3>Select a Seat:</h3>
        <div className="seat-container">
          <div
            className={`seat ${selectedSeat === 'A1' ? 'selected' : ''}`}
            onClick={() => {
              handleSeatSelection('A1');
              handlePriceChange(10); // Set the price for seat A1
            }}
          >
            A1
          </div>
          <div
            className={`seat ${selectedSeat === 'A2' ? 'selected' : ''}`}
            onClick={() => {
              handleSeatSelection('A2');
              handlePriceChange(15); // Set the price for seat A2
            }}
          >
            A2
          </div>
          {/* Add more seats as needed */}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input type="text" id="price" value={selectedPrice} disabled />
      </div>
      <PaymentPage handlePayment={handlePayment} paymentStatus={paymentStatus} />
      <button className="book-button" onClick={handleBooking}>Book Ticket</button>
      <div className="status">{bookingStatus}</div>
    </div>
  );
};

const TicketBookingSystem = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [bookingStatus, setBookingStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegistration = async () => {
    if (name && password) {
      try {
        // Send registration request to the server
        await axios.post('/api/register', { name, password });
        setRegistrationStatus('Registration successful! You can now log in.');
        setName('');
        setPassword('');
      } catch (error) {
        setRegistrationStatus('An error occurred during registration.');
      }
    } else {
      setRegistrationStatus('Please provide a name and password.');
    }
  };

  const handleLogin = async () => {
    if (name && password) {
      try {
        // Send login request to the server
        const response = await axios.post('/api/login', { name, password });
        setLoggedIn(true);
        setLoginError('');
      } catch (error) {
        setLoggedIn(false);
        setLoginError('Invalid login credentials.');
      }
    } else {
      setLoginError('Please provide a name and password.');
    }
  };

  const handleSeatSelection = (seat) => {
    setSelectedSeat(seat);
  };

  const handlePriceChange = (price) => {
    setSelectedPrice(price);
  };

  const handlePayment = async () => {
    // Process the payment here (e.g., integrate with a payment gateway)
    // You can modify this function to suit your payment processing requirements

    if (name && selectedSeat) {
      try {
        // Simulating a successful payment
        setPaymentStatus('Payment successful!');

        // Proceed with the ticket booking
        handleBooking();
      } catch (error) {
        setPaymentStatus('An error occurred during payment.');
      }
    } else {
      setPaymentStatus('Please provide your name and select a seat.');
    }
  };

  const handleBooking = async () => {
    if (name && selectedSeat) {
      try {
        const response = await axios.post('/api/users', { name, seat: selectedSeat });
        setBookingStatus(`Congratulations, ${name}! You have booked seat ${selectedSeat} for $${selectedPrice}.`);
      } catch (error) {
        setBookingStatus('An error occurred while booking the ticket.');
      }
    } else {
      setBookingStatus('Please provide your name and select a seat.');
    }
  };

  if (loggedIn) {
    return (
      <TicketBookingPage
        name={name}
        handleNameChange={handleNameChange}
        handleSeatSelection={handleSeatSelection}
        handlePriceChange={handlePriceChange}
        handleBooking={handleBooking}
        handlePayment={handlePayment}
        selectedSeat={selectedSeat}
        selectedPrice={selectedPrice}
        bookingStatus={bookingStatus}
        paymentStatus={paymentStatus}
      />
    );
  } else {
    return (
      <div className="container">
        <h1>Online Ticket Booking System</h1>
        <div className="pages">
          <RegistrationPage
            handleNameChange={handleNameChange}
            handlePasswordChange={handlePasswordChange}
            handleRegistration={handleRegistration}
            registrationStatus={registrationStatus}
          />
          <LoginPage
            handleNameChange={handleNameChange}
            handlePasswordChange={handlePasswordChange}
            handleLogin={handleLogin}
            loginError={loginError}
          />
        </div>
      </div>
    );
  }
};

export default TicketBookingSystem;
