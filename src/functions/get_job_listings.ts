import { ApifyClient } from 'apify-client';

const ApifyToken = import.meta.env.VITE_APIFY_API_KEY;

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: ApifyToken,
});

export interface JobListingInput {
    country?: string;
    title?: string;
    location?: string;
    limit?: number;
    datePosted?: string;
    [key: string]: any;
}

export async function getJobListings(input: JobListingInput) {
    // Run the Actor and wait for it to finish
    const run = await client.actor('TrtlecxAsNRbKl1na').call(input);

    // Fetch and return Actor results from the run's dataset (if any)
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    return items;
}