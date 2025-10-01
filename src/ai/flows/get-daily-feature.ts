'use server';

/**
 * @fileOverview Provides daily content for the AstroBio Explorer app.
 *
 * - getDailyFeature - A function that returns a fun fact for K-12 or a complex topic for Pro users from a pre-defined list.
 * - GetDailyFeatureInput - The input type for the getDailyFeature function.
 * - GetDailyFeatureOutput - The return type for the getDailyFeature function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetDailyFeatureInputSchema = z.object({
  mode: z.enum(['K-12', 'Pro']).describe('The user mode to determine the type of content to generate.'),
});
export type GetDailyFeatureInput = z.infer<typeof GetDailyFeatureInputSchema>;

const GetDailyFeatureOutputSchema = z.object({
  title: z.string().describe('The title for the daily feature section.'),
  content: z.string().describe('The content for the daily feature.'),
});
export type GetDailyFeatureOutput = z.infer<typeof GetDailyFeatureOutputSchema>;


const k12FunFacts = [
    "In space, astronauts can grow taller because of the lack of gravity compressing their spines!",
    "Tardigrades, also known as 'water bears', are tiny creatures that can survive the vacuum of space.",
    "Some bacteria become more dangerous in space, forming biofilms that are harder to get rid of.",
    "NASA has a 'veg-gie' garden on the International Space Station to grow lettuce and other greens for astronauts.",
    "Without gravity, the flame of a candle in space is round and blue!",
    "Fruit flies were some of the first animals sent to space to study how cosmic radiation affects genes.",
    "Your sense of taste changes in space! Astronauts often prefer spicier foods.",
    "Cosmic radiation in space is like a constant, tiny rain of high-energy particles that can damage DNA.",
    "Plants on the ISS don't know which way is 'up', so they are grown under special lights to guide them.",
    "Microbes from Earth have been found living on the outside of the International Space Station!",
    "Space lettuce grows faster than Earth lettuce, but it has fewer protective antioxidants.",
    "A day on the ISS is only 90 minutes long, so astronauts see 16 sunrises and sunsets every Earth day!",
    "Even a simple cold can be a big problem in space because your sinuses can't drain properly.",
    "Salmonella becomes more virulent (more likely to cause disease) after being in space.",
    "Astronauts have to exercise for two hours every day to prevent their muscles and bones from weakening."
];

const proTopics = [
    "Investigating the role of telomere dynamics in astronaut cellular aging during long-duration spaceflight.",
    "Analyzing the multi-generational effects of microgravity on plant epigenetics and gene expression.",
    "The challenge of microbial biofilm formation on spacecraft life support systems and potential countermeasures.",
    "Differential protein expression in rodent models exposed to simulated galactic cosmic rays (GCRs).",
    "Exploring the mechanobiology of bone-muscle crosstalk in response to gravitational unloading.",
    "The impact of spaceflight on the human microbiome and its implications for immune dysregulation.",
    "Developing closed-loop life support systems using extremophilic algae for oxygen and biomass production.",
    "Studying the behavior of protein crystallization in microgravity for pharmaceutical development.",
    "The potential for using CRISPR-Cas9 to engineer radiation-resistant organisms for terraforming applications.",
    "Neurovestibular adaptation to artificial gravity environments in rotating spacecraft designs.",
    "Assessing the efficacy of novel radioprotectants in mitigating DNA damage from space radiation.",
    "Fluid shifts and their impact on intracranial pressure and vision (SANS) in astronauts.",
    "The use of organ-on-a-chip technology to model human physiological responses to spaceflight.",
    "Characterizing the transcriptomic landscape of fungi exposed to the harsh environment of the lunar surface.",
    "Psychoneuroimmunology in isolated, confined environments: lessons for Mars missions."
];

function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now as any) - (start as any);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

export async function getDailyFeature(input: GetDailyFeatureInput): Promise<GetDailyFeatureOutput> {
    const dayIndex = getDayOfYear();

    if (input.mode === 'K-12') {
        const fact = k12FunFacts[dayIndex % k12FunFacts.length];
        return {
            title: 'Fun Fact of the Day',
            content: fact,
        };
    } else { // Pro mode
        const topic = proTopics[dayIndex % proTopics.length];
        return {
            title: 'Topic of the Day',
            content: topic,
        };
    }
}
