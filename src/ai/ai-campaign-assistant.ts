// A Genkit Flow that helps campaign creators by providing smart recommendations and estimated conversion rates using AI.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampaignAssistantInputSchema = z.object({
  title: z.string().describe('The title of the campaign.'),
  description: z.string().describe('A detailed description of the campaign.'),
  fundingGoal: z.number().describe('The funding goal for the campaign in ETH.'),
  deadline: z.string().describe('The deadline for the campaign (YYYY-MM-DD).'),
  category: z.string().describe('The category of the campaign (e.g., Tech, Art, Education).'),
});

export type CampaignAssistantInput = z.infer<typeof CampaignAssistantInputSchema>;

const CampaignAssistantOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('AI-powered recommendations to improve the campaign.'),
  estimatedConversionRate: z
    .number()
    .describe('AI-estimated conversion rate (percentage) based on provided campaign details.'),
  suggestedHashtags: z.array(z.string()).describe('Suggested hashtags to promote the campaign on social media.'),
});

export type CampaignAssistantOutput = z.infer<typeof CampaignAssistantOutputSchema>;

export async function getCampaignRecommendations(input: CampaignAssistantInput): Promise<CampaignAssistantOutput> {
  return campaignAssistantFlow(input);
}

const campaignAssistantPrompt = ai.definePrompt({
  name: 'campaignAssistantPrompt',
  input: {schema: CampaignAssistantInputSchema},
  output: {schema: CampaignAssistantOutputSchema},
  prompt: `You are an AI-powered crowdfunding campaign assistant. Analyze the campaign details provided and provide actionable recommendations to maximize its success.

Campaign Title: {{{title}}}
Campaign Description: {{{description}}}
Funding Goal (ETH): {{{fundingGoal}}}
Deadline: {{{deadline}}}
Category: {{{category}}}

Consider factors such as market trends, competitor campaigns, optimal funding periods, and effective marketing strategies.

Provide specific, data-driven recommendations to improve the campaign's visibility, reach, and conversion rates.  Suggest relevant hashtags based on the campaign category to maximize social media exposure.

Output should be formatted as a JSON object.
`,
});

const campaignAssistantFlow = ai.defineFlow(
  {
    name: 'campaignAssistantFlow',
    inputSchema: CampaignAssistantInputSchema,
    outputSchema: CampaignAssistantOutputSchema,
  },
  async input => {
    const {output} = await campaignAssistantPrompt(input);
    return output!;
  }
);
