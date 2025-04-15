require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const keys = require('./cred.json'); // Service account JSON

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

// 📄 ENV variables
const SHEET_ID = process.env.SHEET_ID;
const SHEET_ID1 = process.env.SHEET_ID1;
const SHEET_NAME = process.env.SHEET_NAME;
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID; // Add this to your .env

// 🔐 Google Auth Setup
const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

// 🔄 Sheets API
app.get('/sheet-data', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:Z1000`,
  });

  res.json(response.data);
});

app.post('/append', async (req, res) => {
  const { values } = req.body;
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [values] },
  });

  res.send('Data appended successfully');
});

app.get('/sheet-data1', async (req, res) => {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
  
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID1,
      range: `${SHEET_NAME}!A1:Z1000`,
    });
  
    res.json(response.data);
  });
  
  app.post('/append1', async (req, res) => {
    const { values } = req.body;
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
  
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID1,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });
  
    res.send('Data appended successfully');
  });

// 📤 Upload PDF to Google Drive
app.post('/upload-pdf', upload.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const { name } = req.body;

  const client = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: client });

  const fileMetadata = {
    name: name || originalname,
    parents: [DRIVE_FOLDER_ID],
  };

  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(path),
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name',
    });

    fs.unlinkSync(path); // Cleanup temp
    res.json({ success: true, fileId: file.data.id, name: file.data.name });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to upload PDF');
  }
});

// 📥 Download PDF by name
app.get('/get-pdf/:name', async (req, res) => {
    const { name } = req.params;
  
    try {
      const client = await auth.getClient();
      const drive = google.drive({ version: 'v3', auth: client });
  
      const list = await drive.files.list({
        q: `name='${name}' and '${DRIVE_FOLDER_ID}' in parents and mimeType='application/pdf' and trashed=false`,
        fields: 'files(id, name)',
      });
  
      if (list.data.files.length === 0) {
        return res.status(404).send('File not found');
      }
  
      const fileId = list.data.files[0].id;
  
      const driveStream = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
  
      driveStream.data.pipe(res);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error downloading file');
    }
  });

  // ✏️ Edit MOU Details
app.post('/update-mou', async (req, res) => {
  const { rowIndex, updatedData } = req.body;
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    // Convert the updatedData object to an array in the correct column order
    const values = [
      updatedData.instituteName,
      updatedData.startDate,
      updatedData.endDate,
      updatedData.signedBy,
      updatedData.facultyDetails,
      updatedData.academicYear,
      updatedData.purpose,
      updatedData.outcomes,
      updatedData.agreementFileId,
      updatedData.fileName,
      updatedData.createdBy,
      updatedData.createdAt
    ];

    // The range needs to point to the specific row (A2, A3, etc.)
    const range = `${SHEET_NAME}!A${rowIndex + 1}:L${rowIndex + 1}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID1,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });

    res.send('MOU updated successfully');
  } catch (error) {
    console.error('Error updating MOU:', error);
    res.status(500).send('Error updating MOU');
  }
});

// ✏️ Edit User Details
app.post('/update-user', async (req, res) => {
  const { rowIndex, updatedData } = req.body;
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    // Convert the updatedData object to an array in the correct column order
    const values = [
      updatedData.name,
      updatedData.email,
      updatedData.role,
      updatedData.department,
      updatedData.status,
      updatedData.lastLogin
    ];

    // The range needs to point to the specific row (A2, A3, etc.)
    const range = `${SHEET_NAME}!A${rowIndex + 1}:F${rowIndex + 1}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });

    res.send('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
});

// 🔍 Get MOU by row index
app.get('/get-mou/:rowIndex', async (req, res) => {
  const { rowIndex } = req.params;
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID1,
      range: `${SHEET_NAME}!A${rowIndex}:L${rowIndex}`,
    });

    if (!response.data.values || response.data.values.length === 0) {
      return res.status(404).send('MOU not found');
    }

    const mouData = response.data.values[0];
    const mouObject = {
      instituteName: mouData[0] || '',
      startDate: mouData[1] || '',
      endDate: mouData[2] || '',
      signedBy: mouData[3] || '',
      facultyDetails: mouData[4] || '',
      academicYear: mouData[5] || '',
      purpose: mouData[6] || '',
      outcomes: mouData[7] || '',
      agreementFileId: mouData[8] || '',
      fileName: mouData[9] || '',
      createdBy: mouData[10] || '',
      createdAt: mouData[11] || ''
    };

    res.json(mouObject);
  } catch (error) {
    console.error('Error fetching MOU:', error);
    res.status(500).send('Error fetching MOU');
  }
});

// 🔍 Get User by row index
app.get('/get-user/:rowIndex', async (req, res) => {
  const { rowIndex } = req.params;
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex}:F${rowIndex}`,
    });

    if (!response.data.values || response.data.values.length === 0) {
      return res.status(404).send('User not found');
    }

    const userData = response.data.values[0];
    const userObject = {
      name: userData[0] || '',
      email: userData[1] || '',
      role: userData[2] || '',
      department: userData[3] || '',
      status: userData[4] || '',
      lastLogin: userData[5] || ''
    };

    res.json(userObject);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Error fetching user');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
