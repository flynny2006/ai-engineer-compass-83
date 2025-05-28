import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, DollarSign, CheckCircle2, Sparkles, Shield, Zap, Globe, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { BorderTrail } from "@/components/ui/border-trail";

const PricingPage = () => {
  const { theme } = useTheme();
  
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic features for personal use",
      features: [
        "25 Daily Credits",
        "Private Projects & Access Code",
        "Community Support",
        "Basic Templates"
      ],
      buttonText: "Get Started",
      popular: false,
      color: "blue"
    },
    {
      name: "Pro",
      price: "$5",
      description: "Perfect for individuals and creators",
      features: [
        "800 Monthly Credits (+50 Bonus)",
        "Publish Projects & Access Code",
        "Earlier Access to new Features",
        "Priority Support",
        "Advanced Templates"
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
      color: "purple"
    },
    {
      name: "Teams",
      price: "$10",
      description: "For teams and organizations",
      features: [
        "2700 Monthly Credits (+200 Bonus)",
        "Publish Projects & Access Code",
        "Earlier Access to new Features",
        "Allow multiple Projects",
        "Team Collaboration Tools",
        "Advanced Analytics"
      ],
      buttonText: "Choose Teams",
      popular: false,
      color: "green"
    },
    {
      name: "Big Teams",
      price: "$15",
      description: "Ultimate features for large-scale collaboration",
      features: [
        "Unlimited Credits",
        "Publish Projects & Access Code",
        "Earlier Access to new Features",
        "50 fast requests per day",
        "Free Pro Subscription 1 Month for a Friend",
        "24/7 Premium Support",
        "White Label Options"
      ],
      buttonText: "Choose Big Teams",
      popular: false,
      color: "amber"
    }
  ];

  const featureHighlights = [
    { 
      title: "Unlimited Access", 
      description: "Pay once, access forever. No recurring fees or subscriptions.", 
      icon: <Globe className="w-5 h-5 text-blue-400" />
    },
    { 
      title: "Instant Updates", 
      description: "Get immediate access to all new features and improvements.", 
      icon: <Zap className="w-5 h-5 text-purple-400" /> 
    },
    { 
      title: "Priority Support", 
      description: "Get help when you need it with our dedicated support team.", 
      icon: <Shield className="w-5 h-5 text-green-400" /> 
    },
    { 
      title: "Advanced Features", 
      description: "Access to premium templates and advanced AI capabilities.", 
      icon: <Sparkles className="w-5 h-5 text-amber-400" /> 
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'} text-foreground`}>
      <div className="container mx-auto py-16 px-4">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white border-none">
            AI-Powered Development
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-600 to-pink-500">
            Choose the perfect plan for your needs
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Get started with our powerful AI-driven development platform. Choose a plan that scales with your project needs.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {featureHighlights.map((feature, i) => (
            <div key={i} className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-black/40 border border-white/10' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-base font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan) => {
            const isPopular = plan.popular;
            
            return (
              <div key={plan.name} className="relative">
                {isPopular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <BorderTrail 
                  className="rounded-xl h-full"
                  variant={isPopular ? "primary" : "default"}
                  duration={isPopular ? "slow" : "default"}
                  spacing="sm"
                >
                  <div className={`h-full flex flex-col p-6 rounded-xl ${theme === 'dark' ? 'bg-black/60 backdrop-blur-lg' : 'bg-white'} ${isPopular ? 'shadow-xl shadow-primary/20' : 'shadow-lg'}`}>
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          lifetime
                        </span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${
                        isPopular 
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white'
                          : ''
                      }`}
                    >
                      <DollarSign className="h-4 w-4 mr-2" /> {plan.buttonText}
                    </Button>
                  </div>
                </BorderTrail>
              </div>
            );
          })}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium mb-2">What's included in each plan?</h3>
              <p className="text-muted-foreground">Each plan includes different credit limits, access to features, and support levels. Higher plans offer more credits and premium features.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll only pay the difference.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium mb-2">What happens when I run out of credits?</h3>
              <p className="text-muted-foreground">Free plan users will need to wait until credits refresh. Paid plans can purchase additional credits or upgrade to a higher plan.</p>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mt-24 mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">What Our Users Say</h2>
          
          <div className="relative max-w-2xl mx-auto mb-8">
            <BorderTrail className="rounded-xl" variant={theme === 'dark' ? 'primary' : 'default'} duration="slow" spacing="sm">
              <div className={`${theme === 'dark' ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-white border border-slate-200 shadow-lg'} p-8 rounded-xl`}>
                <div className="text-center">
                  <div className="flex justify-center items-center mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>Piotr</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'} text-lg leading-relaxed mb-6`}>
                    "This is the best AI website generator I ever used. It's super simple and easy to use. I recommend!"
                  </p>
                </div>
              </div>
            </BorderTrail>
            
            {/* Navigation arrows */}
            <div className="flex justify-between items-center mt-6">
              <Button 
                variant="ghost" 
                size="icon"
                disabled
                className={`${theme === 'dark' ? 'text-white/30' : 'text-slate-300'} cursor-not-allowed`}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex gap-2">
                <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-slate-900'}`}></div>
                <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-white/20' : 'bg-slate-300'}`}></div>
                <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-white/20' : 'bg-slate-300'}`}></div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                disabled
                className={`${theme === 'dark' ? 'text-white/30' : 'text-slate-300'} cursor-not-allowed`}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
