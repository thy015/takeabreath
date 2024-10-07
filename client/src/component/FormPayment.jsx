import React from 'react'
import { Form, Input, Row, Col } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
function FormPayment({ paymentMethod }) {
    const InputPayment = paymentMethod === 'visa' ?
        (
            <Row>
                <Col span={12}>
                    <FormItem
                        label={"Number card"}
                        name='numberCard'
                    >
                        <Input></Input>
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        
                        className='w-[100px] ml-[10px]'
                        label={"CVV"}
                        name='cvv'
                    >
                        <Input maxLength={3}></Input>
                    </FormItem>
                </Col>
            </Row>



        )
        :
        (<FormItem      
            span= {24}
            label="Phone"
            name='phonepayment'
        >
            <PhoneInput
                defaultMask='... ... ... .'
            />
        </FormItem>
        )


    return InputPayment
}

export default FormPayment