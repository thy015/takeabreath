import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPaymentCompleted } from '../hooks/redux/inputDaySlice';
import { openNotification } from '../hooks/notification';
import axios from 'axios';

const PayPalButton = () => {
    const paypal = useRef();
    const dispatch = useDispatch();
    const { convertPrice, invoiceID } = useSelector((state) => state.inputDay);

    useEffect(() => {
        console.log("Current invoiceID in PayPalButton:", invoiceID);
    }, [invoiceID]);

    useEffect(() => {
        const addPayPalScript = () => {
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=Ab6o7lX12FWOd6xme7eB0yfeJmGnO4suKyitDec93zJC17TvYMX3V4QJ7cIVLUHzJGaYGT1uAURnKH6b';
            script.async = true;
            script.onload = () => {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [
                                {
                                    description: 'Test',
                                    amount: {
                                        currency_code: 'USD',
                                        value: convertPrice,
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {
                        const order = await actions.order.capture();
                        console.log("Order:", order);
                        console.log("InvoiceID being sent:", invoiceID);
                        dispatch(setPaymentCompleted({ completedPayment: true }));
                        try {
                            const res = await axios.post('http://localhost:4000/api/booking/completedTran', { order, invoiceID });
                            if (res.status === 200) {
                                openNotification(true, "Success", "Payment success");
                            } else {
                                openNotification(false, "Error", "Payment failed");
                            }
                        } catch (e) {
                            console.log('error', e.response?.data?.message || 'An error occurred');
                        }
                    },
                    onError: (err) => {
                        console.error(err);
                    },
                }).render(paypal.current);
            };
            document.body.appendChild(script);
        };

        addPayPalScript();
    }, [invoiceID]);

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    );
};

export default PayPalButton;
