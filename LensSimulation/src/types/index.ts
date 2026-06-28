export type PresetType = 'full' | 'super35' | 'apsc' | 'mft' | 'custom';
export type AspectRatioType = 'original' | '16:9' | '9:16' | '2.35:1' | 'custom';

export interface SensorSize {
  w: number;
  h: number;
}

export const PRESETS: Record<Exclude<PresetType, 'custom'>, SensorSize> = {
  'full': { w: 36, h: 24 },
  'super35': { w: 24.89, h: 18.66 },
  'apsc': { w: 23.6, h: 15.6 },
  'mft': { w: 17.3, h: 13 }
};

export interface SensorMode {
  name: string;
  w: number;
  h: number;
}

export interface CinemaCamera {
  id: string;
  name: string;
  modes: SensorMode[];
}

export const CINEMA_CAMERAS: CinemaCamera[] = [
  {
    id: 'alexa35',
    name: 'ARRI ALEXA 35',
    modes: [
      { name: '4.6K 3:2 Open Gate', w: 27.99, h: 19.22 },
      { name: '4.6K 16:9', w: 27.99, h: 15.75 },
      { name: '4K 16:9', w: 24.89, h: 14.0 },
      { name: '3.3K 6:5 (Anamorphic)', w: 20.22, h: 16.95 }
    ]
  },
  {
    id: 'alexa_mini_lf',
    name: 'ARRI ALEXA Mini LF',
    modes: [
      { name: '4.5K Open Gate', w: 36.70, h: 25.54 },
      { name: '4.5K 2.39:1', w: 36.70, h: 15.31 },
      { name: '16:9 UHD', w: 31.68, h: 17.82 }
    ]
  },
  {
    id: 'venice2_8k',
    name: 'Sony VENICE 2 (8K)',
    modes: [
      { name: '8.6K 3:2', w: 35.9, h: 24.0 },
      { name: '8.2K 17:9', w: 35.9, h: 18.9 },
      { name: '5.8K 17:9 (Super35)', w: 24.3, h: 12.8 }
    ]
  },
  {
    id: 'red_vraptor',
    name: 'RED V-RAPTOR 8K VV',
    modes: [
      { name: '8K VV (17:9)', w: 40.96, h: 21.60 },
      { name: '6K Super35', w: 30.72, h: 16.20 },
      { name: '4K (17:9)', w: 20.48, h: 10.80 }
    ]
  }
];

export interface AngleState {
  hFov: number;
  vFov: number;
  dFov: number;
  ew: number;
  eh: number;
  targetRatioStr: string;
}
