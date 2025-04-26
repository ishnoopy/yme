"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share, Share2 } from "lucide-react"
import {QRCodeSVG} from "qrcode.react"
import { toast } from "sonner"
import { toPng } from "html-to-image"
import QRCode from 'qrcode'
import { useEffect, useState } from "react"

interface QRCodeCardProps {
  username: string
  messageUserLink: string
}

export function QRCodeCard({ username, messageUserLink }: QRCodeCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(messageUserLink, {
          width: 500,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [messageUserLink]);

  const handleDownloadQRCode = async (link: string) => {
    try {
      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.cssText = `
        position: fixed;
        top: -2000px;
        left: -2000px;
        width: 1080px;
        height: 1920px;
        border: none;
        visibility: hidden;
      `;
      document.body.appendChild(iframe);

      // Create the content inside the iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Failed to create iframe document');

      // Create the card div inside the iframe
      const cardDiv = iframeDoc.createElement('div');
      cardDiv.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #f0f9ff 100%);
        padding: 4rem;
        font-family: system-ui, -apple-system, sans-serif;
      `;

      // Add decorative elements
      const decor1 = iframeDoc.createElement('div');
      decor1.style.cssText = `
        position: absolute;
        top: 20%;
        left: 10%;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
        border-radius: 50%;
      `;

      const decor2 = iframeDoc.createElement('div');
      decor2.style.cssText = `
        position: absolute;
        bottom: 20%;
        right: 10%;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
        border-radius: 50%;
      `;

      // Create content container
      const contentDiv = iframeDoc.createElement('div');
      contentDiv.style.cssText = `
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: 3rem;
      `;

      // Create header
      const headerDiv = iframeDoc.createElement('div');
      headerDiv.style.cssText = `
        text-align: center;
        margin-bottom: 2rem;
      `;

      const title = iframeDoc.createElement('h1');
      title.style.cssText = `
        font-size: 3rem;
        font-weight: 700;
        background: linear-gradient(135deg, #9333ea, #db2777);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 1rem;
      `;
      title.textContent = 'Your QR Code';

      const subtitle = iframeDoc.createElement('p');
      subtitle.style.cssText = `
        font-size: 1.5rem;
        color: #6b7280;
        font-weight: 500;
      `;
      subtitle.textContent = 'Share your QR code to receive anonymous messages';

      // Create QR code container
      const qrContainer = iframeDoc.createElement('div');
      qrContainer.style.cssText = `
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        padding: 3rem;
        border-radius: 2rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      `;

      // Create QR code
      const qrDiv = iframeDoc.createElement('div');
      qrDiv.style.cssText = `
        width: 500px;
        height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 1rem;
        padding: 1rem;
      `;

      // Add QR code image
      const qrImg = iframeDoc.createElement('img');
      qrImg.src = qrDataUrl;
      qrImg.style.width = '100%';
      qrImg.style.height = '100%';
      qrImg.style.objectFit = 'contain';
      qrDiv.appendChild(qrImg);

      // Create username text
      const usernameText = iframeDoc.createElement('p');
      usernameText.style.cssText = `
        font-size: 2rem;
        color: #374151;
        font-weight: 600;
        margin-top: 2rem;
        text-align: center;
      `;
      usernameText.textContent = `@${username}`;

      // Create branding
      const branding = iframeDoc.createElement('div');
      branding.style.cssText = `
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      `;

      const brandText = iframeDoc.createElement('span');
      brandText.style.cssText = `
        font-size: 1.5rem;
        color: #6b7280;
        font-weight: 500;
      `;
      brandText.textContent = 'who-am-i.app';

      // Assemble the card
      headerDiv.appendChild(title);
      headerDiv.appendChild(subtitle);
      qrContainer.appendChild(qrDiv);
      contentDiv.appendChild(headerDiv);
      contentDiv.appendChild(qrContainer);
      contentDiv.appendChild(usernameText);
      branding.appendChild(brandText);
      contentDiv.appendChild(branding);

      cardDiv.appendChild(decor1);
      cardDiv.appendChild(decor2);
      cardDiv.appendChild(contentDiv);

      // Add to iframe document
      iframeDoc.body.appendChild(cardDiv);

      // Convert to image
      const dataUrl = await toPng(cardDiv, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-${username}.png`;
      downloadLink.href = dataUrl;
      downloadLink.click();

      // Clean up
      document.body.removeChild(iframe);

      toast.success("QR Code downloaded!", {
        duration: 2000,
        position: "top-right",
        richColors: true,
      });
    } catch (error) {
      console.error('Error generating QR code image:', error);
      toast.error("Failed to generate QR code image", {
        duration: 2000,
        position: "top-right",
        richColors: true,
      });
    }
  };

  return (
    <Card className="overflow-hidden p-0">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-t-lg">
        <CardTitle>Your QR Code</CardTitle>
        <CardDescription className="text-purple-100">Share your QR code to receive anonymous messages</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-4">
            {/* QR Code with logo in the middle */}
            <div className="relative w-full h-full">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mb-4">
            Scan this QR code to ask @{username}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-50 px-6 py-4 border-t">
        <Button variant="outline" size="sm" className="gap-1" onClick={() => handleDownloadQRCode(messageUserLink)}>
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button size="sm"
          className="gap-1 cursor-pointer 
          bg-gradient-to-r from-purple-600 to-pink-600"
          onClick={() => {
            navigator.clipboard.writeText(messageUserLink);
            toast.success("Link copied to clipboard", {
              duration: 2000,
              position: "top-right",
              richColors: true,
            });
          }}
        >
          <Share2 className="h-4 w-4" />
          Share</Button>
      </CardFooter>
    </Card>
  )
}
