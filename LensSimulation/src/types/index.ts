export type PresetType = 'medium_format' | 'full' | 'super35' | 'apsc' | 'apsc_canon' | 'mft' | 'inch_1' | 'inch_1_23' | 'custom';
export type AspectRatioType = 'original' | '16:9' | '9:16' | '2.35:1' | 'custom';
export type SensorCategory = 'stills' | 'cinema' | 'custom';

export interface SensorSize {
  w: number;
  h: number;
}

export const PRESETS: Record<Exclude<PresetType, 'custom'>, SensorSize> = {
  'medium_format': { w: 43.8, h: 32.9 },
  'full': { w: 36, h: 24 },
  'super35': { w: 24.89, h: 18.66 },
  'apsc': { w: 23.6, h: 15.6 },
  'apsc_canon': { w: 22.2, h: 14.8 },
  'mft': { w: 17.3, h: 13 },
  'inch_1': { w: 13.2, h: 8.8 },
  'inch_1_23': { w: 6.17, h: 4.55 }
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
    id: 'alexa_65',
    name: 'ARRI ALEXA 65',
    modes: [
      { name: '6.5K Open Gate', w: 54.12, h: 25.58 },
      { name: '16:9', w: 43.19, h: 24.30 },
      { name: '2.39:1', w: 54.12, h: 22.64 }
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
  },
  {
    id: 'red_komodo',
    name: 'RED KOMODO 6K',
    modes: [
      { name: '6K 17:9', w: 27.03, h: 14.26 },
      { name: '6K 16:9', w: 27.03, h: 15.20 },
      { name: '4K 17:9', w: 18.02, h: 9.50 }
    ]
  },
  {
    id: 'sony_fx9',
    name: 'Sony FX9',
    modes: [
      { name: 'FF 6K (16:9)', w: 35.7, h: 20.1 },
      { name: 'S35 4K (16:9)', w: 24.3, h: 13.7 }
    ]
  },
  {
    id: 'sony_fx6',
    name: 'Sony FX6',
    modes: [
      { name: 'FF (16:9)', w: 35.6, h: 20.0 },
      { name: 'S35 (16:9)', w: 24.3, h: 13.7 }
    ]
  },
  {
    id: 'canon_c500mk2',
    name: 'Canon EOS C500 Mark II',
    modes: [
      { name: '5.9K FF (17:9)', w: 38.1, h: 20.1 },
      { name: '4K S35 (17:9)', w: 26.2, h: 13.8 }
    ]
  },
  {
    id: 'canon_c300mk3',
    name: 'Canon EOS C300 Mark III',
    modes: [
      { name: '4K S35 (17:9)', w: 26.2, h: 13.8 }
    ]
  },
  {
    id: 'bmpcc_6k',
    name: 'Blackmagic Pocket Cinema 6K',
    modes: [
      { name: '6K (16:9)', w: 23.1, h: 12.99 },
      { name: '6K 2.4:1', w: 23.1, h: 9.63 },
      { name: '5.7K 17:9', w: 21.84, h: 11.51 }
    ]
  },
  {
    id: 'ursa_12k',
    name: 'Blackmagic URSA Mini Pro 12K',
    modes: [
      { name: '12K 17:9', w: 27.03, h: 14.25 },
      { name: '12K 16:9', w: 27.03, h: 15.20 },
      { name: '8K 17:9', w: 27.03, h: 14.25 },
      { name: '4K S16', w: 13.51, h: 7.12 }
    ]
  },
  {
    id: 'venice_6k',
    name: 'Sony VENICE (6K)',
    modes: [
      { name: '6K 3:2', w: 36.2, h: 24.1 },
      { name: '6K 17:9', w: 36.2, h: 19.1 },
      { name: '5.7K 16:9', w: 35.7, h: 20.1 },
      { name: '4K S35 17:9', w: 24.3, h: 12.8 }
    ]
  },
  {
    id: 'burano_8k',
    name: 'Sony BURANO 8K',
    modes: [
      { name: 'FF 8.6K 16:9', w: 35.9, h: 20.2 },
      { name: 'FF Crop 6K 16:9', w: 24.0, h: 13.5 },
      { name: 'S35 5.8K 17:9', w: 24.3, h: 12.8 }
    ]
  },
  {
    id: 'alexa_mini',
    name: 'ARRI ALEXA Mini',
    modes: [
      { name: '3.4K Open Gate', w: 28.25, h: 18.17 },
      { name: '16:9 HD / 3.2K', w: 23.76, h: 13.37 },
      { name: '4:3 Anamorphic', w: 23.76, h: 17.82 }
    ]
  },
  {
    id: 'red_monstro',
    name: 'RED MONSTRO 8K VV',
    modes: [
      { name: '8K VV (17:9)', w: 40.96, h: 21.60 },
      { name: '6K S35 (17:9)', w: 30.72, h: 16.20 }
    ]
  },
  {
    id: 'red_helium',
    name: 'RED HELIUM 8K S35',
    modes: [
      { name: '8K 17:9', w: 29.90, h: 15.77 },
      { name: '6K 17:9', w: 22.43, h: 11.83 }
    ]
  },
  {
    id: 'red_gemini',
    name: 'RED GEMINI 5K S35',
    modes: [
      { name: '5K 17:9', w: 30.72, h: 16.20 },
      { name: '4K 17:9', w: 24.58, h: 12.96 }
    ]
  },
  {
    id: 'canon_c70',
    name: 'Canon EOS C70',
    modes: [
      { name: '4K S35 (17:9)', w: 26.2, h: 13.8 },
      { name: '4K S35 (16:9)', w: 24.6, h: 13.8 }
    ]
  },
  {
    id: 'panasonic_s1h',
    name: 'Panasonic Lumix S1H',
    modes: [
      { name: '6K FF (3:2)', w: 35.6, h: 23.8 },
      { name: '5.9K FF (16:9)', w: 35.6, h: 20.0 },
      { name: '4K S35', w: 24.8, h: 14.0 }
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
