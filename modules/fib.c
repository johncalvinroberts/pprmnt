#include <emscripten.h>
#include <stdbool.h>
#include <stdlib.h>
#include <stdint.h>
#include <lame/lame.h>

#define MAX_SAMPLES 65536
#define PCM_BUF_SIZE MAX_SAMPLES * sizeof(float)
#define BUF_SIZE (MAX_SAMPLES * 1.25 + 7200)

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
