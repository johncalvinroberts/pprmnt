install:
	docker pull johncalvinroberts/emscripten-lame
	yarn
build-docker:
	bash ./scripts/build-docker.sh
build-wasm:
	bash ./scripts/build-wasm.sh

clean-build:
	rm -rf dist \
	rm -rf .cache
clean-artifacts:
	rm -rf modules/artifacts/*.js\
	rm -rf modules/artifacts/*.wasm

noop:
	echo "No operation performed."

clean: clean-artifacts clean-build
