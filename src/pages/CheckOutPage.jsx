import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../hooks/useOrderMutations";
import { useProfile } from "../hooks/useProfile";
import "../styles/CheckoutPage.css";

const TAX_RATE = 0.05;

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: profileData } = useProfile();
  const createOrderMutation = useCreateOrderMutation();

  /*
    Books can come in two ways:

    1. Multiple books:
       location.state.books

    2. Single book from older code:
       location.state.book
  */
  const initialBooks =
    location.state?.books ||
    (location.state?.book
      ? [
          {
            ...location.state.book,
            quantity: 1,
          },
        ]
      : []);

  const [cartBooks, setCartBooks] = useState(initialBooks);
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  const [card, setCard] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [upiId, setUpiId] = useState("");

  const [netBanking, setNetBanking] = useState("");

  const [wallet, setWallet] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState({});

  const loading = createOrderMutation.isPending;

  useEffect(() => {
    const profile = profileData?.user || profileData;
    const savedAddress = profile?.address;

    if (savedAddress) {
      setAddress({
        addressLine: savedAddress.addressLine || "",
        city: savedAddress.city || "",
        state: savedAddress.state || "",
        postalCode: savedAddress.postalCode || "",
        country: savedAddress.country || "India",
      });
    }

    if (profile) {
      setCustomer((prev) => ({
        ...prev,
        firstName: profile.name?.split(" ")[0] || "",
        lastName: profile.name?.split(" ").slice(1).join(" ") || "",
        email: profile.email || "",
      }));
    }
  }, [profileData]);
  /*
    Increase quantity
  */
  const increaseQuantity = (bookId) => {
    setCartBooks((prev) =>
      prev.map((book) => {
        if (book._id !== bookId) {
          return book;
        }

        const currentQuantity = Number(book.quantity || 1);

        const stock = Number(book.stock || book.availableQuantity || 999999);

        if (currentQuantity >= stock) {
          return book;
        }

        return {
          ...book,
          quantity: currentQuantity + 1,
        };
      }),
    );
  };

  /*
    Decrease quantity
  */
  const decreaseQuantity = (bookId) => {
    setCartBooks((prev) =>
      prev.map((book) => {
        if (book._id !== bookId) {
          return book;
        }

        const currentQuantity = Number(book.quantity || 1);

        return {
          ...book,
          quantity: currentQuantity > 1 ? currentQuantity - 1 : 1,
        };
      }),
    );
  };

  /*
    Remove book
  */
  const removeBook = (bookId) => {
    setCartBooks((prev) => prev.filter((book) => book._id !== bookId));
  };

  /*
    Customer input
  */
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /*
    Address input
  */
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /*
    Card input
  */
  const handleCardChange = (e) => {
    const { name, value } = e.target;

    setCard((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /*
    Add another book
  */
  const handleAddAnotherBook = () => {
    navigate("/books", {
      state: {
        selectedBooks: cartBooks,
      },
    });
  };

  /*
    Validation
  */
  const validateForm = () => {
    const newErrors = {};

    if (!customer.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!customer.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!customer.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!customer.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(customer.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!address.addressLine.trim()) {
      newErrors.addressLine = "Address is required";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!address.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!address.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    /*
      Card validation
    */
    if (paymentMethod === "card") {
      if (!card.cardName.trim()) {
        newErrors.cardName = "Cardholder name is required";
      }

      if (!card.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^[0-9]{16}$/.test(card.cardNumber)) {
        newErrors.cardNumber = "Card number must contain 16 digits";
      }

      if (!card.expiry.trim()) {
        newErrors.expiry = "Expiry date is required";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
        newErrors.expiry = "Enter expiry as MM/YY";
      }

      if (!card.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!/^[0-9]{3,4}$/.test(card.cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
    }

    /*
      UPI validation
    */
    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        newErrors.upiId = "UPI ID is required";
      } else if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        newErrors.upiId = "Enter a valid UPI ID";
      }
    }

    /*
      Net banking
    */
    if (paymentMethod === "netbanking") {
      if (!netBanking) {
        newErrors.netBanking = "Please select your bank";
      }
    }

    /*
      Wallet
    */
    if (paymentMethod === "wallet") {
      if (!wallet) {
        newErrors.wallet = "Please select a wallet";
      }
    }

    /*
      Terms
    */
    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
    Submit order
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (cartBooks.length === 0) {
      alert("Please add at least one book.");
      return;
    }

    try {
      /*
        All books are sent together.
      */
      const orderDetails = {
        items: cartBooks.map((book) => ({
          bookId: book._id,
          quantity: Number(book.quantity || 1),
          price: Number(book.price || 0),
        })),

        paymentMethod,

        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },

        address: {
          addressLine: address.addressLine,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },

        subtotal,
        tax,
        total,
      };

      console.log("Order data:", orderDetails);

      /*
        IMPORTANT:
        createOrder should accept one object.
      */
      const response = await createOrderMutation.mutateAsync(orderDetails);

      console.log("Order created:", response);

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error("Order error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to place order",
      );
    }
  };

  /*
    Calculate subtotal
  */
  const subtotal = cartBooks.reduce((total, book) => {
    return total + Number(book.price || 0) * Number(book.quantity || 1);
  }, 0);

  /*
    Tax
  */
  const tax = subtotal * TAX_RATE;

  /*
    Final total
  */
  const total = subtotal + tax;

  /*
    Empty checkout
  */
  if (cartBooks.length === 0) {
    return (
      <div className="checkout-empty-page">
        <div className="checkout-empty-card">
          <h2 className="checkout-card-title">No books selected</h2>

          <p className="checkout-header-text">
            Please select at least one book before going to checkout.
          </p>

          <button
            type="button"
            onClick={() => navigate("/books")}
            className="checkout-primary-button"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <div>
          <h1 className="checkout-header-title">Secure Checkout</h1>

          <p className="checkout-header-text">
            Review your books, enter your delivery details, and choose your
            payment method.
          </p>
        </div>

        <div className="checkout-secure-badge">🔒 Secure Checkout</div>
      </header>

      <div className="checkout-container">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="checkout-back-button"
        >
          ← Back
        </button>

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* LEFT SIDE */}
            <div>
              {/* Customer Information */}
              <section className="checkout-card">
                <h2 className="checkout-card-title">Customer Information</h2>

                <div className="checkout-form-grid">
                  <div>
                    <label className="checkout-label">First Name</label>

                    <input
                      type="text"
                      name="firstName"
                      value={customer.firstName}
                      onChange={handleCustomerChange}
                      placeholder="Enter first name"
                      className="checkout-input"
                    />

                    {errors.firstName && (
                      <p className="checkout-error">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="checkout-label">Last Name</label>

                    <input
                      type="text"
                      name="lastName"
                      value={customer.lastName}
                      onChange={handleCustomerChange}
                      placeholder="Enter last name"
                      className="checkout-input"
                    />

                    {errors.lastName && (
                      <p className="checkout-error">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="checkout-label">Email</label>

                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={handleCustomerChange}
                      placeholder="example@gmail.com"
                      className="checkout-input"
                    />

                    {errors.email && (
                      <p className="checkout-error">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="checkout-label">Phone</label>

                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      placeholder="10-digit phone number"
                      className="checkout-input"
                    />

                    {errors.phone && (
                      <p className="checkout-error">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section className="checkout-card">
                <h2 className="checkout-card-title">Delivery Address</h2>

                <div>
                  <label className="checkout-label">Address</label>

                  <textarea
                    name="addressLine"
                    value={address.addressLine}
                    onChange={handleAddressChange}
                    placeholder="House / Street / Area"
                    rows="3"
                    className="checkout-textarea"
                  />

                  {errors.addressLine && (
                    <p className="checkout-error">{errors.addressLine}</p>
                  )}
                </div>

                <div className="checkout-form-grid">
                  <div>
                    <label className="checkout-label">City</label>

                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      className="checkout-input"
                    />

                    {errors.city && (
                      <p className="checkout-error">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="checkout-label">State</label>

                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      placeholder="State"
                      className="checkout-input"
                    />

                    {errors.state && (
                      <p className="checkout-error">{errors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="checkout-label">Postal Code</label>

                    <input
                      type="text"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleAddressChange}
                      placeholder="Postal code"
                      className="checkout-input"
                    />

                    {errors.postalCode && (
                      <p className="checkout-error">{errors.postalCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="checkout-label">Country</label>

                    <input
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      className="checkout-input"
                    />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="checkout-card">
                <h2 className="checkout-card-title">Payment Method</h2>

                <div className="checkout-payment-grid">
                  {/* Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`checkout-payment-option ${paymentMethod === "card" ? "selected" : ""}`}
                  >
                    💳
                    <span>Credit / Debit Card</span>
                  </button>

                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`checkout-payment-option ${paymentMethod === "upi" ? "selected" : ""}`}
                  >
                    📱
                    <span>UPI</span>
                  </button>

                  {/* Net Banking */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`checkout-payment-option ${paymentMethod === "netbanking" ? "selected" : ""}`}
                  >
                    🏦
                    <span>Net Banking</span>
                  </button>

                  {/* Wallet */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`checkout-payment-option ${paymentMethod === "wallet" ? "selected" : ""}`}
                  >
                    👛
                    <span>Digital Wallet</span>
                  </button>

                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`checkout-payment-option ${paymentMethod === "cod" ? "selected" : ""}`}
                  >
                    💵
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {errors.paymentMethod && (
                  <p className="checkout-error">{errors.paymentMethod}</p>
                )}

                {/* CARD DETAILS */}
                {paymentMethod === "card" && (
                  <div className="checkout-payment-details">
                    <h3>Card Information</h3>

                    <div>
                      <label className="checkout-label">Cardholder Name</label>

                      <input
                        type="text"
                        name="cardName"
                        value={card.cardName}
                        onChange={handleCardChange}
                        placeholder="Name on card"
                        className="checkout-input"
                      />

                      {errors.cardName && (
                        <p className="checkout-error">{errors.cardName}</p>
                      )}
                    </div>

                    <div>
                      <label className="checkout-label">Card Number</label>

                      <input
                        type="text"
                        name="cardNumber"
                        value={card.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234567812345678"
                        maxLength="16"
                        className="checkout-input"
                      />

                      {errors.cardNumber && (
                        <p className="checkout-error">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="checkout-form-grid">
                      <div>
                        <label className="checkout-label">Expiry</label>

                        <input
                          type="text"
                          name="expiry"
                          value={card.expiry}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="checkout-input"
                        />

                        {errors.expiry && (
                          <p className="checkout-error">{errors.expiry}</p>
                        )}
                      </div>

                      <div>
                        <label className="checkout-label">CVV</label>

                        <input
                          type="password"
                          name="cvv"
                          value={card.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          maxLength="4"
                          className="checkout-input"
                        />

                        {errors.cvv && (
                          <p className="checkout-error">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI DETAILS */}
                {paymentMethod === "upi" && (
                  <div className="checkout-payment-details">
                    <h3>UPI Payment</h3>

                    <label className="checkout-label">UPI ID</label>

                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="example@upi"
                      className="checkout-input"
                    />

                    {errors.upiId && (
                      <p className="checkout-error">{errors.upiId}</p>
                    )}

                    <p className="checkout-security-text">
                      You will be redirected to your UPI app to complete the
                      payment.
                    </p>
                  </div>
                )}

                {/* NET BANKING */}
                {paymentMethod === "netbanking" && (
                  <div className="checkout-payment-details">
                    <h3>Net Banking</h3>

                    <label className="checkout-label">Select Bank</label>

                    <select
                      value={netBanking}
                      onChange={(e) => setNetBanking(e.target.value)}
                      className="checkout-input"
                    >
                      <option value="">Select your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>

                    {errors.netBanking && (
                      <p className="checkout-error">{errors.netBanking}</p>
                    )}
                  </div>
                )}

                {/* WALLET */}
                {paymentMethod === "wallet" && (
                  <div className="checkout-payment-details">
                    <h3>Digital Wallet</h3>

                    <label className="checkout-label">Select Wallet</label>

                    <select
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      className="checkout-input"
                    >
                      <option value="">Select wallet</option>
                      <option value="paytm">Paytm</option>
                      <option value="phonepe">PhonePe</option>
                      <option value="googlepay">Google Pay</option>
                    </select>

                    {errors.wallet && (
                      <p className="checkout-error">{errors.wallet}</p>
                    )}
                  </div>
                )}

                {/* COD */}
                {paymentMethod === "cod" && (
                  <div className="checkout-cod-box">
                    <h3 className="checkout-cod-title">Cash on Delivery</h3>

                    <p className="checkout-cod-text">
                      Pay when your order is delivered to your address.
                    </p>

                    <p className="checkout-cod-text">
                      Please keep the exact amount ready when the delivery
                      arrives.
                    </p>
                  </div>
                )}
              </section>

              {/* Support */}
              <section className="checkout-support-card">
                <h2 className="checkout-card-title">Support & Terms</h2>

                <p className="checkout-header-text">
                  Need help with your order?
                </p>

                <p className="checkout-header-text">
                  📧 Email: support@example.com
                </p>

                <p className="checkout-header-text">
                  📞 Phone: +91 98765 43210
                </p>

                <p className="checkout-header-text">
                  Orders can be cancelled or refunded according to our refund
                  policy.
                </p>
              </section>

              {/* Terms */}
              <section className="checkout-card">
                <label className="checkout-checkbox-label">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />

                  <span>
                    I agree to the terms and conditions, refund policy, and
                    privacy policy.
                  </span>
                </label>

                {errors.terms && (
                  <p className="checkout-error">{errors.terms}</p>
                )}
              </section>
            </div>

            {/* RIGHT SIDE */}
            <aside>
              <section className="checkout-summary-card">
                <h2 className="checkout-card-title">Order Summary</h2>

                {/* Books */}
                {cartBooks.map((book) => (
                  <div key={book._id} className="checkout-summary-book">
                    {/* Image */}
                    <div className="checkout-summary-image-container">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="checkout-summary-image"
                        />
                      ) : (
                        <div className="checkout-summary-no-image">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Book information */}
                    <div className="checkout-book-info">
                      <h3 className="checkout-book-title">{book.title}</h3>

                      <p className="checkout-book-author">by {book.author}</p>

                      <p className="checkout-book-price">
                        ₹{Number(book.price || 0).toFixed(2)}
                      </p>

                      {/* Quantity */}
                      <div className="checkout-quantity-row">
                        <span>Quantity:</span>

                        <div className="checkout-quantity-controls">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(book._id)}
                            className="checkout-quantity-button"
                          >
                            −
                          </button>

                          <span>{book.quantity}</span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(book._id)}
                            className="checkout-quantity-button"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeBook(book._id)}
                        className="checkout-remove-button"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Item total */}
                    <div className="checkout-item-total">
                      ₹
                      {(
                        Number(book.price || 0) * Number(book.quantity || 1)
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}

                {/* Add Another Book */}
                <button
                  type="button"
                  onClick={handleAddAnotherBook}
                  className="checkout-secondary-button"
                >
                  + Add Another Book
                </button>

                <div className="checkout-divider" />

                {/* Price */}
                <div className="checkout-price-row">
                  <span>Subtotal</span>

                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="checkout-price-row">
                  <span>Tax (5%)</span>

                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="checkout-divider" />

                <div className="checkout-total-row">
                  <span>Total</span>

                  <span>₹{total.toFixed(2)}</span>
                </div>

                {/* Payment summary */}
                {paymentMethod && (
                  <div className="checkout-method-summary">
                    <strong>Payment Method</strong>

                    <span>
                      {paymentMethod === "card" && "Credit / Debit Card"}

                      {paymentMethod === "upi" && "UPI"}

                      {paymentMethod === "netbanking" && "Net Banking"}

                      {paymentMethod === "wallet" && "Digital Wallet"}

                      {paymentMethod === "cod" && "Cash on Delivery"}
                    </span>
                  </div>
                )}

                {/* Security */}
                <p className="checkout-secure-text">
                  🔒 Your payment information is protected and securely
                  processed.
                </p>

                {/* Place order */}
                <button
                  type="submit"
                  disabled={loading}
                  className="checkout-primary-button checkout-place-order-button"
                >
                  {loading
                    ? "Placing Order..."
                    : `Place Order • ₹${total.toFixed(2)}`}
                </button>
              </section>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CheckoutPage;
