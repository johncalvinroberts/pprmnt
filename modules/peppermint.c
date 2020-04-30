#include <emscripten.h>
#include <stdlib.h>
#include <stdint.h>
#include <lame/lame.h>



typedef struct {
  lame_global_flags *lame;
} encoder_t;


typedef enum
{
	VBR_METHOD_NONE			=  0,
	VBR_METHOD_DEFAULT	=  1,
	VBR_METHOD_ABR			=  2
} vbrMethod_e;

EMSCRIPTEN_KEEPALIVE 
int encoder_destroy(encoder_t *enc) {
  if (!enc) return -1;
  if (enc->lame) free(enc->lame);
  free(enc);
  return 0;
}

EMSCRIPTEN_KEEPALIVE 
encoder_t *encoder_create(int rate, int channels, int bitrate, vbrMethod_e vbrMethod) {
  int ret;
  encoder_t *enc;

  if (rate <= 0) return NULL;
  if (channels != 1 && channels != 2) return NULL;
  if (bitrate < 0 || bitrate > 320) return NULL;

  enc = calloc(1, sizeof(*enc));
  if (!enc) return NULL;

  enc->lame = lame_init();
  if (!enc->lame) {
    encoder_destroy(enc);
    return NULL;
  }

  lame_set_in_samplerate(enc->lame, rate);
  lame_set_num_channels(enc->lame, channels);

  // only three options for VBR -- default, ABR, and none (which is CBR)
  switch (vbrMethod) {

  case VBR_METHOD_NONE:
      lame_set_VBR(enc->lame, vbr_off);
      break;

  case VBR_METHOD_ABR:
      lame_set_VBR(enc->lame, vbr_abr);
      break;
  // default to "default" VBR
  case VBR_METHOD_DEFAULT:
  default:
      lame_set_VBR(enc->lame, vbr_default); 
      break;                
  };

  lame_set_brate(enc->lame, bitrate);

  ret = lame_init_params(enc->lame);
  if (ret == -1) {
    encoder_destroy(enc);
    return NULL;
  }

  return enc;
}


EMSCRIPTEN_KEEPALIVE
ssize_t eencode(encoder_t *enc,  const float pcm_l[], const float pcm_r[], const int nsamples,
 unsigned char *mp3buf, const int mp3buf_size) {
  ssize_t ret;

  if (!enc) return -1;
  if (!pcm_l || !pcm_r) return -2;
  if (!nsamples) return -3;
  if (!mp3buf || !mp3buf_size) return -4;

  ret = lame_encode_buffer_ieee_float(enc->lame, pcm_l, pcm_r, nsamples, mp3buf, mp3buf_size);
  return ret;
}



EMSCRIPTEN_KEEPALIVE 
ssize_t encoder_flush(encoder_t *enc, uint8_t *out, int out_sz) {
  ssize_t ret;

  if (!enc) return -1;
  if (!out || !out_sz) return -2;

  ret = lame_encode_flush(enc->lame, out, out_sz);
  return ret;
}
