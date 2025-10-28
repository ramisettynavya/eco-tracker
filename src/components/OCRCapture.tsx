import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const OCRCapture = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const processImage = async () => {
    setIsProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Meter Reading Detected!",
        description: "Reading: 12,345.67 kWh",
      });
    }, 2000);
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl">Scan Meter Reading</CardTitle>
          <CardDescription>Capture your meter using your camera or upload a photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {!image ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="bg-gradient-primary p-8 rounded-full">
                <Camera className="h-16 w-16 text-primary-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">No image captured</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Take a clear photo of your electricity meter display for automatic reading detection
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCapture} className="bg-gradient-primary hover:opacity-90">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
                <Button onClick={handleCapture} variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img 
                  src={image} 
                  alt="Meter reading" 
                  className="w-full h-auto"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <span className="font-medium">Ready to Process</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the button below to extract the meter reading from your image
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={processImage} 
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Process Reading
                    </>
                  )}
                </Button>
                <Button onClick={handleCapture} variant="outline">
                  <Camera className="mr-2 h-4 w-4" />
                  Retake
                </Button>
              </div>
            </div>
          )}

          <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              Tips for Best Results
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Ensure good lighting on the meter display</li>
              <li>Keep the camera steady and focused</li>
              <li>Capture the entire meter display</li>
              <li>Avoid glare or reflections on the screen</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
