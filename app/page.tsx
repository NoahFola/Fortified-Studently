"use client";
import React from "react";
import {
  Menu,
  X,
  TrendingUp,
  Cpu,
  BookOpen,
  Clock,
  Users,
  Zap,
  Search,
  MessageSquare,
  Briefcase,
  DollarSign,
  Heart,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ChevronRight,
  Play,
  CheckCircle,
  GraduationCap,
  Sparkles,
  Layers,
  Sliders,
  Target,
  ScrollText,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";

// --- Types and Interfaces ---

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StatCardProps {
  value: string;
  label: string;
}

interface LinkItem {
  name: string;
  href: string;
}

// NOTE: The CustomStyles component is removed as requested,
// relying on globally imported Tailwind configuration and custom CSS.

// --- Modular Components ---

const Navbar: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-foreground/60 backdrop-blur-sm shadow-lg">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center max-w-7xl">
      <div className="text-2xl font-bold text-secondary">Studently</div>
      <button className="p-2 rounded-full bg-card hover:bg-card/70 border border-border transition duration-200">
        <Users className="w-5 h-5 text-foreground" />
      </button>
    </div>
  </header>
);

const Button: React.FC<{
  variant: "primary" | "outline";
  children: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ variant, children, icon }) => {
  const baseClasses =
    "flex items-center justify-center font-medium px-8 py-3 rounded-xl transition duration-300 transform hover:scale-[1.01]";

  if (variant === "primary") {
    return (
      <button
        className={`${baseClasses} bg-primary text-primary-foreground shadow-lg hover:shadow-primary/50`}
      >
        {children}
        {icon && <span className="ml-2">{icon}</span>}
      </button>
    );
  }

  return (
    <button
      className={`${baseClasses} border-2 border-secondary text-secondary hover:bg-secondary/10`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const HeroSection: React.FC = () => (
  <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 min-h-screen flex items-center justify-center overflow-hidden bg-background">
    {/* Hero Orb 1 - Using inline styles to replicate the visual effect previously in CustomStyles */}
    <div
      className="absolute w-[400px] h-[400px] rounded-full opacity-30 blur-[100px] z-0 hidden md:block"
      style={{
        left: "-100px",
        top: "-100px",
        background: "radial-gradient(circle, #545eff 0%, transparent 70%)",
      }}
    ></div>

    {/* Hero Orb 2 - Using inline styles to replicate the visual effect previously in CustomStyles */}
    <div
      className="absolute w-[400px] h-[400px] rounded-full opacity-30 blur-[100px] z-0 hidden md:block"
      style={{
        right: "-100px",
        top: "-50px",
        background: "radial-gradient(circle, #2e38ff 0%, transparent 70%)",
      }}
    ></div>

    <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
      <span className="inline-flex items-center rounded-full bg-secondary/20 px-4 py-1 text-xs font-semibold uppercase text-secondary border border-secondary/50 mb-6 tracking-widest">
        AI-Powered
      </span>

      {/* text-title-gradient and text-headline-gradient classes are assumed to be globally available */}
      <h1 className="text-5xl lg:text-[84px] leading-tight tracking-[-2px] font-semibold mb-6 text-title-gradient">
        Your All-in-One{" "}
        <span className="text-headline-gradient">AI Study Companion</span>
      </h1>

      <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
        Stay on top of courses, track GPA, and get smarter study recommendations
        — all in one app.
      </p>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" icon={<Play className="w-4 h-4" />}>
          Watch Demo
        </Button>
        <Button variant="primary" icon={<ChevronRight className="w-4 h-4" />}>
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </div>
    </div>
  </section>
);

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center p-6 lg:p-10 border-r border-border first:border-l lg:first:border-l-0 lg:border-r-0 lg:border-t lg:last:border-r-0 lg:border-l-0 w-full lg:w-auto">
    <p className="text-5xl font-extrabold text-secondary mb-2">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const StatsSection: React.FC = () => (
  <section className="bg-card py-12 lg:py-16 -mt-12 relative z-20 max-w-7xl mx-auto rounded-2xl shadow-xl border border-border mb-24">
    <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border">
      <StatCard value="10K+" label="Active Students" />
      <StatCard value="99.9%" label="Accuracy" />
      <StatCard value="24/7" label="Available" />
    </div>
  </section>
);

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-card p-6 lg:p-8 rounded-2xl border border-border shadow-xl hover:shadow-2xl hover:border-secondary/50 transition duration-300 h-full">
    <div className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 text-secondary bg-secondary/10">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const HowItWorksSection: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Track Courses & Grades",
      description:
        "Track Courses & Grades made simple with AI-powered efficiency.",
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Smart GPA Calculator",
      description:
        "Smart GPA Calculator made simple with AI-powered efficiency.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI-Powered Q&A",
      description: "AI-Powered Q&A made simple with AI-powered efficiency.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Personalized Recommendations",
      description:
        "Personalized Recommendations made simple with AI-powered efficiency.",
    },
    {
      icon: <ScrollText className="w-6 h-6" />,
      title: "Note Summarization",
      description: "Note Summarization made simple with AI-powered efficiency.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Flashcard Generation",
      description:
        "Flashcard Generation made simple with AI-powered efficiency.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          {/* text-headline-gradient class is assumed to be globally available */}
          <h2 className="text-4xl lg:text-6xl font-extrabold text-headline-gradient mb-4">
            How Studently Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Your all-in-one study partner, made simple in six steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const BenefitBadge: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-1 text-xs font-semibold uppercase text-primary border border-primary/50 mr-4 tracking-widest">
    {children}
  </span>
);

const BenefitCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-card p-6 lg:p-10 rounded-2xl border border-border shadow-xl hover:shadow-2xl hover:border-accent/50 transition duration-300 h-full">
    <div className="flex items-center justify-center w-14 h-14 rounded-xl mb-6 text-accent bg-accent/10">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold text-foreground mb-3">{title}</h3>
    <p className="text-base text-muted-foreground">{description}</p>
  </div>
);

const WhyStudentlySection: React.FC = () => {
  const benefits: FeatureCardProps[] = [
    {
      icon: <Layers className="w-7 h-7" />,
      title: "All-in-One Platform",
      description:
        "No need to juggle multiple apps – everything you need in one place.",
    },
    {
      icon: <Cpu className="w-7 h-7" />,
      title: "AI That Understands You",
      description:
        "Smart tools tailored to your courses, grades, and study style.",
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Stay Focused",
      description:
        "Eliminate distractions with reminders, summaries, and streamlined tasks.",
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Results That Matter",
      description:
        "Track progress, improve performance, and hit your academic goals.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          {/* text-headline-gradient class is assumed to be globally available */}
          <h2 className="text-4xl lg:text-6xl font-extrabold text-headline-gradient mb-6">
            Why Studently?
          </h2>
          <div className="flex justify-center mb-10">
            <BenefitBadge>Built for students</BenefitBadge>
            <BenefitBadge>AI-Powered</BenefitBadge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>

        <div className="text-center mt-20">
          <Button variant="primary" icon={<ChevronRight className="w-4 h-4" />}>
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

const AWSSection: React.FC = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4 max-w-7xl flex justify-center">
      <div className="p-8 bg-card border border-border rounded-xl shadow-lg flex flex-col items-center">
        <div className="mb-4">
          {/* Placeholder for AWS Logo Image */}
          <img
            src="https://placehold.co/100x40/000000/FFFFFF?text=AWS+Logo"
            alt="AWS Services"
            className="h-10 w-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/100x40/FFFFFF/000000?text=AWS";
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <span className="text-secondary font-semibold">AWS Services</span>
        </p>
      </div>
    </div>
  </section>
);

const Footer: React.FC = () => {
  const quickLinks: LinkItem[] = [
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Why Studently", href: "#why" },
    { name: "Contact", href: "#contact" },
  ];

  const socialIcons: { icon: React.ReactNode; href: string }[] = [
    { icon: <Facebook className="w-5 h-5" />, href: "#" },
    { icon: <Twitter className="w-5 h-5" />, href: "#" },
    { icon: <Instagram className="w-5 h-5" />, href: "#" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#" },
    { icon: <Github className="w-5 h-5" />, href: "#" },
  ];

  return (
    <footer className="bg-background pt-16 border-t border-border mt-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-border">
          {/* Column 1: Brand & Description */}
          <div>
            <div className="text-2xl font-bold text-secondary mb-4">
              Studently
            </div>
            <p className="text-muted-foreground mb-4 max-w-xs">
              Your all-in-one AI-powered student assistant for smarter studying,
              GPA tracking, and focus.
            </p>
            <div className="flex items-center text-secondary hover:text-primary transition duration-200">
              <Mail className="w-4 h-4 mr-2" />
              <a href="mailto:eyitoyobembe@gmail.com" className="text-sm">
                eyitoyobembe@gmail.com
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-secondary transition duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect With Us */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-secondary transition duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p className="mb-2 md:mb-0">
            Crafted with <Heart className="inline w-3 h-3 text-red-500 mx-1" />{" "}
            by Obembe Eyitayo
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-secondary transition duration-200"
            >
              Hire Me
            </a>
            <a
              href="#"
              className="hover:text-secondary transition duration-200"
            >
              View Portfolio
            </a>
          </div>
        </div>

        <div className="py-4 text-center text-xs text-muted-foreground/50 border-t border-border/50">
          &copy; {new Date().getFullYear()} Studently. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// --- Main Page Component ---

const StudentlyLandingPage: React.FC = () => {
  return (
    // Removed <CustomStyles /> and relied on global CSS and standard/inline Tailwind classes
    <div className=" bg-background min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsSection />
        </div>
        <HowItWorksSection />
        <WhyStudentlySection />
        <AWSSection />
      </main>
      <Footer />
    </div>
  );
};

export default StudentlyLandingPage;
