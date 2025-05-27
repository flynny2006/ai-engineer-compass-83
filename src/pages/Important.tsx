import React from 'react';
import { ShieldCheck, FileText, Users, Smartphone, AlertTriangle, ArrowLeft } from 'lucide-react'; // Changed Mobile to Smartphone
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const ImportantPage: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Terms of Service",
      content: "Please read our Terms of Service carefully before using the AI Web App Generator. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. Our Terms of Service outline the rules and regulations for the use of Lovable's Website, located at lovable.dev.",
      details: [
        "User responsibilities and conduct.",
        "Intellectual property rights.",
        "Limitations of liability and disclaimers.",
        "Governing law and dispute resolution.",
      ]
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Privacy Policy",
      content: "Our Privacy Policy describes how we collect, use, and share your personal information when you use our Service. We are committed to protecting your privacy and ensuring that your personal data is handled responsibly. We encourage you to review our Privacy Policy to understand our practices.",
      details: [
        "Information we collect and how we use it.",
        "Data sharing and third-party services.",
        "Your data rights and choices.",
        "Security measures to protect your information.",
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Guidelines",
      content: "Our Community Guidelines are designed to ensure a safe and respectful environment for all users. We expect all members of our community to adhere to these guidelines to foster a positive and collaborative atmosphere. Violations may result in account suspension or termination.",
      details: [
        "Respectful communication and behavior.",
        "Prohibited content and activities.",
        "Reporting violations and enforcement.",
        "Contributing to a positive community.",
      ]
    },
     {
      icon: <Smartphone className="h-8 w-8 text-primary" />, // Changed Mobile to Smartphone
      title: "Mobile Usage Policy",
      content: "Our AI Web App Generator is primarily designed for desktop use, but can be accessed on mobile devices. This policy outlines best practices and limitations for mobile usage. Functionality may be limited on smaller screens, and performance can vary depending on the device and network conditions.",
      details: [
        "Supported mobile browsers and operating systems.",
        "Known limitations and issues on mobile.",
        "Recommendations for optimal mobile experience.",
        "Reporting mobile-specific bugs or problems.",
      ]
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-destructive" />,
      title: "Disclaimers and Limitations",
      content: "The AI Web App Generator is provided 'as is' without any warranties. While we strive for accuracy and reliability, we cannot guarantee that the service will be error-free or uninterrupted. Users should use their discretion and back up important data.",
      details: [
        "No guarantee of fitness for a particular purpose.",
        "AI-generated content may require review and modification.",
        "Lovable is not liable for any data loss or damages.",
        "Service availability is not guaranteed.",
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-stone-200 dark:from-slate-900 dark:via-gray-900 dark:to-neutral-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-6 md:mb-8 group hover-lift"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 dark:from-primary dark:via-purple-400 dark:to-pink-400">
            Important Information
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Key policies, guidelines, and disclaimers for using the Lovable AI Web App Generator.
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index} className="modern-card overflow-hidden shadow-xl hover-lift bg-card/80 backdrop-blur-sm border-border/30 dark:bg-secondary/40 dark:border-white/10">
              <CardHeader className="bg-muted/30 dark:bg-muted/20 p-4 sm:p-6 border-b border-border/20 dark:border-white/5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="p-2 sm:p-3 bg-primary/10 dark:bg-primary/20 rounded-lg text-primary">
                    {section.icon}
                  </span>
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground dark:text-primary-foreground/90">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 text-sm sm:text-base">
                <p className="text-muted-foreground leading-relaxed mb-4">{section.content}</p>
                {section.details && section.details.length > 0 && (
                  <ul className="list-disc list-inside space-y-1.5 text-muted-foreground/90 marker:text-primary">
                    {section.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImportantPage;
