import React from 'react';

const TextRenderer = ({ text, className = "" }) => {
  if (!text) return null;
  
  const lines = text.split('\n');

  return (
    <div className={`space-y-2 ${className}`}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />;

        // Handle Headers (## Title)
        if (trimmed.startsWith('##')) {
          return <h3 key={index} className="font-serif text-lg font-bold text-slate-800 mt-4">{trimmed.replace(/##/g, '')}</h3>;
        }
        
        // Handle Bullet points
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
           const content = trimmed.replace(/^[\*\-]\s/, '');
           const parts = content.split(/(\*\*.*?\*\*)/g);
           return (
             <div key={index} className="flex gap-2 ml-2">
                <span className="text-orange-500 mt-1.5">•</span>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {parts.map((part, i) => 
                    part.startsWith('**') && part.endsWith('**') 
                      ? <strong key={i} className="text-slate-800 font-semibold">{part.slice(2, -2)}</strong> 
                      : part
                  )}
                </p>
             </div>
           );
        }

        // Standard Paragraph with bold parsing
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="text-slate-600 text-sm leading-relaxed">
            {parts.map((part, i) => 
              part.startsWith('**') && part.endsWith('**') 
                ? <strong key={i} className="text-slate-800 font-semibold">{part.slice(2, -2)}</strong> 
                : part
            )}
          </p>
        );
      })}
    </div>
  );
};

export default TextRenderer;