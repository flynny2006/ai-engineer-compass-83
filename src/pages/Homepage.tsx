
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Star, Users, ArrowRight, Sparkles, Code, Rocket, Shield } from 'lucide-react';
import HomepageNav from '@/components/HomepageNav';
import ModernPromptInput from '@/components/ModernPromptInput';
import ProjectsSection from '@/components/ProjectsSection';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Homepage = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5');
  const [attachedImage, setAttachedImage] = useState<File | null>(null);

  const handlePromptSubmit = () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    // Simulate project creation and navigation
    setTimeout(() => {
      const projectId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("current_project_id", projectId);
      
      // Save project to localStorage
      const existingProjects = JSON.parse(localStorage.getItem("saved_projects") || "[]");
      const newProject = {
        id: projectId,
        name: prompt.slice(0, 50) + (prompt.length > 50 ? "..." : ""),
        description: `Project created from: ${prompt}`,
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      existingProjects.push(newProject);
      localStorage.setItem("saved_projects", JSON.stringify(existingProjects));
      
      setIsLoading(false);
      navigate(`/project?id=${projectId}`);
    }, 1500);
  };

  const handleImageAttach = (file: File) => {
    setAttachedImage(file);
    toast({
      title: "Image attached",
      description: `${file.name} has been attached to your message.`,
    });
  };

  const handleRemoveImage = () => {
    setAttachedImage(null);
    toast({
      title: "Image removed",
      description: "The attached image has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <HomepageNav />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 animate-pulse"></div>
        <div className="relative container max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Development Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Build Apps with
            <br />
            <span className="text-white">Boongle AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            The most advanced AI software engineer that transforms your ideas into fully functional web applications in minutes, not months.
          </p>
          
          <div className="max-w-4xl mx-auto mb-12">
            <ModernPromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handlePromptSubmit}
              isLoading={isLoading}
              placeholder="Ask Boongle AI to build anything..."
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              userPlan="FREE"
              onImageAttach={handleImageAttach}
              attachedImage={attachedImage}
              onRemoveImage={handleRemoveImage}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No coding required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Deploy instantly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>AI-powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to build, deploy, and scale your applications with AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Lightning Fast</CardTitle>
                <CardDescription className="text-gray-300">
                  Build complete applications in minutes with our advanced AI engine
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">No Code Required</CardTitle>
                <CardDescription className="text-gray-300">
                  Simply describe what you want and watch AI build it for you
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Instant Deploy</CardTitle>
                <CardDescription className="text-gray-300">
                  Deploy your applications with one click to production
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-pink-400" />
                </div>
                <CardTitle className="text-white">Enterprise Ready</CardTitle>
                <CardDescription className="text-gray-300">
                  Built with security and scalability in mind for production use
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400/20 to-yellow-400/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Team Collaboration</CardTitle>
                <CardDescription className="text-gray-300">
                  Work together with your team in real-time on any project
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">AI Assistance</CardTitle>
                <CardDescription className="text-gray-300">
                  Get intelligent suggestions and improvements from our AI
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <ProjectsSection />

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-gray-300">Apps Built</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-blue-400 mb-2">5K+</div>
              <div className="text-gray-300">Happy Users</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 relative">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-black font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-white">Sarah Chen</div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  "Boongle AI completely transformed how I build applications. What used to take weeks now takes minutes!"
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-black font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-white">Mike Rodriguez</div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  "As a non-technical founder, Boongle AI gave me the power to bring my startup ideas to life instantly."
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-black font-bold">
                    F
                  </div>
                  <div>
                    <div className="font-semibold text-white">Fabian</div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  "The best AI Software Engineer i ever used. This is just amazing. And 25 daily Credits are crazy! I highly recommend this instead of bolt.new and trickle!"
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Ready to Build Your Dream App?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already building amazing applications with Boongle AI.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-black font-semibold px-8 py-6 text-lg rounded-full"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg"></div>
              <span className="text-xl font-bold text-white">Boongle AI</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Boongle Development. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
