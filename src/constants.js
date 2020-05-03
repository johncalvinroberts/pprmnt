export const MESSAGE_TYPES = {
  INIT: 'INIT',
  CREATE_JOB: 'CREATE_JOB',
  CLEANUP: 'CLEANUP',
  FINISH_JOB: 'FINISH_JOB',
};

export const LOAD_STATUS = {
  INITIAL: 'INITIAL',
  PENDING: 'PENDING',
  OK: 'OK',
  ERROR: 'ERROR',
};

export const COLOR_MODE_KEY = 'pprmntcolormode';
export const BIT_RATE_KEY = 'pprmntbitrate';
export const VBR_METHOD_KEY = 'pprmntvbrmethod';

export const BIT_RATE_CHOICES = [
  8,
  12,
  16,
  24,
  32,
  48,
  56,
  64,
  96,
  112,
  128,
  160,
  192,
  224,
  256,
  320,
];

export const VBR_CHOICES = {
  VBR_METHOD_NONE: { value: 0, label: 'Constant Bit Rate' },
  VBR_METHOD_DEFAULT: { value: 1, label: 'Variable Bit Rate' },
  VBR_METHOD_ABR: { value: 2, label: 'Average Bit Rate' },
};
