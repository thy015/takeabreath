import React, {useContext, useEffect, useState} from 'react'
import {useDispatch, useSelector}               from "react-redux"
import {FontAwesomeIcon}                        from '@fortawesome/react-fontawesome'
import {faPlus}                                 from '@fortawesome/free-solid-svg-icons'
import {Button, Popconfirm, Table}              from 'antd'
import {useMediaQuery}                          from 'react-responsive'
import {Link}                                   from 'react-router-dom'
import FormCard                                 from '../../../component/FormCard'
import dayjs                                    from 'dayjs'
import axios                                    from 'axios'
import {setCards}                               from '../../../hooks/redux/ownerSlice'
import {openNotification}                       from '../../../hooks/notification'
import {AuthContext}                            from "../../../hooks/auth.context";

function Card () {
    const dispatch = useDispatch ()
    const {auth} = useContext (AuthContext)
    const id = auth?.user?.id
    const [visible, setVisible] = useState (false)
    const [wowoCardsData, setWowoCardsData] = useState ([])
    const cards = useSelector (state => state.owner.cards)
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
            title: 'Hành động',
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
            title: 'Số dư',
            dataIndex: 'cardWoWoBalance',
            key: 'cardWoWoBalance',
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
            <Table columns={wowoColumns} dataSource={wowoCardsData} scroll={{x: "max-content"}}></Table>
            <FormCard visible={visible} close={() => setVisible (false)}></FormCard>

            {/*    oggy card*/}
            <div>Oggy Card</div>
            <Button onClick={handleOggyCard}>Add New Card</Button>
            <Button onClick={handleOggyCard}>Your Cards</Button>
        </div>
    )
}

export default Card