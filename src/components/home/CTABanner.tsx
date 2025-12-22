import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  variant?: "primary" | "secondary" | "accent";
  onButtonClick?: () => void;
}

export const CTABanner = ({ 
  title, 
  subtitle, 
  buttonText, 
  variant = "primary",
  onButtonClick 
}: CTABannerProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground";
      case "accent":
        return "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground";
      default:
        return "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground";
    }
  };

  return (
    <section className={`py-16 ${getVariantClasses()}`}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            {title}
          </h2>
          <p className="text-lg mb-8 opacity-90 animate-fade-in">
            {subtitle}
          </p>
          {/* <Button 
            onClick={onButtonClick}
            variant="secondary"
            size="lg"
            className="hover-scale bg-background text-foreground hover:bg-background/90"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </section>
  );
};