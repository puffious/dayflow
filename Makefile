.PHONY: help setup build start stop logs clean check

help:
	@echo "🚀 Dayflow HRMS Commands"
	@echo "======================="
	@echo "make setup    - Install dependencies"
	@echo "make check    - Verify configuration"
	@echo "make build    - Build Docker images"
	@echo "make start    - Start all services"
	@echo "make stop     - Stop all services"
	@echo "make restart  - Restart all services"
	@echo "make logs     - View all logs"
	@echo "make clean    - Stop and remove containers"
	@echo "make backend  - View backend logs"
	@echo "make frontend - View frontend logs"

setup:
	./setup.sh

check:
	./check.sh

build:
	docker-compose build

start:
	docker-compose up -d

stop:
	docker-compose stop

restart:
	docker-compose restart

logs:
	docker-compose logs -f

backend:
	docker-compose logs -f backend

frontend:
	docker-compose logs -f frontend

clean:
	docker-compose down -v

ps:
	docker-compose ps

deploy: build start
	@echo "✅ Deployment complete!"
	@echo "Frontend: http://localhost"
	@echo "Backend: http://localhost:5000"
