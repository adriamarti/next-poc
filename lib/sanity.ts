import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: 'wh1w68s1',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
});
