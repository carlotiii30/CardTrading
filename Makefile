.DEFAULT_GOAL := help
.PHONY: help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

start: ## Run backend
	cd backend && yarn start

run: ## Run server
	cd frontend && yarn serve

install: ## Install dependencies
	cd backend && yarn install

test: ## Run tests
	cd backend && NODE_ENV=test && yarn test

sync: ## Sync database
	cd backend && yarn sync