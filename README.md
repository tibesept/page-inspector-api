# 🛠️ Page Analyzer API

API, построенный на Node.js и Express. Использует PostgreSQL для хранения данных и RabbitMQ для управления очередями задач.

## 📋 Содержание

- [🛠️ Стек](#stack)
- [⚙️ Требования](#requirements)
- [🚀 Быстрый старт](#quick-start)
- [▶️ Запуск и остановка](#run)
    - [В режиме разработки (DEV)](#dev)
    - [В продакшн-режиме (PROD)](#prod)
    - [Остановка](#stop)
- [📜 Просмотр логов](#logs)
- [📄 Лицензия](#license)

<a id="stack"></a>
## 🛠️ Стек

  Node.js (v22.2.0), TypeScript
* **Backend:** Express  
* **ORM:** Prisma  
* **База данных:** PostgreSQL  
* **Брокер сообщений:** RabbitMQ  
* **Контейнеризация:** Docker, Docker Compose

<a id="requirements"></a>
## ⚙️ Требования

Для запуска проекта должны быть установлены:

* [Git](https://git-scm.com/)  
* [Docker](https://www.docker.com/) (версия 20.10+)  
* [Docker Compose](https://docs.docker.com/compose/) (версия 2.10+)

✅ **Проверено на:** Docker Engine 27.0.3

💡 **Примечание:** Установка Node.js на локальную машину не требуется, так как проект полностью работает внутри Docker-контейнеров.

<a id="quick-start"></a>
## 🚀 Быстрый старт

1. **Склонируйте репозиторий** 

2. **Создайте и настройте `.env`**  
   Скопируйте файл `.env-example`
   ```bash
   cp .env-example .env
   ```
   Настройте значения

<a id="run"></a>
## ▶️ Запуск и остановка

<a id="dev"></a>
### **В режиме разработки (DEV)**

Запуск с hot-reload и логами в debug режиме
```bash
docker compose up --build -d
```
<a id="prod"></a>
### **В продакшн-режиме (PROD)**

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

<a id="stop"></a>
### **Остановка**

```bash
docker compose down
```

<a id="logs"></a>
## 📜 Просмотр логов

Чтобы отслеживать логи конкретного сервиса в реальном времени:

```bash
# Логи API
docker compose logs -f api

# Логи PostgreSQL  
docker compose logs -f postgres

# Логи RabbitMQ  
docker compose logs -f rabbitmq
```

<a id="license"></a>
## **📄 Лицензия**

Все права на данный проект защищены. Использование и распространение в коммерческих или личных целях без предварительного письменного разрешения автора запрещено.
