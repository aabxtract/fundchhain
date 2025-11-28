import CampaignForm from "@/components/campaign-form";

export default function CreateCampaignPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Launch Your Campaign</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Bring your creative project to life. We'll help you get started.
        </p>
      </div>
      <CampaignForm />
    </div>
  );
}
