
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Info, KeyRound, Rocket, MessageSquareQuote, Palette, Mobile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme"; // Import useTheme

const ImportantPage = () => {
  const { theme } = useTheme(); // Get current theme

  const cardBaseClass = `transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1`;
  const lightCardClass = "bg-white/80 backdrop-blur-md border-slate-200/80";
  const darkCardClass = "bg-slate-800/70 backdrop-blur-md border-slate-700/60";
  const cardClass = theme === 'light' ? `${lightCardClass} ${cardBaseClass}` : `${darkCardClass} ${cardBaseClass}`;
  
  const titleClass = theme === 'light' ? "text-slate-800" : "text-white";
  const descriptionClass = theme === 'light' ? "text-slate-600" : "text-slate-400";
  const contentTextClass = theme === 'light' ? "text-slate-700" : "text-slate-300";

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50' : 'bg-gradient-to-br from-slate-900 via-black to-slate-950'}`}>
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className={`flex items-center gap-2 group ${theme === 'light' ? 'text-slate-700 border-slate-300 hover:bg-amber-100 hover:border-amber-300' : 'text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-500'}`}>
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <header className="text-center mb-12 md:mb-16">
          <Info className={`mx-auto h-16 w-16 mb-4 ${theme === 'light' ? 'text-amber-600' : 'text-primary'}`} />
          <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-4 ${titleClass}`}>
            Important Information
          </h1>
          <p className={`text-lg sm:text-xl ${descriptionClass} max-w-3xl mx-auto`}>
            Key details and guides to help you make the most of our AI-powered platform.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-10">
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-2xl ${titleClass}`}>
                <Rocket className={`h-6 w-6 ${theme === 'light' ? 'text-amber-600' : 'text-primary'}`} />
                How to Use
              </CardTitle>
            </CardHeader>
            <CardContent className={`${contentTextClass}`}>
              <ol className="list-decimal list-inside space-y-3 text-base">
                <li>Clearly describe your project requirements in the chat.</li>
                <li>Our AI will generate the code and show you a live preview.</li>
                <li>Review, test, and request any changes or refinements.</li>
                <li>Once satisfied, you can deploy your project.</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-2xl ${titleClass}`}>
                <KeyRound className={`h-6 w-6 ${theme === 'light' ? 'text-amber-600' : 'text-primary'}`} />
                Getting Your Gemini API Key
              </CardTitle>
            </CardHeader>
            <CardContent className={`${contentTextClass}`}>
              <ol className="list-decimal list-inside space-y-3 text-base">
                <li>Navigate to the <a href="https://makersuite.google.com/app/apikey" className={`${theme === 'light' ? 'text-amber-700 hover:text-amber-800' : 'text-primary hover:text-primary/80'} font-medium underline`} target="_blank" rel="noopener noreferrer">Google AI Studio</a>.</li>
                <li>Sign in using your Google account.</li>
                <li>Follow the prompts to create a new API key.</li>
                <li>Copy the generated key and paste it into your account settings on our platform.</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <Card className={`${cardClass} mb-10`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 text-2xl ${titleClass}`}>
              <Palette className={`h-6 w-6 ${theme === 'light' ? 'text-amber-600' : 'text-primary'}`} />
              What We're Working On
            </CardTitle>
          </CardHeader>
          <CardContent className={`${contentTextClass}`}>
            <ul className="space-y-3 text-base">
              {[
                { icon: MessageSquareQuote, text: "Adding a 'Chat Mode' for credit-free conversations." },
                { icon: Rocket, text: "Introducing many new features and capabilities." },
                { icon: Mobile, text: "Enhancing the mobile interface for a better experience." },
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className={`h-2 w-2 rounded-full mt-1.5 mr-3 flex-shrink-0 ${theme === 'light' ? 'bg-amber-500' : 'bg-primary'}`}></div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className={`${theme === 'light' ? 'border-amber-500 bg-amber-50/50' : 'border-primary bg-primary/10'} ${cardBaseClass} text-center`}>
          <CardHeader>
            <CardTitle className={`text-2xl sm:text-3xl font-bold ${titleClass}`}>Advertise With Us</CardTitle>
            <CardDescription className={`${descriptionClass} text-md`}>
              Showcase your service or product to our engaged user base.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`mb-6 text-base ${contentTextClass}`}>
              Interested in featuring your webpage or service here? Reach out to us on Discord to connect with our community and potential customers!
            </p>
            <Button 
              size="lg" 
              className={`w-full max-w-xs mx-auto text-base ${theme === 'light' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'btn-primary'}`} 
              asChild
            >
              <a href="https://discord.gg/hrq9cjXr27" target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                <ExternalLink className="h-5 w-5 mr-2" /> Join Our Discord
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImportantPage;

