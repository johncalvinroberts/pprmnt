install:
	docker pull trzeci/emscripten
build-wasm:
	bash ./scripts/build-wasm.sh
