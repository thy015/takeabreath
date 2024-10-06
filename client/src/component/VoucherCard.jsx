import React, { useState } from 'react'
import { Col, Row, Radio } from 'antd';
function VoucherCard({ voucher, linkProperty, index }) {
    const [isChecked, setChecked] = useState(false)
    return (
        <Row className='max-w-[400px] h-full  mb-[10px] border-[1px] border-black rounded-[10px]' justify='space-around' align="">
            <Col flex={4} className='bg-[#003580] rounded-l-[10px] d-flex items-center justify-center '>
                <b className='text-[20px] font-bold text-white'> {voucher.discount}% </b>
            </Col>
            <Col flex={6} className='mt-[10px]'>
                <p>Code: {voucher.code}</p>
                <p>Voucher name:  {voucher.voucherName}</p>
                <p>Start day: {voucher.startDay}</p>
                <p>End day: {voucher.endDay}</p>
            </Col>
            <Col className="d-flex items-center" >
                <Radio checked={isChecked} onClick={() => {
                    !isChecked ? setChecked(true) : setChecked(false)
                }}></Radio>
            </Col>
        </Row>
    )
}

export default VoucherCard