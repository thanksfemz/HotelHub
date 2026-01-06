import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

const imageMap = new Map<string, ImagePlaceholder>(
  placeholderImages.map((image) => [image.id, image])
);

export function getPlaceholderImage(id: string): ImagePlaceholder {
  const image = imageMap.get(id);
  if (!image) {
    // Return a fallback image or throw an error
    return {
      id: 'fallback',
      description: 'Fallback image',
      imageUrl: 'https://picsum.photos/seed/fallback/600/400',
      imageHint: 'abstract',
    };
  }
  return image;
}
