import React, {useContext, useEffect, useState} from 'react'
import {useDispatch, useSelector}               from "react-redux"
import {FontAwesomeIcon}                        from '@fortawesome/react-fontawesome'
import {faPlus}                                        from '@fortawesome/free-solid-svg-icons'
import {Button, Form, Input, Modal, Popconfirm, Table} from 'antd'
import {useMediaQuery}                                 from 'react-responsive'
import {Link}                                   from 'react-router-dom'
import FormCard                                 from '../../../component/FormCard'
import dayjs                                    from 'dayjs'
import axios                                    from 'axios'
import {setCards}                               from '../../../hooks/redux/ownerSlice'
import {openNotification}                       from '../../../hooks/notification'
import {AuthContext} from "../../../hooks/auth.context";
import {setWoWoDetail}    from "../../../hooks/redux/ownerSlice";
function Card () {
    const dispatch = useDispatch ()
    const {auth} = useContext (AuthContext)
    const id = auth?.user?.id
    const [visible, setVisible] = useState (false)
    const [wowoCardsData, setWowoCardsData] = useState ([])
    const [isWoWoCardDetailPopUp, setIsWoWoCardDetailPopUp] = useState (false)
    const [isWoWoTransferMoneyPopUp, setWoWoTransferMoneyPopUp] = useState (false)
    const [formData, setFormData] = useState({
        cardWoWoID: "",
        amount: "",
    });
    const cards = useSelector (state => state.owner.cards)

    const {wowoCardDetail}=useSelector(state => state.owner)

    useMediaQuery ({query: '(max-width: 640px)'});
    const BE_PORT = import.meta.env.VITE_BE_PORT
    useEffect (() => {
        axios.get (`${BE_PORT}/api/auth/list-card`)
             .then (res => res.data)
             .then (data => {
                 const cards = data.cards.map ((item) => (
                     {
                         ...item,
                         key: item._id
                     }
                 ))

                 dispatch (setCards (cards))
             })
             .catch (() => {
                 openNotification (false, "Không có thẻ", "")
             })

    }, [])

    const handleDelete = (record) => {
        axios.post (`${BE_PORT}/api/auth/delete-card`, {numberCard: record.cardNumber})
             .then (res => res.data)
             .then (data => {
                 openNotification (true, "Gỡ thẻ thành công", "")
                 const cards = data.cards.map ((item) => (
                     {
                         ...item,
                         key: item._id
                     }
                 ))

                 dispatch (setCards (cards))
             })
             .catch (() => {
                 openNotification (false, "Gỡ thẻ không thành công")
             })
    }
    // wowo wallet
    useEffect (() => {
        const fetchData = async () => {
            try {
                const response = await fetch (`${BE_PORT}/api/wallet/wowoListCard?ownerID=${id}`);
                const result = await response.json ();
                const formattedData = result.cards.map ((card) => ({
                    ...card,
                    key: card._id,
                }));
                console.log ("Formatted data:", formattedData);
                setWowoCardsData (formattedData);
            } catch (err) {
                console.error ("Error fetching WoWo card data:", err);
            }
        };
        fetchData ();
    }, [cards]);

    const handleOggyCard = async () => {
        await axios.post (`${BE_PORT}/api/wallet/createWallet?ownerID=${id}`)
                   .then (res => res.data)
                   .catch (err => console.log (err))
    }
    const handleDeleteWoWoCard = async (record) => {
        try {
            await axios.post (`${BE_PORT}/api/wallet/deleteWoWoCard?ownerID=${id}&cardWoWoID=${record.cardWoWoID}`)
                       .then (res => res.data)
                       .then (() => {
                           openNotification (true, "Gỡ thẻ thành công", "Nếu không thấy thay đổi bạn có thể reset lại trang")
                       })
                       .catch (() => {
                           openNotification (false, "Gỡ thẻ không thành công")
                       })

        } catch (err) {
            console.log (err.message)
        }
    }

    const handleClickDetailWoWoCard = async (record) => {
            const response = await axios.post(`${BE_PORT}/api/wallet/detailWoWoCard?cardWoWoID=${record.cardWoWoID}`);
            dispatch(setWoWoDetail(response.data));
            setIsWoWoCardDetailPopUp((prev) => !prev);
    };

    const handleClickTransferWoWoCard=async(record) => {
            const response = await axios.post(`${BE_PORT}/api/wallet/detailWoWoCard?cardWoWoID=${record.cardWoWoID}`);
            dispatch(setWoWoDetail(response.data));
            setWoWoTransferMoneyPopUp(prev=>!prev)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleTransferFormSubmit=async() => {
        try {
            const {cardWoWoID, amount} = formData
            if (amount > wowoCardDetail?.walletDetails?.balance) {
                return openNotification (false, 'You dont have enough money')
            }
            const response = await axios.post (`${BE_PORT}/api/wallet/transferWoWoMoney?cardWoWoID=${cardWoWoID}&amount=${amount}`);
            if (response.status === 200) {
                openNotification ('Success transfer money');
                setWoWoTransferMoneyPopUp (false)
            } else {
                openNotification (false, 'Unexpected error in cancel money');
                console.log ('response.message', response.message)
            }
        }catch(e){
            openNotification(false, 'Unexpected error in cancel money',e.message);
        }
    }

    const columns = [
        {
            title: 'Loại thẻ',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Số thẻ',
            dataIndex: 'cardNumber',
            key: 'cardNumber',
        },
        {
            title: 'Số CVV',
            dataIndex: 'cardCVV',
            key: 'cardCVV',
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'cardExpiration',
            key: 'cardExpiration',
            render: (text) => dayjs (text).format ("DD/MM/YYYY")
        },
        {
            title: 'Xóa thẻ',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm okText="Xác nhận" cancelText="Trở lại" onConfirm={() => handleDelete (record)}
                            title="Bạn có chắc gỡ thẻ không ?">
                    <Button danger>
                        Gỡ thẻ
                    </Button>
                </Popconfirm>

            )
        },

    ]
    const wowoColumns = [
        {
            title: 'Loại thẻ',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'ID Thẻ WoWo',
            dataIndex: 'cardWoWoID',
            key: 'cardWoWoID',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm okText="Xác nhận" cancelText="Trở lại" onConfirm={() => handleDeleteWoWoCard (record)}
                            title="Bạn có chắc gỡ thẻ không ?">
                    <Button danger>
                        Gỡ thẻ
                    </Button>
                </Popconfirm>
            )
        },
        {
            title: 'Xem thông tin ví',
            dataIndex: 'details',
            key: 'details',
            render: (_, record) => (
                <Button info onClick={() => handleClickDetailWoWoCard(record)}>
                    Xem
                </Button>
            )
        },
        {
            title: 'Chuyển tiền sang ví khác',
            dataIndex: 'details',
            key: 'details',
            render: (_, record) => (
                <Button info onClick={() => handleClickTransferWoWoCard(record)}>
                    Chuyển tiền
                </Button>
            )

        },
    ];

    return (
        <div className='h-full '>
            <div className='max-w-[170px] text-left p-[20px]'>
                <Link>
                    <Button
                        onClick={() => setVisible (true)}
                        type='primary'
                        icon={<FontAwesomeIcon icon={faPlus}/>}
                    >
                        Thêm thẻ
                    </Button>
                </Link>
            </div>
            <Table columns={columns} dataSource={cards} scroll={{x: "max-content"}}></Table>

            <FormCard visible={visible} close={() => setVisible (false)}></FormCard>

            {/*    oggy card*/}
            {isWoWoCardDetailPopUp && (
                <Modal
                    open={isWoWoCardDetailPopUp}
                    onCancel={() => setIsWoWoCardDetailPopUp (false)}
                    footer={null}
                >
                    <h2>WoWo Card Details</h2>
                    <p>Card ID: {wowoCardDetail?.walletDetails?.id}</p>
                    <p>Balance: {wowoCardDetail?.walletDetails?.balance}</p>
                    {/* Add more details as needed */}
                </Modal>
            )}
            {isWoWoTransferMoneyPopUp &&(
                <Modal
                    open={isWoWoTransferMoneyPopUp}
                    onCancel={() => setWoWoTransferMoneyPopUp (false)}
                    footer={null}
                >
                    <h2>Transfer WoWo Money</h2>
                    <Form className='h-40'>
                        <Form.Item name='cardWoWoID' label='To WoWo Card ID'>
                            <Input value={formData.cardWoWoID} onChange={handleInputChange} name="cardWoWoID"></Input>
                        </Form.Item>
                        <Form.Item name='amount' label='Amount To Transfer'>
                            <Input value={formData.amount} onChange={handleInputChange} name="amount"></Input>
                        </Form.Item>
                        <Button className='float-right' onClick={handleTransferFormSubmit}>Transfer</Button>
                    </Form>
                    {/* Add more details as needed */}
                </Modal>
            )}
            <div className='flex justify-between items-center w-full my-4'>
                <div className='ml-4 font-afacad text-[20px]'>Oggy Card</div>
                <Button onClick={handleOggyCard} className='mr-4'>Add New Card</Button>
            </div>
            <Table columns={wowoColumns} dataSource={wowoCardsData} scroll={{x: "max-content"}}></Table>
        </div>
    )
}

export default Card