
SRC = $(shell find lib -name "*.js" -type f)
CSS = $(shell find lib -name "*.css" -type f)
TEST = $(shell find lib -name "test" -type d)
HTML = $(shell find lib -name "*.html" -type f)
TEMPLATES = $(HTML:.html=.js)

build: components $(SRC) $(TEMPLATES) $(CSS)
	@./node_modules/.bin/jshint $(SRC)
	@component build --prefix './' --copy #for app package --copy is needed

components: component.json
	@component install --dev

%.js: %.html
	@component convert $<

watch:
	supervisor --watch lib/ --extensions 'js|css|json|html' --no-restart-on exit --exec make build

test: build-dev
	@./node_modules/.bin/karma start

build-dev: components
	@component build --prefix './' --dev

clean:
	rm -fr build components package $(TEMPLATES)

package:
	@mkdir package/
	@cp -R build/ package/build/
	@cp index.html package/
	@cp manifest.webapp package/
	@cp manifest.appcache package/

.PHONY: clean test
