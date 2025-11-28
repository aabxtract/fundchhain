'use client';

import { Twitter, Facebook } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

interface SocialShareButtonsProps {
  campaignTitle: string;
  campaignUrl: string;
}

export default function SocialShareButtons({ campaignTitle, campaignUrl }: SocialShareButtonsProps) {
  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    // Ensure this runs only on the client where `window.location.origin` is available
    setFullUrl(`${window.location.origin}${campaignUrl}`);
  }, [campaignUrl]);

  if (!fullUrl) {
    return null; // Or a loading skeleton
  }

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    fullUrl
  )}&text=${encodeURIComponent(`Check out this campaign on FundChain: "${campaignTitle}"`)}`;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;

  return (
    <div className="flex justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        asChild
        aria-label="Share on Twitter"
      >
        <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-5 w-5" />
        </a>
      </Button>
      <Button
        variant="outline"
        size="icon"
        asChild
        aria-label="Share on Facebook"
      >
        <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
}
