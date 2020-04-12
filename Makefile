install:
	docker pull johncalvinroberts/emscripten-lame
build-docker:
	bash ./scripts/build-docker.sh
build-wasm:
	bash ./scripts/build-wasm.sh
