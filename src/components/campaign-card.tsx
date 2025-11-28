import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { Campaign } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Clock } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Math.min((campaign.amountRaised / campaign.goal) * 100, 100);
  const campaignImage = PlaceHolderImages.find((img) => img.id === campaign.image);
  const isExpired = new Date(campaign.deadline) < new Date();
  
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {campaignImage ? (
            <Image
              src={campaignImage.imageUrl}
              alt={campaign.title}
              data-ai-hint={campaignImage.imageHint}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-secondary" />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-2 text-lg font-bold line-clamp-2">{campaign.title}</CardTitle>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{campaign.description}</p>
        
        <div>
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex justify-between text-sm">
            <span className="font-semibold text-primary">{campaign.amountRaised} ETH Raised</span>
            <span className="text-muted-foreground">{campaign.goal} ETH Goal</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground w-full justify-between">
            <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{isExpired ? 'Ended' : `${formatDistanceToNow(new Date(campaign.deadline))} left`}</span>
            </div>
            <span className="font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">{campaign.category}</span>
        </div>
        <Button asChild className="w-full">
          <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
