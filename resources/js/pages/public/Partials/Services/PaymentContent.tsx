import React from 'react';

export default function PaymentContent() {
    return (
        // <!-- Single Post Start-->
        <div className="single">
            <div className="container">
                <div className="row">
                    {/* Empty column for spacing */}
                    <div className="col-lg-2"></div>
                    <div className="col-lg-8">
                        <div className="single-content">
                            <img src="images/services/payment.jpg" alt="Payment Gateway Image" />
                            <h3>Payment Gateway</h3>
                            <p>
                                With TUTIA Payment gateway work with all major credit card networks, digital wallets, and ecommerce platforms.<br /><br />
                                Other features include the ability to process different foreign currencies, arrange recurring billing, and track your transactions via an account management dashboard.<br /><br />
                            </p>

                        </div>
                    </div>
                    {/* Empty column for spacing */}
                    <div className="col-lg-2"></div>
                </div>
            </div>
        </div>
        // <!-- Single Post End-->
    );
}
