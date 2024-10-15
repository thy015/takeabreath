import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
const PayPalButton = () => {
    const paypal = useRef();
        
        const dollarRates=25
    useEffect(() => {
        const addPayPalScript = () => {
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=Ab6o7lX12FWOd6xme7eB0yfeJmGnO4suKyitDec93zJC17TvYMX3V4QJ7cIVLUHzJGaYGT1uAURnKH6b'; 
            script.async = true;
            script.onload = () => {
                window.paypal.Buttons({
                    createOrder: (data, actions, err) => {
                        return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [
                                {
                                    description: 'Test',
                                    amount: {
                                        currency_code: 'USD',
                                        value: 0.01,
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {
                        const order = await actions.order.capture();
                        console.log(order);
                    },
                    onError: (err) => {
                        console.error(err);
                    },
                }).render(paypal.current);
            };
            document.body.appendChild(script);
        };

        addPayPalScript();
    }, []);

    return (
        <div>         
            <div ref={paypal}></div>
        </div>
    );
};

export default PayPalButton;
