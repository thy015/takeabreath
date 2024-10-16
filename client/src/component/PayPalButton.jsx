import React, { useEffect, useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { setPaymentCompleted } from '../hooks/redux/inputDaySlice';
import {openNotification} from '../hooks/notification'
const PayPalButton = () => {
    const paypal = useRef();
    const dispatch=useDispatch()
    const {convertPrice}=useSelector((state)=>state.inputDay)
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
                                        value: convertPrice,
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {
                        const order = await actions.order.capture();
                        console.log(order);
                        openNotification(true,"Success","Payment success")
                        dispatch(setPaymentCompleted({completedPayment:true}))
                        e.preventDefault()
                    },
                    onError: (err) => {
                        console.error(err);
                        e.preventDefault()
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
