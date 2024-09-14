install:
	docker pull johncalvinroberts/emscripten-lame
	yarn
build-docker:
	bash ./scripts/build-docker.sh
build-wasm:
	bash ./scripts/build-wasm.sh

clean-build:
	rm -rf dist \
	rm -rf .cache \
	# modifies react-snap defaultOptions to add the --no-sandbox and --disable-setuid-sandbox flags so that puppeteer/chromium can run in the codebuild standard image
	sed -i "s/puppeteerArgs: \[\],/puppeteerArgs: \[\"--no-sandbox\", \"--disable-setuid-sandbox\"\],/" ./node_modules/react-snap/index.js \
	echo changed arguments in react-snap
clean-artifacts:
	rm -rf modules/artifacts/*.js\
	rm -rf modules/artifacts/*.wasm
clean: clean-artifacts clean-build
