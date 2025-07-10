# doc-to-readable Makefile

.PHONY: test test-watch build-demo deploy-demo clean help

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
	@echo "Running tests..."
	node --experimental-vm-modules ./node_modules/.bin/jest src/__tests__/

# Run tests in watch mode
test-watch:
	@echo "Running tests in watch mode..."
	node --experimental-vm-modules ./node_modules/.bin/jest src/__tests__/ --watch

# Run standalone fetch-html test
test-standalone:
	@echo "Running standalone fetch-html test..."
	node src/__tests__/fetch-html-standalone-test.js

# Build the demo app
build-demo:
	@echo "Building demo app..."
	cd demo && npm run build

# Deploy demo to GitHub Pages
deploy-demo: build-demo
	@echo "Deploying demo to GitHub Pages..."
	git add docs
	git commit -m "chore: deploy demo to GitHub Pages" || true
	git push

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf docs demo/dist
	rm -f *.tgz

# Bump version and publish to npm
publish:
	@echo "Bumping version and publishing to npm..."
	npm version patch -m "chore: bump version for release"
	git push --follow-tags
	npm publish 