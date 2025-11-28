
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
import { Wallet, Send, MessageSquare, Rss, Loader2, Gift, Vote, LandPlot, Check, Map, CircleDot } from 'lucide-react';
import CampaignActions from '@/components/campaign-actions';
import SocialShareButtons from '@/components/social-share-buttons';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/contexts/wallet-context';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import RewardTiers from '@/components/reward-tiers';
import { DonateDialog } from '@/components/donate-dialog';
import { RewardTier } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


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
  const goalReached = campaign.amountRaised >= campaign.goal;
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

  const mockProposals = [
    { id: 1, title: 'Allocate 10% of Treasury to Marketing', status: 'Active', votesFor: 125, votesAgainst: 30 },
    { id: 2, title: 'Partner with Eco-Friendly Packaging Supplier', status: 'Passed', votesFor: 250, votesAgainst: 15 },
    { id: 3, title: 'Double the Server Capacity for Phase 2', status: 'Failed', votesFor: 50, votesAgainst: 180 },
  ];

  const tabs = [
    { value: 'about', label: 'About', icon: null },
    { value: 'roadmap', label: 'Roadmap', icon: <Map className="mr-2 h-4 w-4" /> },
    { value: 'rewards', label: 'Rewards', icon: <Gift className="mr-2 h-4 w-4" /> },
    { value: 'updates', label: 'Updates', icon: <Rss className="mr-2 h-4 w-4" /> },
    { value: 'comments', label: 'Comments', icon: <MessageSquare className="mr-2 h-4 w-4" /> },
  ];

  if (isExpired && goalReached) {
    tabs.push({ value: 'governance', label: 'Governance', icon: <Vote className="mr-2 h-4 w-4" /> });
  }

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
             <TabsList className={`grid w-full grid-cols-${tabs.length}`}>
                {tabs.map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.icon}{tab.label}
                    </TabsTrigger>
                ))}
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
            <TabsContent value="roadmap" className="mt-4">
               <Card>
                <CardHeader>
                    <CardTitle>Project Roadmap</CardTitle>
                    <CardDescription>Follow the project's journey and see how funds will be used.</CardDescription>
                </CardHeader>
                <CardContent>
                    {campaign.milestones && campaign.milestones.length > 0 ? (
                        <div className="space-y-8 relative pl-6 before:absolute before:inset-y-0 before:w-px before:bg-border before:left-3">
                            {campaign.milestones.map((milestone, index) => (
                                <div key={milestone.id} className="relative">
                                    <div className={cn(
                                        "absolute -left-[18px] top-1 flex h-6 w-6 items-center justify-center rounded-full",
                                        milestone.status === 'Completed' ? 'bg-green-500' :
                                        milestone.status === 'In Progress' ? 'bg-primary' : 'bg-muted'
                                    )}>
                                        {milestone.status === 'Completed' ? <Check className="h-4 w-4 text-white" /> : 
                                         milestone.status === 'In Progress' ? <CircleDot className="h-4 w-4 text-white animate-pulse" /> :
                                         <div className="h-3 w-3 rounded-full bg-border" />
                                        }
                                    </div>
                                    <p className="text-sm text-muted-foreground">Target: {format(new Date(milestone.targetDate), "PPP")}</p>
                                    <h4 className="font-semibold text-lg mt-1">{milestone.title}</h4>
                                    <p className="mt-1 text-muted-foreground">{milestone.description}</p>
                                    <Badge variant="outline" className="mt-2">
                                        {milestone.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">This project has not defined a roadmap yet.</p>
                    )}
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
             <TabsContent value="governance" className="mt-4">
                <Card>
                  <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <LandPlot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Project DAO & Governance</CardTitle>
                            <CardDescription>Backers of this project can vote on its future direction.</CardDescription>
                        </div>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <p className="mb-6 text-muted-foreground">
                        This project is managed by a Decentralized Autonomous Organization (DAO). As a backer, you have voting rights to influence key decisions. Your voting power is proportional to your contribution.
                      </p>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Proposals</h3>
                        {mockProposals.map((p) => (
                            <Card key={p.id} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold">{p.title}</h4>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            <span>For: {p.votesFor}</span> &bull; <span>Against: {p.votesAgainst}</span>
                                        </div>
                                    </div>
                                    <Badge variant={p.status === 'Active' ? 'default' : p.status === 'Passed' ? 'secondary' : 'destructive'}>
                                        {p.status}
                                    </Badge>
                                </div>
                                {p.status === 'Active' && (
                                    <div className="flex gap-2 mt-4">
                                        <Button variant="outline" className="w-full">Vote For</Button>
                                        <Button variant="outline" className="w-full">Vote Against</Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                      </div>

                       <Button className="w-full mt-6" disabled>Create New Proposal (Coming Soon)</Button>
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
