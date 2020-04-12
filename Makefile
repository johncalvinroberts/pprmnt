install:
	docker pull johncalvinroberts/emscripten-lame
build-docker:
	bash ./scripts/build-docker.sh
build-wasm:
	bash ./scripts/build-wasm.sh
clean:
	rm -rf modules/artifacts/*.js
	rm -rf modules/artifacts/*.wasm
	rm -rf dist
