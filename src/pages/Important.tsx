
import React from "react";
import { Button } from "@/components/ui/button";
import { Code, HeartHandshake, Rocket, Medal, BarChart, PartyPopper, Gift, BookOpen, Github, Discord } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Important = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background z-50 border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Boongle AI</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/">
            <Button variant="outline">Back to Studio</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Important Information</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Key details and resources you should know about Boongle AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-primary" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Join our active community to share your projects, get help, and connect with other developers.
              </p>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open("https://discord.gg/hrq9cjXr27", "_blank")}
              >
                <Discord className="h-4 w-4" />
                Join our Discord
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Get Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Check out our documentation to learn how to make the most of Boongle AI's features.
              </p>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open("https://docs.boongle.ai", "_blank")}
              >
                <BookOpen className="h-4 w-4" />
                Read the Docs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5 text-primary" />
                Open Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Explore our GitHub repositories and contribute to the development of Boongle AI.
              </p>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open("https://github.com/boongle-ai", "_blank")}
              >
                <Github className="h-4 w-4" />
                Visit GitHub
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted p-8 rounded-lg">
          <div className="text-center mb-8">
            <PartyPopper className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-3xl font-bold mb-2">Get Unlimited Credits!</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upgrade to a premium plan to unlock unlimited access to AI features and advanced capabilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>For hobbyists and beginners</CardDescription>
                <div className="text-3xl font-bold mt-2">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>500 credits per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>Basic project templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>Community support</span>
                  </li>
                </ul>
                <Button className="w-full">Subscribe</Button>
              </CardContent>
            </Card>

            <Card className={cn("bg-background border-primary")}>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For professional developers</CardDescription>
                <div className="text-3xl font-bold mt-2">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>2,000 credits per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>All project templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>Custom domain</span>
                  </li>
                </ul>
                <Button className="w-full">Subscribe</Button>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For teams and businesses</CardDescription>
                <div className="text-3xl font-bold mt-2">$49.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>Unlimited credits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>All premium features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-primary" />
                    <span>White-label options</span>
                  </li>
                </ul>
                <Button className="w-full">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Important;
