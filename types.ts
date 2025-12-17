export interface EditState {
  originalImage: string | null; // Base64 data URI
  generatedImage: string | null; // Base64 data URI
  prompt: string;
  isGenerating: boolean;
  error: string | null;
}

export interface ImageDimension {
  width: number;
  height: number;
}
