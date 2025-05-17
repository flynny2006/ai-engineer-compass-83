
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, DollarSign, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

const PricingPage = () => {
  const { theme } = useTheme();
  
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic features for personal use",
      features: [
        "25 Daily Credits",
        "Private Projects & Access Code"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$5",
      description: "Perfect for individuals and creators",
      features: [
        "800 Monthly Credits (+50 Bonus)",
        "Publish Projects & Access Code",
        "Earlier Access to new Features"
      ],
      buttonText: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Teams",
      price: "$10",
      description: "For teams and organizations",
      features: [
        "2700 Monthly Credits (+200 Bonus)",
        "Publish Projects & Access Code",
        "Earlier Access to new Features",
        "Allow multiple Projects"
      ],
      buttonText: "Choose Teams",
      popular: false
    },
    {
      name: "Big Teams",
      price: "$15",
      description: "Ultimate features for large-scale collaboration",
      features: [
        "Unlimited Credits",
        "Publish Projects & Access Code",
        "Earlier Access to new Features",
        "Free Pro Subscription 1 Month for a Friend",
        "50 fast requests"
      ],
      buttonText: "Choose Big Teams",
      popular: false,
      claimCode: "47772"
    }
  ];

  return (
    <div className={`container mx-auto py-16 px-4 ${theme === 'light' ? 'bg-gray-50' : ''}`}>
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-800">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works best for you or your team.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          All plans include lifetime access - one-time payment, no subscriptions!
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col transform transition-all duration-200 hover:scale-105 ${
              plan.popular 
                ? `${theme === 'light' 
                   ? 'border-violet-500 shadow-lg ring-1 ring-violet-500' 
                   : 'border-primary shadow-lg'}`
                : ''
            }`}
          >
            <CardHeader className={`${plan.popular && theme === 'light' ? 'bg-gradient-to-br from-violet-50 to-purple-100 rounded-t-lg' : ''}`}>
              <div className="flex justify-between items-center">
                <CardTitle>{plan.name}</CardTitle>
                {plan.popular && <Badge className={`${theme === 'light' ? 'bg-violet-500' : 'bg-primary'}`}>Popular</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-2">lifetime</span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className={`h-4 w-4 mr-3 ${theme === 'light' ? 'text-violet-600' : 'text-primary'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? `${theme === 'light' ? 'bg-violet-600 hover:bg-violet-700 text-white' : ''}`
                    : `${theme === 'light' ? 'bg-gray-700 hover:bg-gray-800 text-white' : 'bg-muted-foreground hover:bg-muted-foreground/90 text-white'}`
                }`}
              >
                <DollarSign className="h-4 w-4 mr-2" /> {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
