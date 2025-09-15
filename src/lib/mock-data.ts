import type { HerbSample, Batch, ImagePlaceholder } from './types';

export const PlaceHolderImages: ImagePlaceholder[] = [
    {
      "id": "herb-1",
      "description": "A vibrant green basil leaf with visible texture.",
      "imageUrl": "https://images.unsplash.com/photo-1581299263769-1b90f439b0d2?q=80&w=600&h=400&fit=crop",
      "imageHint": "basil leaf"
    },
    {
      "id": "herb-2",
      "description": "A close-up of fresh mint leaves, glistening with water droplets.",
      "imageUrl": "https://images.unsplash.com/photo-1596041235629-841443651233?q=80&w=600&h=400&fit=crop",
      "imageHint": "mint leaves"
    },
    {
      "id": "herb-3",
      "description": "A sprig of rosemary against a light background.",
      "imageUrl": "https://images.unsplash.com/photo-1594056299213-9a3d4a858535?q=80&w=600&h=400&fit=crop",
      "imageHint": "rosemary sprig"
    },
    {
      "id": "herb-4",
      "description": "Dried chamomile flowers ready for processing.",
      "imageUrl": "https://images.unsplash.com/photo-1595368453999-5990f77b9468?q=80&w=600&h=400&fit=crop",
      "imageHint": "chamomile flowers"
    },
    {
      "id": "herb-5",
      "description": "A sample of lavender with rich purple color.",
      "imageUrl": "https://images.unsplash.com/photo-1563805933933-2895f5963b51?q=80&w=600&h=400&fit=crop",
      "imageHint": "lavender sample"
    },
    {
      "id": "herb-6",
      "description": "Ginseng root showing its distinctive shape.",
      "imageUrl": "https://images.unsplash.com/photo-1629837943270-f4e9a389d38c?q=80&w=600&h=400&fit=crop",
      "imageHint": "ginseng root"
    }
  ];

// Mock data is no longer used for initialization. The application will start with an empty state.
// This array is kept to avoid breaking imports, but it should not be relied upon.
export const mockSamples: HerbSample[] = [];


// Mock data is no longer used for initialization.
export const mockBatches: Batch[] = [];
