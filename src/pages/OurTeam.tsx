
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OurTeam = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md sticky top-0 z-50 w-full border-b border-white/10">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <Compass className="h-7 w-7 text-green-400" />
            <span className="font-semibold text-xl">Boongle AI</span>
          </Link>
          
          <Button variant="ghost" asChild className="text-white hover:text-gray-300">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="h-12 w-12 text-green-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Our Team
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Meet the passionate team behind Boongle Development
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About Boongle Development
          </h2>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-6">
              At Boongle Development, we are a passionate team of innovators, engineers, and visionaries dedicated to revolutionizing the way software is built. Founded with the mission to democratize application development, we believe that everyone should have the power to bring their ideas to life, regardless of their technical background.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Our journey began with a simple observation: traditional software development is too complex, too time-consuming, and too expensive for most people and businesses. We set out to change that by harnessing the power of artificial intelligence to create an intuitive, powerful, and accessible development platform.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Boongle AI represents years of research, development, and refinement. Our team combines expertise in machine learning, software engineering, user experience design, and product development to create tools that truly understand what you want to build and help you build it faster than ever before.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              We're not just building software; we're building the future of creation itself. Our platform empowers entrepreneurs, designers, developers, and dreamers to transform their visions into reality with unprecedented speed and ease. From simple landing pages to complex web applications, Boongle AI handles the technical complexity so you can focus on what matters most: your ideas.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Our team is distributed across the globe, bringing together diverse perspectives and experiences. We're united by our shared commitment to excellence, innovation, and the belief that technology should serve humanity, not the other way around. Every day, we work to make Boongle AI more intelligent, more intuitive, and more powerful.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              What sets us apart is our relentless focus on user experience and our commitment to making advanced AI accessible to everyone. We believe that the best technology is invisible – it just works, seamlessly and efficiently, allowing you to achieve your goals without getting bogged down in technical details.
            </p>
            
            <p className="text-gray-300 leading-relaxed">
              Join us on this exciting journey as we continue to push the boundaries of what's possible with AI-powered development. Together, we're not just building applications; we're building the future of how ideas become reality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
