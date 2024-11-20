import React from 'react';
import { Onedoc } from '@onedoc/client';
import { compile } from '@onedoc/react-print';
import { notification, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { QRInvoice } from './InvoicePDF';
import ReactDOMServer,{ renderToString } from 'react-dom/server';
const GeneratePDFButton = ({ invoice }) => {
  const handleGeneratePDF = async () => {
    try {
      const onedoc = new Onedoc("3ed141d5-96a3-416b-9a7b-2d93d97805e2");
      const html = await compile(<QRInvoice invoice={invoice} />);

      const { file, error } = await onedoc.render({
        html,
        test: false,
        save: false,
        assets: [],
      });

      if (error) {
        notification.error({ description: 'Failed to generate PDF' });
        return;
      }

      const blob = new Blob([file], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Invoice-${invoice._id.slice(-6)}.pdf`;
      link.click();

    } catch (error) {
      console.error('Error generating PDF:', error);
      notification.error({ description: 'Error in PDF generation process' });
    }
  };

  return (
    <Button 
      onClick={handleGeneratePDF} 
      icon={<DownloadOutlined/>} 
      className='border-2 rounded-lg p-1.5 hover:bg-blue-500 text-blue-800'
    />
  );
};

export default GeneratePDFButton;