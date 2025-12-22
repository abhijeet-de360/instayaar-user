import React from "react";
import { Button } from "@/components/ui/button";
interface ParallaxSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}
export const ParallaxSection = ({
  title,
  subtitle,
  backgroundImage,
  buttonText,
  onButtonClick,
  stats
}: ParallaxSectionProps) => {
  const bgImage = backgroundImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
  
  return (
    <section 
      className="relative py-24 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative container mx-auto px-6 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">{subtitle}</p>
        
        {buttonText && (
          <Button 
            size="lg" 
            className="mb-12 bg-white text-black hover:bg-white/90"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
        
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};