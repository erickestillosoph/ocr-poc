.PHONY: client-start
client-start:
	@echo "🌱 Starting client..."
	cd client && npm run dev:start

.PHONY: server-start
server-start:
	@echo "🌱 Starting server..."
	cd server && npm run start:dev

.PHONY: server-install
server-install:
	@echo "🌱 Installing server..."
	cd server && npm install

.PHONY: client-install
client-install:
	@echo "🌱 Installing client..."
	cd client && npm install

