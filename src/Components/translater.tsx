import { AppBar, Divider, IconButton, TextareaAutosize, Toolbar, Typography } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import axios from 'axios';
import html2pdf from 'html2pdf.js'
import { useState } from 'react';
import AppBarWithMenu from './Navbar';
import LoadingScreen from './Loading';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const Translator = () =>{

  const [summary,setSummary] = useState('');
  const [braile,setBraile] = useState('');
  const [loading,setLoading] = useState(false);

  const handleFileInputChange = async (event : any) => {
    const uploadedFile = event.target.files[0];
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

    if (uploadedFile && allowedTypes.includes(uploadedFile.type)) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const response = await axios.post('http://127.0.0.1:8000/summarize/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Use multipart/form-data for file uploads
          },
        });

        if (response.status === 200) {
          const jsonData = response.data;
          setSummary(jsonData.summary_text);
          setBraile(jsonData.braille_text);
          setLoading(false);
        } else {
          console.log('Error:', response.statusText);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    } else {
      alert('Please upload a file with one of the following formats: PDF, DOCX, TXT');
    }
  };

  // Select the textarea element containing the Braille text
  const handleDownload = () => {
    const brailleText = braile; // Extracting the text content of the textarea
  
    // Now you can use the `brailleText` variable for whatever purpose you want,
    // for example, saving it in your state or performing any other operation.
  
    // For demonstration, let's log the extracted text content
    console.log('Braille Text:', brailleText);
  
    // Then, proceed to convert to PDF
    html2pdf().from(brailleText).save();
  };

  const handleSound = async() => {
    console.log("Sound Clicked");
    try {
      const formData = new FormData();
      formData.append('text', summary);

      const response = await axios.post(`http://127.0.0.1:8000/text-to-speech/?text=${summary}`, {
        headers: {
          'Content-Type': 'multipart/form-data', // Use multipart/form-data for file uploads
        },
      });

      if (response.status === 200) {
        console.log("SuccessFull");
      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const triggerFileInput = () => {
    document.getElementById('fileInput')?.click();
  }

  return (
    <div style={{display:'flex',justifyContent:'center' , backgroundImage: `url(../Background.jpg)`, backgroundSize: 'cover',height:'100vh'}}>
        <AppBarWithMenu/>
        {loading && <LoadingScreen/>}
        <div style={{display:'flex' , justifyContent:'center' , marginTop:'100px'}}>
            <div style={{
            display: 'flex',
            justifyContent: 'center',
            border:'2px solid black',
            borderRadius:'20px',
            height: '350px',
            width: '400px',
            position: 'relative',
        }}>
            <div style={{ flex: '1', padding: '10px' }}>
            <div style={{ position: 'relative', width: 'fit-content' }}>
            <Typography fontSize={'18px'} style={{ marginLeft: '35px' }}>English</Typography>
            <Typography fontSize={'12px'} variant="subtitle1" style={{ position: 'absolute', bottom: 2, left: 0 }}>From: </Typography>
        </div>  
        <textarea
         rows={15}
                value={summary}
                style={{
                    resize: 'none',
                    border: 'none',
                    outline: 'none',
                    width: '90%',
                    padding: '10px', // Remove padding
                    backgroundColor: 'transparent', // Set background color to transparent
                    fontSize:'14px'
                }}
                readOnly
            />
            <Divider/>
                <div style={{ position: 'absolute', top: '92%', transform: 'translateY(-50%)', right: '10px', }}>
                  <CloudUploadOutlinedIcon onClick={triggerFileInput} style={{ cursor: 'pointer', margin: '5px' }} />
                    <input
                      id="fileInput"
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileInputChange}
                      style={{ display: 'none' }}
                    />
                    <VolumeUpIcon onClick={handleSound} style={{ cursor: 'pointer', margin: '5px' , marginRight:'20px'}} />
                </div>
            </div>
        </div>
        {/* Add the double-sided icon here */}
        <div style={{ marginTop: '150px' , marginLeft:'20px' }}> {/* Added marginTop to position it between the boxes */}
            <IconButton sx={{ color:'Black' }}> {/* Increased icon size */}
                <SwapHorizIcon fontSize="large"/>
            </IconButton>
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '0', // Remove the margin
            border: '2px solid black',
            borderRadius: '20px',
             height: '350px',
            width: '400px',
            position: 'relative',
            marginLeft:'20px'
        }}>
            <div style={{ flex: '1', padding: '10px' }}>
                <div style={{ position: 'relative', width: 'fit-content' }}>
                    <Typography fontSize={'18px'} style={{ marginLeft: '20px', marginBottom: 0 }}>Braille</Typography>
                    <Typography fontSize={'12px'} variant="subtitle1" style={{ position: 'absolute', bottom: 2, left: 0, marginBottom: 0 }}>To: </Typography>
                </div>
                <textarea
                    id="brailleTextArea"
                    rows={15}
                    value={braile}
                    style={{
                        resize: 'none',
                        border: 'none',
                        outline: 'none',
                        width: '90%',
                        padding: '10px', // Remove padding
                        marginTop: '10px', // Remove margin
                        backgroundColor: 'transparent' // Set background color to transparent
                    }}
                    readOnly
                />
                <Divider />
                <div style={{ position: 'absolute', top: '92%', transform: 'translateY(-50%)', right: '10px', }}>
                    <CloudDownloadOutlinedIcon onClick={handleDownload} style={{ cursor: 'pointer', margin: '5px', marginRight: '20px' }} />
                </div>
            </div>
        </div>
        </div>
    </div>
  );
}

export default Translator;