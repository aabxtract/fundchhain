

'use client';

import { campaigns } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Progress } from '@/components/ui/progress';
import CountdownTimer from '@/components/countdown-timer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Wallet, Send, MessageSquare, Rss, Loader2, Gift } from 'lucide-react';
import CampaignActions from '@/components/campaign-actions';
import SocialShareButtons from '@/components/social-share-buttons';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/contexts/wallet-context';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import RewardTiers from '@/components/reward-tiers';
import { DonateDialog } from '@/components/donate-dialog';
import { RewardTier } from '@/lib/types';


export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch a single campaign, but here we find it.
  const campaign = campaigns.find((c) => c.id === params.id);
  const { toast } = useToast();

  if (!campaign) {
    notFound();
  }

  const { isConnected, address } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState('');
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<RewardTier | null>(null);

  const campaignImage = PlaceHolderImages.find((img) => img.id === campaign.image);
  const progress = Math.min((campaign.amountRaised / campaign.goal) * 100, 100);
  const isExpired = new Date(campaign.deadline) < new Date();
  const isCreator = isConnected && address?.toLowerCase() === campaign.creator.toLowerCase();

  const truncateAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    toast({ title: 'Posting comment...' });

    setTimeout(() => {
      // In a real app, you'd save this to a database
      console.log('New comment:', comment);
      setComment('');
      setIsSubmitting(false);
      toast({ title: 'Comment posted!', description: 'Thank you for your feedback.' });
    }, 1500);
  };
  
  // In a real app, this would be the absolute URL
  const campaignUrl = `/campaigns/${campaign.id}`;

  const handleTierSelect = (tier: RewardTier) => {
    setSelectedTier(tier);
    setIsDonateOpen(true);
  };
  
  const handleGenericDonate = () => {
    setSelectedTier(null);
    setIsDonateOpen(true);
  };

  return (
    <>
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
          
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
               <TabsTrigger value="rewards">
                <Gift className="mr-2 h-4 w-4" /> Rewards
              </TabsTrigger>
              <TabsTrigger value="updates">
                <Rss className="mr-2 h-4 w-4" /> Updates
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="mr-2 h-4 w-4" /> Comments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About this project</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{campaign.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
             <TabsContent value="rewards" className="mt-4">
              <RewardTiers campaign={campaign} onSelectTier={handleTierSelect} />
            </TabsContent>
            <TabsContent value="updates" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Updates</CardTitle>
                  <CardDescription>Follow along with the project's progress.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {campaign.updates && campaign.updates.length > 0 ? (
                    <div className="space-y-8">
                      {campaign.updates.map((update) => (
                        <div key={update.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Rss className="h-4 w-4" />
                            </div>
                            <div className="h-full w-px bg-border" />
                          </div>
                          <div className="pb-8">
                            <p className="text-sm text-muted-foreground">{format(new Date(update.timestamp), "PPP")}</p>
                            <h4 className="font-semibold text-lg">{update.title}</h4>
                            <p className="mt-1 text-muted-foreground">{update.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No updates posted yet.</p>
                  )}
                  {isCreator && (
                     <p className="text-center text-muted-foreground py-4 text-sm">As the creator, you can post new updates here.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
               <Card>
                <CardHeader>
                  <CardTitle>Community Discussion</CardTitle>
                  <CardDescription>Leave a comment and interact with the community.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isConnected ? (
                    <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
                      <Textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..." 
                        rows={3} 
                      />
                      <Button type="submit" disabled={isSubmitting} className="self-end">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Post Comment
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      <p>You must connect your wallet to leave a comment.</p>
                    </div>
                  )}

                  <Separator className="my-6" />

                  <div className="space-y-6">
                    {campaign.comments && campaign.comments.length > 0 ? (
                      campaign.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>{c.author.substring(2, 4).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                               <p className="font-semibold text-sm">{truncateAddress(c.author)}</p>
                               <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(c.timestamp), { addSuffix: true })}</p>
                            </div>
                            <p className="text-muted-foreground mt-1">{c.comment}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">Be the first to leave a comment!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
              
              <CampaignActions campaign={campaign} onGenericDonate={handleGenericDonate} />

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
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <Link href={`/creators/${campaign.creator}`} className="font-mono text-sm">{truncateAddress(campaign.creator)}</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Wallet className="h-3 w-3" /> Verified Creator</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <DonateDialog 
        open={isDonateOpen}
        onOpenChange={setIsDonateOpen}
        campaign={campaign}
        selectedTier={selectedTier}
      />
    </>
  );
}
