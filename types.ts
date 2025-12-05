export interface ImageFile {
  id: string;
  url: string; // Base64 or Object URL
  name: string;
}

export interface SliderConfig {
  orientation: 'horizontal' | 'vertical';
  beforeLabel: string;
  afterLabel: string;
  sliderColor: string;
  initialPosition: number; // 0 to 100
}