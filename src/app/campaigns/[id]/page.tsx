import { campaigns } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Progress } from '@/components/ui/progress';
import CountdownTimer from '@/components/countdown-timer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Wallet } from 'lucide-react';
import CampaignActions from '@/components/campaign-actions';
import SocialShareButtons from '@/components/social-share-buttons';
import { Separator } from '@/components/ui/separator';

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  const campaign = campaigns.find((c) => c.id === params.id);

  if (!campaign) {
    notFound();
  }

  const campaignImage = PlaceHolderImages.find((img) => img.id === campaign.image);
  const progress = Math.min((campaign.amountRaised / campaign.goal) * 100, 100);
  const isExpired = new Date(campaign.deadline) < new Date();
  
  const truncateAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  // In a real app, this would be the absolute URL
  const campaignUrl = `/campaigns/${campaign.id}`;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="relative mb-4 h-96 w-full overflow-hidden rounded-lg shadow-lg">
            {campaignImage && (
              <Image
                src={campaignImage.imageUrl}
                alt={campaign.title}
                data-ai-hint={campaignImage.imageHint}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
                <span className="font-semibold px-3 py-1 rounded-full bg-primary/80 text-primary-foreground text-sm backdrop-blur-sm">{campaign.category}</span>
                <h1 className="mt-2 text-3xl font-bold text-white shadow-text">{campaign.title}</h1>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>About this project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{campaign.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <div className="mb-4">
                <Progress value={progress} className="h-3" />
                <div className="mt-2 flex justify-between text-sm">
                  <span className="font-bold text-lg text-primary">{campaign.amountRaised} ETH</span>
                  <span className="text-muted-foreground">raised of {campaign.goal} ETH goal</span>
                </div>
              </div>

              <div className="my-6 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">{isExpired ? 'Ended' : <CountdownTimer deadline={campaign.deadline} />}</div>
                  <div className="text-sm text-muted-foreground">{isExpired ? '' : 'to go'}</div>
                </div>
                <div>
                    <div className="text-3xl font-bold">128</div>
                    <div className="text-sm text-muted-foreground">Backers</div>
                </div>
              </div>
              
              <CampaignActions campaign={campaign} />

              <Separator className="my-6" />

              <div className="space-y-4 text-center">
                <h3 className="font-semibold text-sm text-muted-foreground">Share this campaign</h3>
                <SocialShareButtons campaignTitle={campaign.title} campaignUrl={campaignUrl} />
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-sm mb-2">Creator</h3>
                <div className="flex items-center gap-3">
                   <Avatar className="h-10 w-10">
                    <AvatarFallback>{campaign.creator.substring(2, 4).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-mono text-sm">{truncateAddress(campaign.creator)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Wallet className="h-3 w-3" /> Verified Creator</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
