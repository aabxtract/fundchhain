'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Lightbulb, CheckCircle, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  description: string;
}

const allSuggestions = [
    "Clearly state your project's main goal in the first paragraph.",
    "Include a timeline for your project milestones.",
    "Add a personal story about why this project is important to you.",
    "Break down how the funds will be used.",
    "Consider adding reward tiers for different donation amounts.",
    "Add a video to make your campaign more engaging."
];

export default function AIAssistant({ description }: AIAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [successRate, setSuccessRate] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const debouncedDescription = useDebounce(description, 1000);

  useEffect(() => {
    if (debouncedDescription && debouncedDescription.length > 20) {
      setLoading(true);
      
      // Simulate AI analysis
      setTimeout(() => {
        const newSuccessRate = Math.min(20 + Math.floor(debouncedDescription.length / 20), 95);
        setSuccessRate(newSuccessRate);

        // Simple logic to show suggestions
        const newSuggestions = [];
        if (!debouncedDescription.toLowerCase().includes('goal')) newSuggestions.push(allSuggestions[0]);
        if (!debouncedDescription.toLowerCase().includes('timeline')) newSuggestions.push(allSuggestions[1]);
        if (!debouncedDescription.toLowerCase().includes('story')) newSuggestions.push(allSuggestions[2]);
        if (newSuggestions.length < 2) newSuggestions.push(allSuggestions[3]);
        if (newSuggestions.length < 3) newSuggestions.push(allSuggestions[4]);

        setSuggestions(newSuggestions);
        setLoading(false);
      }, 1500);
    } else {
        setSuccessRate(0);
        setSuggestions([]);
    }
  }, [debouncedDescription]);

  const scoreColor = useMemo(() => {
    if (successRate < 40) return 'text-destructive';
    if (successRate < 75) return 'text-yellow-500';
    return 'text-green-500';
  }, [successRate]);

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-yellow-400" />
          AI Campaign Assistant
        </CardTitle>
        <CardDescription>
          Get real-time feedback to improve your campaign's success.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Estimated Success Rate</h4>
          <div className="relative h-32 w-32 mx-auto">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path
                className="text-border"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className={`transition-all duration-500 ${scoreColor}`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray={`${successRate}, 100`}
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${scoreColor}`}>
              {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : `${successRate}%`}
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">Based on your description.</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Suggestions</h4>
          {loading && description.length > 20 ? (
             <div className="flex items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
             </div>
          ) : suggestions.length > 0 ? (
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Start writing your description to get suggestions.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}