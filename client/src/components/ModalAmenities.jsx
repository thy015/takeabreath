import React, { useEffect, useState } from 'react'
import { Modal, Form, Select, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import axios from 'axios'
import { openNotification } from '../hooks/notification'
import { useSelector, useDispatch } from 'react-redux'
import { addAmenity } from '../hooks/redux/hotelsSclice'
import { faPray } from '@fortawesome/free-solid-svg-icons'
function ModalAmenities({ visible, close }) {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const amenity = useSelector(state => state.hotel.amenity)
    const hotelSelected = useSelector(state => state.hotel.selectedHotel)
    const [amenities, setAmenities] = useState({})
    const [totalSelections, setTotalSelections] = useState(0);
    const [formValues, setFormValues] = useState({});
    const BE_PORT=import.meta.env.VITE_BE_PORT
    const { Option } = Select;
    const initalAmenities = {
        bathroom: [],
        bedroom: [],
        dining: [],
        entertainment: [],
        heatingAndCooling: [],
        location: [],
        outdoor: [],
        safety: [],
        service: [],
        view: []
    }

    function isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }

    useEffect(() => {
        // get amenities
        axios.get(`${BE_PORT}/api/hotelList/hotelAmenities`)
            .then(res => res.data)
            .then(data => {
                setAmenities(data.amenitiesEnum)
            })
            .catch(err => {
                console.log(err)

            })
    }, [])
    useEffect(() => {
        const aniUpdate = amenity?.view ? amenity : initalAmenities

        setTotalSelections(aniUpdate.count??0)
        form.setFieldsValue(aniUpdate ?? initalAmenities)
        setFormValues(aniUpdate ?? initalAmenities)
    }, [hotelSelected, visible, form])



    const handleChange = (amenity, selectedItems) => {
        const preSeclectionCount = formValues[amenity]?.length || 0
        const currentSelectionCount = selectedItems.length
        const newTotal = totalSelections - preSeclectionCount + currentSelectionCount
        if (newTotal > 10) {
            openNotification(false, "Thêm tiện ích thất bại", "Chỉ chọn tối đa 10 tiện ích")
            return
        } else {
            setTotalSelections(newTotal)
            setFormValues((pre) => ({
                ...pre,
                [amenity]: selectedItems,
                count: newTotal
            }))
        }
    }
    const onFinish = (values) => {
        dispatch(addAmenity(formValues))
        close()
    };
    const handleInsertAmenities = () => {
        form.submit()
    }
    return (
        <Modal
            open={visible}
            onCancel={close}
            title="Thêm tiện ích cho khách sạn"
            okText="Xác nhận thêm"
            cancelText="Trở lại"
            onOk={handleInsertAmenities}
        >
            <Form
                initialValues={formValues}
                form={form}
                name="booking_form"
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 600, margin: '0 auto' }}
            >
                {Object.entries(amenities).map(([amenity, options]) => (
                    <Form.Item
                        key={amenity}
                        name={amenity}
                        label={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    >
                        <Select
                            value={formValues[amenity]}
                            onChange={(selectedItems) => handleChange(amenity, selectedItems)}
                            mode="multiple"
                            placeholder={`Select ${amenity}`}
                            allowClear
                        >
                            {options.map((option) => (
                                <Option
                                    key={option}
                                    value={option}
                                    disabled={totalSelections >= 10 && !(formValues[amenity]?.includes(option))}

                                >
                                    {option}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    )
}

export default ModalAmenities