#include <emscripten.h>
#include <stdbool.h>
#include <stdlib.h>
#include <stdint.h>
#include <lame/lame.h>

#define MAX_SAMPLES 65536
#define PCM_BUF_SIZE MAX_SAMPLES * sizeof(float)
#define BUF_SIZE (MAX_SAMPLES * 1.25 + 7200)

typedef struct {
  // Public fields.
  float *pcm_left;
  float *pcm_right;
  uint8_t *outbuf;
  bool stereo;
  // Private fields. Should not be touched by API user.
  lame_global_flags *gfp;
} lamejs;

void lamejs_free(lamejs *v);

EMSCRIPTEN_KEEPALIVE
int fib(int n) {
  int i, t, a = 0, b = 1;
  for (i = 0; i < n; i++) {
    t = a + b;
    a = b;
    b = t;
  }
  return b;
}

EMSCRIPTEN_KEEPALIVE
int lamejs_encode(lamejs *v, int nsamples) {
  if (nsamples > MAX_SAMPLES)
    return -1;

  int n = lame_encode_buffer_ieee_float(v->gfp, v->pcm_left, v->pcm_right, nsamples, v->outbuf, BUF_SIZE);
  return n;
}
