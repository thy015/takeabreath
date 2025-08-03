import React, {useEffect, useState} from "react";
import {
  Button,
  Typography,
  Modal,
  Input,
  InputNumber,
  Form,
  Popconfirm,
  Space,
} from "antd";
import {useMediaQuery} from "react-responsive";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {useToastNotifications} from "@/hooks/useToastNotification";
import PropTypes from "prop-types";
import TableVoucher from "@/components/TableVoucher";
import {Plus} from "lucide-react";

function Vouchers () {
  const toast = useToastNotifications ();
  const navigate = useNavigate ();
  axios.defaults.withCredentials = true;
  const [form] = Form.useForm ();
  const [editKey, setEditKey] = useState ("");
  const [listVoucher, setListVoucher] = useState ([]);
  const isMobile = useMediaQuery ({query: "(max-width: 640px)"});
  const BE_PORT = import.meta.env.VITE_BE_PORT;
  const isEditing = (record) => record.key === editKey;
  //get vouchers in db
  useEffect (() => {
    axios.get (`${BE_PORT}/api/voucher/list-voucher`).then ((res) => res.data).then ((data) => {
      const dataList = data.listVoucher.map ((voucher, index) => {
        const startDay = new Date (voucher.startDay);
        const endDay = new Date (voucher.endDay);
        return {
          ...voucher,
          key: index,
          startDay: moment (
            startDay.toLocaleString ("vi-VN").split (" ")[1],
            "DD/MM/YYYY"
          ).format ("YYYY/MM/DD"),
          endDay: moment (
            endDay.toLocaleString ("vi-VN").split (" ")[1],
            "DD/MM/YYYY"
          ).format ("YYYY/MM/DD"),
        };
      });
      setListVoucher (dataList);
    }).catch ((err) => {
      toast.show (false, err.response.data.message, "");
      navigate ("/");
    });
  }, [editKey]);

  //Set each cell in the table to update
  const EditTableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    children,
    ...restProps
  }) => {
    EditTableCell.propTypes = {
      editing: PropTypes.bool,
      dataIndex: PropTypes.string,
      title: PropTypes.string,
      inputType: PropTypes.string,
      children: PropTypes.node,
    };
    const inputNode = () => {
      switch (inputType) {
        case "number":
          return <InputNumber/>;
        case "date":
          return (
            <input
              type="date"
              id="inputDate"
              className=" outline-none border-[1px] border-[#d9d9d9] max-w-[120px] px-[5px] py-[2px] rounded-[5px] hover:cursor-pointer mr-[2px] focus:border-[#4096ff] "
            />
          );
        default:
          return <Input/>;
      }
    };

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode ()}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  // function set type input
  const typeInput = (dataIndex) => {
    switch (dataIndex) {
      case "discount":
        return "number";
      case "startDay":
        return "date";
      case "endDay":
        return "date";
      default:
        return "text";
    }
  };

  // function delete voucher
  const handleDelete = (record) => {
    Modal.confirm ({
      title: "Are you sure, you want to delete this",
      onOk: () => {
        console.log ("[OKE DELETE]", record);
        axios.delete (`${BE_PORT}/api/voucher/list-voucher/${record._id}`).then ((res) => res.data).then ((data) => {
          console.log (data);
          if (data.status) {
            setListVoucher (
              listVoucher.filter ((voucher) => voucher._id !== record._id)
            );
            toast.showError (data.message);
          }
        }).catch ((err) => {
          toast.showError (err.response.message || "Delete voucher failed");
        });
      },
    });
  };

  const cancel = () => {
    setEditKey ("");
  };

  // function edit record in table
  const openEdit = (record) => {
    console.log ("Update");
    form.setFieldsValue ({
      code: "",
      voucherName: "",
      discount: "",
      startDay: "",
      endDay: "",
      ...record,
    });

    setEditKey (record.key);
  };

  // save update record
  const save = async (key, id) => {
    try {
      const row = form.validateFields ();

      row.then ((value) => {
        console.log (value);
        const startDay = new Date (value.startDay);
        const endDay = new Date (value.endDay);

        if (value.discount > 50) {
          toast.showError ("Discount must no more than 50% ");
          return;
        }

        if (startDay.getMonth () > endDay.getMonth ()) {
          toast.showError (
            "Month of end day must be greater than month of start day "
          );
          return;
        }

        if (
          startDay.getMonth () == endDay.getMonth () &&
          endDay.getDate () - startDay.getDate () < 2
        ) {
          toast.showError (
            false,

            "Voucher must be valid for at least 2 days !"
          );
          return;
        }

        axios.post (`${BE_PORT}/api/voucher/list-voucher/update/${id}`, {
          value,
        }).then ((res) => res.data).then ((data) => {
          if (data.status) {
            toast.showSuccess (data.message);
            const newData = [...listVoucher];
            const index = newData.findIndex ((item) => item.key === key);
            console.log (index);
            if (index > -1) {
              const item = newData[index];
              newData.splice (index, 1, {
                ...item,
                ...value,
              });
              setListVoucher (newData);
              setEditKey ("");
            }
          }
        }).catch ((err) => {
          toast.showError (
            err.response.data.message || "Update voucher failed"
          );
        });
      });
    } catch (err) {
      console.log (err);
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      edit: false,
    },
    {
      title: "Name Voucher",
      dataIndex: "voucherName",
      edit: true,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      sorter: {
        compare: (a, b) => a.discount - b.discount,
        multiple: 3,
      },
      edit: true,
    },
    {
      title: "Start Day",
      dataIndex: "startDay",
      edit: true,
    },
    {
      title: "End Day",
      dataIndex: "endDay",
      edit: true,
    },
    {
      title: "Action",
      width: 200,
      fixed: isMobile ? "" : "right",
      render: (_, record) => {
        const editable = isEditing (record);
        // if editable return save and cance else return update and delete
        return editable ? (
          <Space>
            <Typography.Link onClick={() => save (record.key, record._id)}>
              <p>Save</p>
            </Typography.Link>
            <Typography.Link>
              <Popconfirm title="Sure to cancel" onConfirm={cancel}>
                <p>Cancel</p>
              </Popconfirm>
            </Typography.Link>
          </Space>
        ) : (
          //code if editable === false
          <Space>
            <Typography.Link onClick={() => openEdit (record)}>
              Update
            </Typography.Link>
            <Typography.Link onClick={() => handleDelete (record)}>
              Delete
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  //merge columns
  const mergeColomns = columns.map ((col) => {
    if (!col.edit) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: typeInput (col.dataIndex),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing (record),
      }),
    };
  });

  return (
    <div className="h-full ">
      <div className="max-w-[170px] text-left p-[20px]">
        <Link to="/owner/new-voucher">
          <Button type="primary" icon={<Plus size={24}/>} className='h-10'>
            Add voucher
          </Button>
        </Link>
      </div>
      <Form form={form} component={false}>
        <TableVoucher
          component={{
            body: {
              cell: EditTableCell,
            },
          }}
          data={listVoucher}
          columns={mergeColomns}
        />
      </Form>
    </div>
  );
}

export default Vouchers;
