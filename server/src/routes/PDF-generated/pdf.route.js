const express = require('express');
const { Onedoc } = require('@onedoc/client');
const { compile } = require('@onedoc/react-print');
const ListRouter = express.Router();
const onedoc = new Onedoc(process.env.API_ONEDOC_KEY);


ListRouter.post('/generate-pdf', async (req, res) => {
    try {
      const { file, error } = await onedoc.render({
        html:req.body.component,
        test: false,
        save: false,
        assets: [],
      });

      if (error) {
        console.error('Error during PDF generation:', error);
        return res.status(500).json({ error: 'Failed to generate PDF' });
      }
      res.send(Buffer.from(file));
    } catch (err) {
      console.error('Error generating PDF:', err);
      res.status(500).json({ error: 'Error generating PDF' });
    }
  });

  module.exports = ListRouter;