
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ImportantPage = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Important Information</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know to get the most out of our platform
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3">
              <li>Describe your project requirements in the chat</li>
              <li>Our AI will generate the code and show you the preview</li>
              <li>Review, test, and request changes as needed</li>
              <li>Deploy your project when you're satisfied</li>
            </ol>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How to Get Gemini API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3">
              <li>Go to the <a href="https://makersuite.google.com/app/apikey" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
              <li>Sign in with your Google account</li>
              <li>Create a new API key</li>
              <li>Copy and paste the key in your account settings</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What We Are Working On:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Adding Chat Mode to chat without using any Credits!</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Adding much features.</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Adding a better Mobile Interface</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Advertise with Us</CardTitle>
          <CardDescription>Get your website in front of our users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Want to Advertise your OWN Webpage here? Contact us on Discord, to get much users on your own Webpage!</p>
          <Button className="w-full">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
              Join Our Discord
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportantPage;
