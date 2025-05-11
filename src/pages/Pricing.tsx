
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CurrencyDollar } from "lucide-react";

const PricingPage = () => {
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
    }
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that works best for you or your team.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          All plans include lifetime access - one-time payment, no subscriptions!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{plan.name}</CardTitle>
                {plan.popular && <Badge className="bg-primary">Popular</Badge>}
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
                    <Check className="h-4 w-4 mr-3 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className={`w-full ${plan.popular ? '' : 'bg-muted-foreground hover:bg-muted-foreground/90'}`}>
                <CurrencyDollar className="h-4 w-4 mr-2" /> {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
