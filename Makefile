# doc-to-readable Makefile

.PHONY: test test-watch test-standalone test-benchmark build deploy clean publish

# Default target
help:
	@echo "Available commands:"
	@echo "  test        - Run all tests"
	@echo "  test-watch  - Run tests in watch mode"
	@echo "  test-standalone - Run standalone fetch-html test"
	@echo "  build-demo  - Build the demo app"
	@echo "  deploy-demo - Build and deploy demo to GitHub Pages"
	@echo "  clean       - Clean build artifacts"
	@echo "  publish     - Bump version and publish to npm"
	@echo "  help        - Show this help message"

# Run all tests
test:
	npm test

# Run tests in watch mode
test-watch:
	npm run test:watch

# Run standalone test
test-standalone:
	npm run test:standalone

# Run benchmark tests
test-benchmark:
	npm run test:benchmark

# Build the demo
build:
	cd demo && npm run build

# Deploy demo to GitHub Pages
deploy: build
	cd demo && git add docs/ && git commit -m "Update demo build" && git push

# Clean build artifacts
clean:
	rm -rf demo/docs/
	rm -rf node_modules/
	rm -rf demo/node_modules/

# Publish to npm
publish:
	npm version patch
	npm publish 