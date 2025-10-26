import { useEffect } from 'react';
import QRCode from 'qrcode';

export const useQRCode = (linkedinQRRef, githubQRRef, fr_resumeQRRef, en_resumeQRRef, cvData, language) => {
    useEffect(() => {
        const generateQRCode = async (url, canvasRef) => {
            if (canvasRef.current) {
                try {
                    await QRCode.toCanvas(canvasRef.current, url, {
                        width: 80,
                        height: 80,
                        margin: 1,
                        color: {
                            dark: '#000000',
                            light: '#FFFFFF'
                        }
                    });
                } catch (error) {
                    console.error('Error generating QR code:', error);
                }
            }
        };

        // Generate QR codes for all platforms
        generateQRCode(cvData[language].contact.linkedin, linkedinQRRef);
        generateQRCode(cvData[language].contact.github, githubQRRef);
        generateQRCode(cvData[language].contact.fr_resume, fr_resumeQRRef);
        generateQRCode(cvData[language].contact.en_resume, en_resumeQRRef);
    }, [linkedinQRRef, githubQRRef, fr_resumeQRRef, en_resumeQRRef, cvData, language]);
}; 