import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Modal, Col, Row, Rate, Form, Input, ConfigProvider, Select, Button } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import axios from 'axios'
import { useForm } from 'antd/es/form/Form'
function BookingConfirmationForm({ isShow, onCancel, room, hotel,count }) {
    const [form] = useForm()
    const[days,setDay] = useState(3)
    const [nations, setNation] = useState([
        {
            "native": "Andorra"
        },
        {
            "native": "دولة الإمارات العربية المتحدة"
        },
        {
            "native": "افغانستان"
        },
        {
            "native": "Antigua and Barbuda"
        },
        {
            "native": "Anguilla"
        },
        {
            "native": "Shqipëria"
        },
        {
            "native": "Հայաստան"
        },
        {
            "native": "Angola"
        },
        {
            "native": "Antarctica"
        },
        {
            "native": "Argentina"
        },
        {
            "native": "American Samoa"
        },
        {
            "native": "Österreich"
        },
        {
            "native": "Australia"
        },
        {
            "native": "Aruba"
        },
        {
            "native": "Åland"
        },
        {
            "native": "Azərbaycan"
        },
        {
            "native": "Bosna i Hercegovina"
        },
        {
            "native": "Barbados"
        },
        {
            "native": "Bangladesh"
        },
        {
            "native": "België"
        },
        {
            "native": "Burkina Faso"
        },
        {
            "native": "България"
        },
        {
            "native": "‏البحرين"
        },
        {
            "native": "Burundi"
        },
        {
            "native": "Bénin"
        },
        {
            "native": "Saint-Barthélemy"
        },
        {
            "native": "Bermuda"
        },
        {
            "native": "Negara Brunei Darussalam"
        },
        {
            "native": "Bolivia"
        },
        {
            "native": "Bonaire"
        },
        {
            "native": "Brasil"
        },
        {
            "native": "Bahamas"
        },
        {
            "native": "ʼbrug-yul"
        },
        {
            "native": "Bouvetøya"
        },
        {
            "native": "Botswana"
        },
        {
            "native": "Белару́сь"
        },
        {
            "native": "Belize"
        },
        {
            "native": "Canada"
        },
        {
            "native": "Cocos (Keeling) Islands"
        },
        {
            "native": "République démocratique du Congo"
        },
        {
            "native": "Ködörösêse tî Bêafrîka"
        },
        {
            "native": "République du Congo"
        },
        {
            "native": "Schweiz"
        },
        {
            "native": "Côte d'Ivoire"
        },
        {
            "native": "Cook Islands"
        },
        {
            "native": "Chile"
        },
        {
            "native": "Cameroon"
        },
        {
            "native": "中国"
        },
        {
            "native": "Colombia"
        },
        {
            "native": "Costa Rica"
        },
        {
            "native": "Cuba"
        },
        {
            "native": "Cabo Verde"
        },
        {
            "native": "Curaçao"
        },
        {
            "native": "Christmas Island"
        },
        {
            "native": "Κύπρος"
        },
        {
            "native": "Česká republika"
        },
        {
            "native": "Deutschland"
        },
        {
            "native": "Djibouti"
        },
        {
            "native": "Danmark"
        },
        {
            "native": "Dominica"
        },
        {
            "native": "República Dominicana"
        },
        {
            "native": "الجزائر"
        },
        {
            "native": "Ecuador"
        },
        {
            "native": "Eesti"
        },
        {
            "native": "مصر‎"
        },
        {
            "native": "الصحراء الغربية"
        },
        {
            "native": "ኤርትራ"
        },
        {
            "native": "España"
        },
        {
            "native": "ኢትዮጵያ"
        },
        {
            "native": "Suomi"
        },
        {
            "native": "Fiji"
        },
        {
            "native": "Falkland Islands"
        },
        {
            "native": "Micronesia"
        },
        {
            "native": "Føroyar"
        },
        {
            "native": "France"
        },
        {
            "native": "Gabon"
        },
        {
            "native": "United Kingdom"
        },
        {
            "native": "Grenada"
        },
        {
            "native": "საქართველო"
        },
        {
            "native": "Guyane française"
        },
        {
            "native": "Guernsey"
        },
        {
            "native": "Ghana"
        },
        {
            "native": "Gibraltar"
        },
        {
            "native": "Kalaallit Nunaat"
        },
        {
            "native": "Gambia"
        },
        {
            "native": "Guinée"
        },
        {
            "native": "Guadeloupe"
        },
        {
            "native": "Guinea Ecuatorial"
        },
        {
            "native": "Ελλάδα"
        },
        {
            "native": "South Georgia"
        },
        {
            "native": "Guatemala"
        },
        {
            "native": "Guam"
        },
        {
            "native": "Guiné-Bissau"
        },
        {
            "native": "Guyana"
        },
        {
            "native": "香港"
        },
        {
            "native": "Heard Island and McDonald Islands"
        },
        {
            "native": "Honduras"
        },
        {
            "native": "Hrvatska"
        },
        {
            "native": "Haïti"
        },
        {
            "native": "Magyarország"
        },
        {
            "native": "Indonesia"
        },
        {
            "native": "Éire"
        },
        {
            "native": "יִשְׂרָאֵל"
        },
        {
            "native": "Isle of Man"
        },
        {
            "native": "भारत"
        },
        {
            "native": "British Indian Ocean Territory"
        },
        {
            "native": "العراق"
        },
        {
            "native": "ایران"
        },
        {
            "native": "Ísland"
        },
        {
            "native": "Italia"
        },
        {
            "native": "Jersey"
        },
        {
            "native": "Jamaica"
        },
        {
            "native": "الأردن"
        },
        {
            "native": "日本"
        },
        {
            "native": "Kenya"
        },
        {
            "native": "Кыргызстан"
        },
        {
            "native": "Kâmpŭchéa"
        },
        {
            "native": "Kiribati"
        },
        {
            "native": "Komori"
        },
        {
            "native": "Saint Kitts and Nevis"
        },
        {
            "native": "북한"
        },
        {
            "native": "대한민국"
        },
        {
            "native": "الكويت"
        },
        {
            "native": "Cayman Islands"
        },
        {
            "native": "Қазақстан"
        },
        {
            "native": "ສປປລາວ"
        },
        {
            "native": "لبنان"
        },
        {
            "native": "Saint Lucia"
        },
        {
            "native": "Liechtenstein"
        },
        {
            "native": "śrī laṃkāva"
        },
        {
            "native": "Liberia"
        },
        {
            "native": "Lesotho"
        },
        {
            "native": "Lietuva"
        },
        {
            "native": "Luxembourg"
        },
        {
            "native": "Latvija"
        },
        {
            "native": "‏ليبيا"
        },
        {
            "native": "المغرب"
        },
        {
            "native": "Monaco"
        },
        {
            "native": "Moldova"
        },
        {
            "native": "Црна Гора"
        },
        {
            "native": "Saint-Martin"
        },
        {
            "native": "Madagasikara"
        },
        {
            "native": "M̧ajeļ"
        },
        {
            "native": "Северна Македонија"
        },
        {
            "native": "Mali"
        },
        {
            "native": "မြန်မာ"
        },
        {
            "native": "Монгол улс"
        },
        {
            "native": "澳門"
        },
        {
            "native": "Northern Mariana Islands"
        },
        {
            "native": "Martinique"
        },
        {
            "native": "موريتانيا"
        },
        {
            "native": "Montserrat"
        },
        {
            "native": "Malta"
        },
        {
            "native": "Maurice"
        },
        {
            "native": "Maldives"
        },
        {
            "native": "Malawi"
        },
        {
            "native": "México"
        },
        {
            "native": "Malaysia"
        },
        {
            "native": "Moçambique"
        },
        {
            "native": "Namibia"
        },
        {
            "native": "Nouvelle-Calédonie"
        },
        {
            "native": "Niger"
        },
        {
            "native": "Norfolk Island"
        },
        {
            "native": "Nigeria"
        },
        {
            "native": "Nicaragua"
        },
        {
            "native": "Nederland"
        },
        {
            "native": "Norge"
        },
        {
            "native": "नपल"
        },
        {
            "native": "Nauru"
        },
        {
            "native": "Niuē"
        },
        {
            "native": "New Zealand"
        },
        {
            "native": "عمان"
        },
        {
            "native": "Panamá"
        },
        {
            "native": "Perú"
        },
        {
            "native": "Polynésie française"
        },
        {
            "native": "Papua Niugini"
        },
        {
            "native": "Pilipinas"
        },
        {
            "native": "Pakistan"
        },
        {
            "native": "Polska"
        },
        {
            "native": "Saint-Pierre-et-Miquelon"
        },
        {
            "native": "Pitcairn Islands"
        },
        {
            "native": "Puerto Rico"
        },
        {
            "native": "فلسطين"
        },
        {
            "native": "Portugal"
        },
        {
            "native": "Palau"
        },
        {
            "native": "Paraguay"
        },
        {
            "native": "قطر"
        },
        {
            "native": "La Réunion"
        },
        {
            "native": "România"
        },
        {
            "native": "Србија"
        },
        {
            "native": "Россия"
        },
        {
            "native": "Rwanda"
        },
        {
            "native": "العربية السعودية"
        },
        {
            "native": "Solomon Islands"
        },
        {
            "native": "Seychelles"
        },
        {
            "native": "السودان"
        },
        {
            "native": "Sverige"
        },
        {
            "native": "Singapore"
        },
        {
            "native": "Saint Helena"
        },
        {
            "native": "Slovenija"
        },
        {
            "native": "Svalbard og Jan Mayen"
        },
        {
            "native": "Slovensko"
        },
        {
            "native": "Sierra Leone"
        },
        {
            "native": "San Marino"
        },
        {
            "native": "Sénégal"
        },
        {
            "native": "Soomaaliya"
        },
        {
            "native": "Suriname"
        },
        {
            "native": "South Sudan"
        },
        {
            "native": "São Tomé e Príncipe"
        },
        {
            "native": "El Salvador"
        },
        {
            "native": "Sint Maarten"
        },
        {
            "native": "سوريا"
        },
        {
            "native": "Swaziland"
        },
        {
            "native": "Turks and Caicos Islands"
        },
        {
            "native": "Tchad"
        },
        {
            "native": "Territoire des Terres australes et antarctiques fr"
        },
        {
            "native": "Togo"
        },
        {
            "native": "ประเทศไทย"
        },
        {
            "native": "Тоҷикистон"
        },
        {
            "native": "Tokelau"
        },
        {
            "native": "Timor-Leste"
        },
        {
            "native": "Türkmenistan"
        },
        {
            "native": "تونس"
        },
        {
            "native": "Tonga"
        },
        {
            "native": "Türkiye"
        },
        {
            "native": "Trinidad and Tobago"
        },
        {
            "native": "Tuvalu"
        },
        {
            "native": "臺灣"
        },
        {
            "native": "Tanzania"
        },
        {
            "native": "Україна"
        },
        {
            "native": "Uganda"
        },
        {
            "native": "United States Minor Outlying Islands"
        },
        {
            "native": "United States"
        },
        {
            "native": "Uruguay"
        },
        {
            "native": "O‘zbekiston"
        },
        {
            "native": "Vaticano"
        },
        {
            "native": "Saint Vincent and the Grenadines"
        },
        {
            "native": "Venezuela"
        },
        {
            "native": "British Virgin Islands"
        },
        {
            "native": "United States Virgin Islands"
        },
        {
            "native": "Việt Nam"
        },
        {
            "native": "Vanuatu"
        },
        {
            "native": "Wallis et Futuna"
        },
        {
            "native": "Samoa"
        },
        {
            "native": "Republika e Kosovës"
        },
        {
            "native": "اليَمَن"
        },
        {
            "native": "Mayotte"
        },
        {
            "native": "South Africa"
        },
        {
            "native": "Zambia"
        },
        {
            "native": "Zimbabwe"
        }
    ])
    console.log(count)
    const handleOke = () => {
        form.submit()
        console.log("Click confirm booking")
    }


    const onFinish = (values) => {
        console.log("[Value hotel]", hotel)
        console.log("[Value rooms]", room)
        console.log("[Value input]", values)
    }
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    )


    return (
        <div >
            <Modal
                open={isShow}
                onCancel={onCancel}
                className='min-w-[80%] max-h-[100px]'
                okText="Confirm Booking"

                onOk={handleOke}
            >
                <h2 className='text-center font-bold'>Booking Detail</h2>
                <Row className='h-[520px] '>
                    <Col span={8} >
                        <Row className='d-flex justify-center items-center'>
                            <Col span={24} className=' mb-[25px] p-[10px] h-[170px] max-w-[90%] border-[1px] border-gray-300 rounded-[10px]'>
                                <p className='text-[15px] mb-[5px]  mt-[2px]' >
                                    Hotel
                                    <span className='ml-[10px]'>
                                        <Rate value={hotel.rate} onHoverChange={() => { }} onFocus={() => { }}></Rate>
                                    </span>
                                </p>
                                <p className='text-[16px] mb-[5px]'>
                                    <b>{hotel.hotelName}</b>
                                </p>
                                <p className='text-[16px] mb-[5px]'>
                                    {hotel.address}
                                </p>
                                <div className='mb-[5px]'>
                                    <span className='mr-[20px]'>
                                        Nation: {hotel.nation}
                                    </span>
                                    <span >
                                        City: {hotel.city}
                                    </span>

                                </div>
                                <p>
                                    Phone: {hotel.phoneNum}
                                </p>

                            </Col>
                            <Col span={24} className='h-[150px] mb-[25px] p-[10px] max-w-[90%] border-[1px] border-gray-300 rounded-[10px]' >
                                <p className='text-[15px] mb-[5px]  mt-[2px]' >
                                    Room for {room.capacity} people

                                </p>
                                <p className='text-[16px] mb-[5px]'>
                                    <b>{room.roomName}</b>
                                </p>

                                <div className='mb-[5px]'>
                                    <span className='mr-[20px]'>
                                        Type of room: {room.typeOfRoom}
                                    </span>
                                    <span>
                                        Beds: {room.numberOfBeds}
                                    </span>
                                </div>
                                <p>
                                    Room price: {room.money} VND
                                </p>

                            </Col>
                            <Col span={24} className='h-[150px] border-[1px] p-[10px] max-w-[90%] border-gray-300 rounded-[10px] mb-[25px]'>
                                <Row className='mb-[5px] max-h-[45px]'>
                                    <Col span={11} className='border-r-[1px] border-y-slate-400 mr-[11px]'>
                                        Check In
                                        <p>
                                           <b> Web,Oct 2, 2024</b>
                                        </p>
                                    </Col>
                                    
                                    <Col span={12} >
                                        Check Out
                                        <p>
                                           <b> Web,Oct 2, 2024</b>
                                        </p>
                                    </Col>
                                </Row>
                                <div className='mb-[5px]'>
                                    {/* You select {count} rooms */}
                                </div>
                                <div className='mb-[5px]'>
                                    <b>Total length of day: </b> {days} days
                                </div>

                                <div className='mb-[5px]'>
                                    {/* <b>Total prices: </b> {room.money * count * days} VND */}
                                </div>
                            </Col>
                        </Row>

                    </Col>
                    <Col span={16} className='border-[1px] p-[10px] h-[520px] border-gray-300 rounded-[10px]'>
                        <h3 className='text-center mt-[18px]  mb-[29px]'>Enter your details</h3>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Form: {
                                        labelColor: "black"
                                    },
                                },
                            }}
                        >
                            <Form
                                onFinish={onFinish}
                                labelCol={{
                                    span: 6
                                }}
                                labelAlign='left'
                                form={form}
                                className='w-[700px] mr-[34px] ml-[28px]'
                            >
                                <FormItem
                                    label="Enter your fullname"
                                    name="fullname"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your fullname !s"
                                        }
                                    ]}
                                >
                                    <Input />
                                </FormItem>
                                <FormItem
                                    label="Enter your email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your email !"
                                        }
                                    ]}
                                >
                                    <Input />
                                </FormItem>
                                <FormItem
                                    label="Enter your address"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your address !"
                                        }
                                    ]}
                                >
                                    <Input />
                                </FormItem>
                                <Form.Item label="Select region">
                                    <Select>
                                        {nations.map((nation, index) => {
                                            return (
                                                <Select.Option key={index}>{nation.native}</Select.Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>

                                <FormItem
                                    label="Enter your numberphone"
                                    name="numberphone"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your numberphone !"
                                        }
                                    ]}
                                >
                                    <Input addonBefore={prefixSelector} type='number' />
                                </FormItem>
                            </Form>
                        </ConfigProvider>

                    </Col>
                </Row>
            </Modal>
        </div>
    )
}

export default BookingConfirmationForm