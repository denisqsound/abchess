-include .env
.EXPORT_ALL_VARIABLES:


run:
	npx playwright test  ; npx playwright show-report