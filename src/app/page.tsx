import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { campaigns } from '@/lib/mock-data';
import CampaignCard from '@/components/campaign-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="flex flex-col gap-16">
      <section className="relative h-[60vh] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-4 text-center text-primary-foreground">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Fund the Future, Decentralized.
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-primary-foreground/80">
            Empower creators and innovators by funding their projects on the blockchain. Transparent, secure, and community-driven.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="#campaigns">Explore Campaigns</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/campaigns/create">Create a Campaign</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="campaigns" className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Active Campaigns</h2>
          <Button asChild>
            <Link href="/campaigns/create">Create Campaign</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </section>
    </div>
  );
}
