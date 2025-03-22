"use client"

import { useState, useRef, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/toastContext"

// QR Code eye shape options
// const eyeShapes = [
//   { value: "square", label: "Square" },
//   { value: "circle", label: "Circle" },
// ]

// QR Code shape options
// const shapeOptions = [
//   { value: "square", label: "Square" },
//   { value: "rounded", label: "Rounded" },
// ]

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("")
  const [downloadSize, setDownloadSize] = useState(300)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")
//   const [eyeShape, setEyeShape] = useState("square")
//   const [qrShape, setQrShape] = useState("square")
  const [isGenerating, setIsGenerating] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Set default URL to the current site
  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin
      setUrl(baseUrl)
    }
  }, [])

  const handleDownloadPNG = async () => {
    if (!qrRef.current) return

    try {
      
      const canvas = document.createElement("canvas")
      canvas.width = downloadSize
      canvas.height = downloadSize
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Could not get canvas context")
      }

      // Get the SVG element
      const svgElement = qrRef.current.querySelector("svg")
      if (!svgElement) {
        throw new Error("SVG element not found")
      }

      // Create a data URL from the SVG
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      // Create an image from the SVG
      const img = new Image()

      img.crossOrigin = "anonymous"

      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = svgUrl
      })

      // Draw the image to the canvas
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, downloadSize, downloadSize)

      // Convert canvas to PNG
      const pngUrl = canvas.toDataURL("image/png")
      

        // Create download link
        const downloadLink = document.createElement("a")
        downloadLink.download = `qr-code-${new Date().getTime()}.png`
        downloadLink.href = pngUrl
        downloadLink.click()
        // Clean up
      URL.revokeObjectURL(svgUrl)

        toast({
          title: "QR Code Downloaded",
          description: "Your QR code has been downloaded as PNG.",
        })
      

  
    } catch (error) {
      console.error("Error downloading PNG:", error)
      toast({
        title: "Download Failed",
        description: "Failed to download QR code as PNG.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadSVG = () => {
    if (!qrRef.current) return

    try {
        const svgElement = qrRef.current.querySelector("svg")
        if (!svgElement) {
          throw new Error("SVG element not found")
        }
  
        // Clone the SVG to modify it
        const clonedSvg = svgElement.cloneNode(true) as SVGElement
  
        // Set the width and height to the download size
        clonedSvg.setAttribute("width", downloadSize.toString())
        clonedSvg.setAttribute("height", downloadSize.toString())
  
        const svgData = new XMLSerializer().serializeToString(clonedSvg)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      const downloadLink = document.createElement("a")
      downloadLink.href = svgUrl
      downloadLink.download = `qr-code-${new Date().getTime()}.svg`
      downloadLink.click()

      URL.revokeObjectURL(svgUrl)

      toast({
        title: "QR Code Downloaded",
        description: "Your QR code has been downloaded as SVG.",
      })
    } catch (error) {
      console.error("Error downloading SVG:", error)
      toast({
        title: "Download Failed",
        description: "Failed to download QR code as SVG.",
        variant: "destructive",
      })
    }
  }

  const generateQRCode = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 500)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Menu URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL for QR code"
              />
            </div>

            <div className="space-y-2">
            <Label>Download Size: {downloadSize}px</Label>
              <Slider
                value={[downloadSize]}
                min={100}
                max={1000}
                step={50}
                onValueChange={(value) => setDownloadSize(value[0])}
              />
              <p className="text-xs text-slate-500">This only affects the downloaded file size, not the preview.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fgColor">Foreground Color</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 border rounded" style={{ backgroundColor: fgColor }} />
                  <Input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 border rounded" style={{ backgroundColor: bgColor }} />
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eyeShape">Eye Shape</Label>
                <Select value={eyeShape} onValueChange={setEyeShape}>
                  <SelectTrigger id="eyeShape">
                    <SelectValue placeholder="Select eye shape" />
                  </SelectTrigger>
                  <SelectContent>
                    {eyeShapes.map((shape) => (
                      <SelectItem key={shape.value} value={shape.value}>
                        {shape.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qrShape">QR Shape</Label>
                <Select value={qrShape} onValueChange={setQrShape}>
                  <SelectTrigger id="qrShape">
                    <SelectValue placeholder="Select QR shape" />
                  </SelectTrigger>
                  <SelectContent>
                    {shapeOptions.map((shape) => (
                      <SelectItem key={shape.value} value={shape.value}>
                        {shape.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div> */}

            <Button onClick={generateQRCode} className="w-full">
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate QR Code"
              )}
            </Button>
          </div>
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
              value={url || "https://example.com"}
              size={250}
              bgColor={bgColor}
              fgColor={fgColor}
              level="H"
              marginSize={4}
              imageSettings={undefined}
            //   eyeRadius={eyeShape === "circle" ? 10 : 0}
            //   qrStyle={qrShape === "rounded" ? "dots" : "squares"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <Button onClick={handleDownloadPNG} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
            <Button onClick={handleDownloadSVG} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download SVG
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

