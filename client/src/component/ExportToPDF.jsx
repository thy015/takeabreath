import React from 'react';
import axios from 'axios';
import { QRInvoice } from './InvoicePDF'; 
import { compile } from '@onedoc/react-print';
import { notification} from "antd";
const GeneratePDFButton = ({invoice}) => {
  const BE_PORT = import.meta.env.VITE_BE_PORT; 

  const handleGeneratePDF = async () => {
    try {
      const html = await compile(<QRInvoice invoice={invoice} />);
      const response = await axios.post(
        `${BE_PORT}/api/pdf/generate-pdf`, 
        { component: html },
        { responseType: 'arraybuffer' } 
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'HoaDon.pdf';
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
      notification.success({ description: 'Lỗi trong quá trình generate pdf bri!' });
    }
  };

  return (
    <button onClick={handleGeneratePDF} className='border-2 rounded-lg p-1.5 bg-[#003580] hover:bg-blue-500 text-white'>Xuất Hóa Đơn</button>
  );
};

export default GeneratePDFButton;
