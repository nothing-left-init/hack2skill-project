import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Upload, Wand2, Copy, Check } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface StoryGenerationResponse {
  description: string;
  captions: string[];
}

export default function AiStoryGenerator() {
  const [formData, setFormData] = useState({
    productName: "",
    craftType: "",
    heritage: "",
    artisanId: "artisan-1", // Default to first artisan for demo
  });
  const [generatedStory, setGeneratedStory] = useState<StoryGenerationResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const storyMutation = useMutation({
    mutationFn: (data: typeof formData) => api.generateStory(data),
    onSuccess: (response) => {
      setGeneratedStory(response);
      toast({
        title: "Story Generated!",
        description: "Your AI-powered product story is ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!formData.productName || !formData.craftType) {
      toast({
        title: "Missing Information",
        description: "Please fill in the product name and craft type.",
        variant: "destructive",
      });
      return;
    }
    storyMutation.mutate(formData);
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-accent/10 to-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">Tell Your Story with AI</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Transform your craft photos into compelling stories. Our AI understands the heritage and passion behind each piece, creating authentic descriptions that connect with buyers.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Upload className="text-primary-foreground text-sm h-4 w-4" />
                </div>
                <span className="text-foreground">Upload your craft photos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Wand2 className="text-accent-foreground text-sm h-4 w-4" />
                </div>
                <span className="text-foreground">AI generates your story</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Copy className="text-secondary-foreground text-sm h-4 w-4" />
                </div>
                <span className="text-foreground">Share across platforms</span>
              </div>
            </div>
          </div>

          <Card className="shadow-xl border border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-primary" />
                <span>AI Story Generator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 smooth-transition">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Drop your craft photos here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="productName" className="text-sm font-medium text-foreground">Product Name</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Sunset Ceramic Bowl"
                    value={formData.productName}
                    onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                    className="mt-2"
                    data-testid="input-product-name"
                  />
                </div>

                <div>
                  <Label htmlFor="craftType" className="text-sm font-medium text-foreground">Craft Type</Label>
                  <Select value={formData.craftType} onValueChange={(value) => setFormData(prev => ({ ...prev, craftType: value }))}>
                    <SelectTrigger className="mt-2" data-testid="select-craft-type">
                      <SelectValue placeholder="Select craft type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ceramics">Ceramics & Pottery</SelectItem>
                      <SelectItem value="textiles">Textiles & Weaving</SelectItem>
                      <SelectItem value="woodwork">Woodworking</SelectItem>
                      <SelectItem value="jewelry">Jewelry Making</SelectItem>
                      <SelectItem value="glasswork">Glasswork</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="heritage" className="text-sm font-medium text-foreground">Cultural Heritage</Label>
                  <Input
                    id="heritage"
                    placeholder="e.g., Portuguese ceramics tradition"
                    value={formData.heritage}
                    onChange={(e) => setFormData(prev => ({ ...prev, heritage: e.target.value }))}
                    className="mt-2"
                    data-testid="input-heritage"
                  />
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={storyMutation.isPending}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 smooth-transition"
                  data-testid="button-generate-story"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {storyMutation.isPending ? "Generating..." : "Generate Story & Captions"}
                </Button>
              </div>

              {generatedStory && (
                <div className="space-y-4 mt-6 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Generated Description</Label>
                    <div className="relative mt-2">
                      <Textarea
                        value={generatedStory.description}
                        readOnly
                        className="pr-10"
                        data-testid="textarea-generated-description"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(generatedStory.description, -1)}
                        className="absolute top-2 right-2 h-6 w-6"
                        data-testid="button-copy-description"
                      >
                        {copiedIndex === -1 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground">Social Media Captions</Label>
                    <div className="space-y-2 mt-2">
                      {generatedStory.captions.map((caption, index) => (
                        <div key={index} className="relative">
                          <Textarea
                            value={caption}
                            readOnly
                            className="pr-10"
                            data-testid={`textarea-caption-${index}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(caption, index)}
                            className="absolute top-2 right-2 h-6 w-6"
                            data-testid={`button-copy-caption-${index}`}
                          >
                            {copiedIndex === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
