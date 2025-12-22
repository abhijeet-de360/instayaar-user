import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RunwareService, serviceImagePrompts } from "@/services/runware";

export const ImageGenerator = () => {
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});

  const generateServiceImages = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your Runware API key");
      return;
    }

    setIsGenerating(true);
    const runware = new RunwareService(apiKey);
    const newImages: Record<string, string> = {};

    try {
      for (const [serviceName, prompt] of Object.entries(serviceImagePrompts)) {
        toast.info(`Generating ${serviceName} image...`);
        
        try {
          const result = await runware.generateImage({
            positivePrompt: prompt,
            width: 512,
            height: 512,
            model: "runware:100@1",
            outputFormat: "WEBP"
          });
          
          newImages[serviceName] = result.imageURL;
          toast.success(`${serviceName} image generated!`);
        } catch (error) {
          toast.error(`Failed to generate ${serviceName} image`);
        }
      }

      setGeneratedImages(newImages);
      
      // Show download instructions
      toast.success("All images generated! Right-click each image to save them to your assets folder.");
      
    } catch (error) {
      toast.error("Failed to generate images. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Generate Service Category Images</CardTitle>
          <p className="text-muted-foreground">
            Generate proper images for all service categories using Runware AI.
            Get your API key from <a href="https://runware.ai/" target="_blank" rel="noopener noreferrer" className="text-primary underline">runware.ai</a>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              Runware API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Runware API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <Button 
            onClick={generateServiceImages} 
            disabled={isGenerating || !apiKey.trim()}
            className="w-full"
          >
            {isGenerating ? "Generating Images..." : "Generate All Service Images"}
          </Button>

          {Object.keys(generatedImages).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Generated Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(generatedImages).map(([serviceName, imageUrl]) => (
                  <div key={serviceName} className="space-y-2">
                    <img
                      src={imageUrl}
                      alt={serviceName}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <p className="text-sm font-medium text-center">{serviceName}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = imageUrl;
                        link.download = `service-${serviceName.toLowerCase().replace(/\s+/g, '-')}.webp`;
                        link.click();
                      }}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Next Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Download each image using the buttons above</li>
                  <li>Save them to your src/assets/ folder with the correct names</li>
                  <li>Import them in your HeroSection component</li>
                  <li>The images are optimized for web use (WEBP format, 512x512px)</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};