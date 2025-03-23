"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, QrCode, RefreshCw, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/toastContext";
import ImageUploader from "./imageUploader";

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("");
  const [downloadSize, setDownloadSize] = useState(300);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logoImage, setLogoImage] = useState("");
  const [logoSize, setLogoSize] = useState(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Set default URL to the current site
  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin;
      setUrl(baseUrl);
    }
  }, []);

  // Calculate logo size as percentage of QR code size
  const getLogoSizePixels = () => {
    return Math.round((logoSize / 100) * downloadSize);
  };

  const handleDownloadPNG = async () => {
    if (!qrRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = downloadSize;
      canvas.height = downloadSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Get the SVG element
      const svgElement = qrRef.current.querySelector("svg");
      if (!svgElement) {
        throw new Error("SVG element not found");
      }

      // Create a data URL from the SVG
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create an image from the SVG
      const img = new Image();

      img.crossOrigin = "anonymous";

      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = svgUrl;
      });

      // Draw the image to the canvas
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, downloadSize, downloadSize);

      // Convert canvas to PNG
      const pngUrl = canvas.toDataURL("image/png");

      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-code-${url}.png`;
      downloadLink.href = pngUrl;
      downloadLink.click();
      // Clean up
      URL.revokeObjectURL(svgUrl);

      toast({
        title: "QR Code Downloaded",
        description: "Your QR code has been downloaded as PNG.",
      });
    } catch (error) {
      console.error("Error downloading PNG:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download QR code as PNG.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSVG = () => {
    if (!qrRef.current) return;

    try {
      const svgElement = qrRef.current.querySelector("svg");
      if (!svgElement) {
        throw new Error("SVG element not found");
      }

      // Clone the SVG to modify it
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;

      // Set the width and height to the download size
      clonedSvg.setAttribute("width", downloadSize.toString());
      clonedSvg.setAttribute("height", downloadSize.toString());

      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `qr-code-${url}.svg`;
      downloadLink.click();

      URL.revokeObjectURL(svgUrl);

      toast({
        title: "QR Code Downloaded",
        description: "Your QR code has been downloaded as SVG.",
      });
    } catch (error) {
      console.error("Error downloading SVG:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download QR code as SVG.",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  };

  // Prepare image settings for QRCodeSVG
  const getImageSettings = () => {
    if (!logoImage) return undefined;

    return {
      src: logoImage,
      height: getLogoSizePixels(),
      width: getLogoSizePixels(),
      excavate: true,
    };
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <Tabs className="mb-4" defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">
                <QrCode />
              </TabsTrigger>
              <TabsTrigger value="logo">
                <ImagePlus />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">آدرس منو</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL for QR code"
                />
              </div>
              <div className="space-y-2">
                <Label>{`ابعاد دانلود: ${downloadSize} پیکسل`}</Label>
                <Slider
                  dir="rtl"
                  value={[downloadSize]}
                  min={100}
                  max={2400}
                  step={50}
                  onValueChange={(value) => setDownloadSize(value[0])}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fgColor">رنگ پیش‌زمینه</Label>
                  <Input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bgColor">رنگ پس‌زمینه</Label>
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logo" className="space-y-4">
              <div className="space-y-2">
                <ImageUploader value={logoImage} onChange={setLogoImage} />
              </div>
              {logoImage && (
                <div className="space-y-2">
                  <Label>Logo Size: {logoSize}%</Label>
                  <Slider
                    dir="rtl"
                    value={[logoSize]}
                    min={10}
                    max={24}
                    step={1}
                    onValueChange={(value) => setLogoSize(value[0])}
                  />
                  <p className="text-xs text-slate-500">
                    Actual size: {getLogoSizePixels()}px × {getLogoSizePixels()}
                    px
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          <Button onClick={generateQRCode} className="bg-amber-500">
            {isGenerating ? (
              <div className="flex flex-row-reverse gap-2 items-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <p dir="rtl">در حال ایجاد...</p>
              </div>
            ) : (
              <div className="flex flex-row-reverse gap-2 items-center">
                <QrCode className="w-4 h-4" />
                <p>ایجاد کد کیوآر</p>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <div
            ref={qrRef}
            className="mb-6 p-4 bg-white rounded-lg shadow-sm border flex items-center justify-center"
            style={{ width: "300px", height: "300px" }}
          >
            <QRCodeSVG
              value={url}
              size={250}
              bgColor={bgColor}
              fgColor={fgColor}
              level="H"
              marginSize={4}
              imageSettings={getImageSettings()}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <Button onClick={handleDownloadPNG} variant="outline">
              <Download className="w-4 h-4" />
              <p dir="rtl">دانلود PNG</p>
            </Button>
            <Button onClick={handleDownloadSVG} variant="outline">
              <Download className="w-4 h-4" />
              <p dir="rtl">دانلود SVG</p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
