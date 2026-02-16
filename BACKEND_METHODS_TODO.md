# BACKEND_METHODS_TODO

Дата сверки: 2026-02-16  
Проект: `new_project`  
Базовый префикс API: `/api/v1`

Проверены источники:
- `new_project/src/modules/map/mapApi.ts`
- `new_project/src/modules/auth/authApi.ts`
- `new_project/src/modules/about/aboutApi.ts`
- `new_project/src/modules/publications/publicationsApi.ts`
- `new_project/src/modules/external-resources/externalResourcesApi.ts`
- `new_project/src/modules/support/supportApi.ts`
- `new_project/src/modules/admin/ui/AdminPanelPage.tsx`
- `new_project/src/modules/auth/ui/DownloadHistoryPage.tsx`
- `new_project/openapi.json`

Ниже только актуальные пункты: либо метода нет, либо функция сейчас работает на моках/локальных заглушках.

---

## 1. Критично для текущего фронта (при `VITE_USE_MOCKS=false`)

### M-01. `GET /api/v1/files/ground_data/get_chlorophyll_monthly_avg_file_link`
Статус: отсутствует в `openapi.json`, но вызывается фронтом (`mapApi.getChlorophyllFile`).

Назначение:
- вернуть относительный путь к GeoTIFF-файлу хлорофилла для скачивания.

Параметры запроса (`query`):
- `data_type`: `string`, обязательно, пример: `Озеро Байкал`
- `device`: `string`, обязательно, пример: `SENTINEL-2`
- `month_id`: `integer`, обязательно, диапазон `1..12`, пример: `8`

Пример вызова:
- `GET /api/v1/files/ground_data/get_chlorophyll_monthly_avg_file_link?data_type=Озеро%20Байкал&device=SENTINEL-2&month_id=8`

Ответ `200`:
- тип: `string`
- пример:
```json
"ground_data/chlorophyll/sentinel2/2025/08/chl_2025_08.tif"
```

---

### M-02. `POST /api/v1/support-ticket`
Статус: отсутствует в `openapi.json`, но вызывается фронтом (`supportApi.sendSupportTicket`).

Назначение:
- создать обращение в поддержку с опциональным файлом.

Тело запроса:
- тип: `multipart/form-data`
- поля:
  - `subject`: `string`, обязательно, пример: `Не загружается слой`
  - `description`: `string`, обязательно, пример: `При выборе даты 2025-08 карта пустая`
  - `email`: `string`, обязательно, пример: `user@example.com`
  - `file`: `binary`, необязательно

Пример вызова:
- `POST /api/v1/support-ticket`

Ответ `201`:
- тип:
```ts
interface SupportTicketCreateResponse {
  ticket_id: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string; // ISO datetime
}
```
- пример:
```json
{
  "ticket_id": "SUP-2026-000123",
  "status": "open",
  "created_at": "2026-02-16T12:30:11Z"
}
```

---

### M-03. `GET /api/v1/about-record`
Статус: отсутствует в `openapi.json`, но вызывается фронтом (`aboutApi.getAboutRecords`).

Назначение:
- получить список карточек страницы «О проекте».

Параметры:
- нет

Пример вызова:
- `GET /api/v1/about-record`

Ответ `200`:
- тип:
```ts
interface AboutRecord {
  id: string;
  title: string;
  description: string;
}
type AboutRecordListResponse = AboutRecord[];
```
- пример:
```json
[
  {
    "id": "about-1",
    "title": "Цель проекта",
    "description": "Мониторинг акватории озера Байкал по спутниковым и наземным данным."
  },
  {
    "id": "about-2",
    "title": "Ключевые возможности",
    "description": "Карты, сравнение дат, таймлайн, наземные данные, публикации."
  }
]
```

---

### M-04. `PATCH /api/v1/users/me`
Статус: отсутствует в `openapi.json`; в фронте сейчас локальная заглушка (`authApi.updateProfile` возвращает `501` вне моков).

Назначение:
- обновить профиль текущего пользователя.

Auth:
- `Bearer` обязателен

Тело запроса (`application/json`):
- тип:
```ts
interface UserProfileUpdateRequest {
  fio: string;
  login: string;
  mail: string;
  phone_number: string; // только цифры
  password?: string;
}
```
- пример:
```json
{
  "fio": "Иванов Иван Иванович",
  "login": "user",
  "mail": "user@example.com",
  "phone_number": "79001234567",
  "password": "newStrongPass123"
}
```

Ответ `200`:
- тип:
```ts
interface UserProfileResponse {
  fio: string;
  login: string;
  mail: string;
  phone_number: string;
  date_created: string; // YYYY-MM-DD
  roles: string[];
  locked: boolean;
}
```
- пример:
```json
{
  "fio": "Иванов Иван Иванович",
  "login": "user",
  "mail": "user@example.com",
  "phone_number": "79001234567",
  "date_created": "2025-10-02",
  "roles": ["Авторизованный пользователь"],
  "locked": false
}
```

---

### M-05. `GET /api/v1/users/me/download-history`
Статус: отсутствует; страница `DownloadHistoryPage` сейчас полностью на моках.

Назначение:
- вернуть историю скачиваний текущего пользователя.

Auth:
- `Bearer` обязателен

Параметры запроса (`query`):
- `page`: `integer`, необязательно, пример: `1`
- `limit`: `integer`, необязательно, пример: `20`

Пример вызова:
- `GET /api/v1/users/me/download-history?page=1&limit=20`

Ответ `200`:
- тип:
```ts
interface DownloadHistoryItem {
  id: number;
  date: string;   // YYYY-MM-DD HH:mm
  product: string;
  period: string;
  format: string; // например GeoTIFF
  size: string;   // например 58 MB
}
interface DownloadHistoryResponse {
  page: number;
  limit: number;
  total: number;
  items: DownloadHistoryItem[];
}
```
- пример:
```json
{
  "page": 1,
  "limit": 20,
  "total": 2,
  "items": [
    {
      "id": 1,
      "date": "2026-02-14 18:22",
      "product": "Температура поверхности (VIIRS)",
      "period": "2025-07",
      "format": "GeoTIFF",
      "size": "58 MB"
    },
    {
      "id": 2,
      "date": "2026-02-12 09:40",
      "product": "Landsat LST",
      "period": "2024-08-15",
      "format": "GeoTIFF",
      "size": "93 MB"
    }
  ]
}
```

---

### M-06. `POST /api/v1/users/me/download-history` (рекомендуется)
Статус: отсутствует; нужен, если бэк не пишет историю автоматически при выдаче file-link.

Назначение:
- добавить запись о скачивании.

Auth:
- `Bearer` обязателен

Тело запроса (`application/json`):
- тип:
```ts
interface DownloadHistoryCreateRequest {
  product: string;
  period: string;
  format: string;
  size: string;
}
```
- пример:
```json
{
  "product": "Хлорофилл (Sentinel-2)",
  "period": "2025-08",
  "format": "GeoTIFF",
  "size": "21 MB"
}
```

Ответ `201`:
- тип: `DownloadHistoryItem`
- пример:
```json
{
  "id": 45,
  "date": "2026-02-16 13:41",
  "product": "Хлорофилл (Sentinel-2)",
  "period": "2025-08",
  "format": "GeoTIFF",
  "size": "21 MB"
}
```

---

## 2. Методы для снятия заглушек админ-панели и редактирования контента (на будущее)

### M-07. `POST /api/v1/about-record`
Статус: отсутствует; нужен для админ-редактирования «О проекте».

Назначение:
- создать запись раздела «О проекте».

Тело запроса (`application/json`):
```json
{
  "title": "Новый раздел",
  "description": "Текст раздела"
}
```

Ответ `201` (тип `AboutRecord`):
```json
{
  "id": "about-3",
  "title": "Новый раздел",
  "description": "Текст раздела"
}
```

---

### M-08. `PUT /api/v1/about-record/{id}`
Статус: отсутствует.

Назначение:
- обновить запись «О проекте».

Параметры пути:
- `id`: `string`, обязательно, пример: `about-3`

Тело запроса (`application/json`):
```json
{
  "title": "Обновленный раздел",
  "description": "Обновленный текст"
}
```

Ответ `200` (тип `AboutRecord`):
```json
{
  "id": "about-3",
  "title": "Обновленный раздел",
  "description": "Обновленный текст"
}
```

---

### M-09. `DELETE /api/v1/about-record/{id}`
Статус: отсутствует.

Назначение:
- удалить запись «О проекте».

Параметры пути:
- `id`: `string`, обязательно, пример: `about-3`

Ответ:
- `204 No Content`

---

### M-10. `POST /api/v1/publications`
Статус: отсутствует в `openapi.json`; вызывается API-клиентом.

Назначение:
- создать публикацию.

Тело запроса (`application/json`):
```json
{
  "title": "Название публикации",
  "description": "Краткая аннотация",
  "authors": "И.И. Иванов, П.П. Петров",
  "url_path": "https://doi.org/10.1234/abcd"
}
```

Ответ `201`:
- тип:
```ts
interface PublicationDto {
  id: number;
  title: string;
  description: string;
  authors: string;
  url_path: string;
  url_server?: string | null;
}
```
- пример:
```json
{
  "id": 42,
  "title": "Название публикации",
  "description": "Краткая аннотация",
  "authors": "И.И. Иванов, П.П. Петров",
  "url_path": "https://doi.org/10.1234/abcd"
}
```

---

### M-11. `PUT /api/v1/publications/{publication_id}`
Статус: отсутствует.

Назначение:
- обновить публикацию.

Параметры пути:
- `publication_id`: `integer`, обязательно, пример: `42`

Тело запроса (`application/json`):
```json
{
  "title": "Обновленное название",
  "description": "Новая аннотация",
  "authors": "И.И. Иванов",
  "url_path": "https://example.org/new-url"
}
```

Ответ `200` (тип `PublicationDto`):
```json
{
  "id": 42,
  "title": "Обновленное название",
  "description": "Новая аннотация",
  "authors": "И.И. Иванов",
  "url_path": "https://example.org/new-url"
}
```

---

### M-12. `DELETE /api/v1/publications/{publication_id}`
Статус: отсутствует.

Назначение:
- удалить публикацию.

Параметры пути:
- `publication_id`: `integer`, обязательно, пример: `42`

Ответ:
- `204 No Content`

---

### M-13. `POST /api/v1/external-resources`
Статус: отсутствует; вызывается API-клиентом.

Назначение:
- создать внешний ресурс (карточка/слайдер).

Тело запроса:
- тип: `multipart/form-data`
- поля:
  - `title`: `string`, обязательно
  - `link`: `string`, обязательно
  - `image`: `binary`, необязательно

Пример ответа `201`:
```json
{
  "id": "resource-11",
  "title": "VEGA-Science",
  "link": "https://sci-vega.ru",
  "imageUrl": "https://cdn.example.org/resources/11.png"
}
```

---

### M-14. `PUT /api/v1/external-resources/{id}`
Статус: отсутствует.

Назначение:
- обновить внешний ресурс.

Параметры пути:
- `id`: `string`, обязательно, пример: `resource-11`

Тело запроса (`application/json`):
```json
{
  "id": "resource-11",
  "title": "VEGA-Science",
  "link": "https://sci-vega.ru",
  "imageUrl": "https://cdn.example.org/resources/11.png"
}
```

Ответ `200`:
```json
{
  "id": "resource-11",
  "title": "VEGA-Science",
  "link": "https://sci-vega.ru",
  "imageUrl": "https://cdn.example.org/resources/11.png"
}
```

---

### M-15. `DELETE /api/v1/external-resources/{id}`
Статус: отсутствует.

Назначение:
- удалить внешний ресурс.

Параметры пути:
- `id`: `string`, обязательно, пример: `resource-11`

Ответ:
- `204 No Content`

---

### M-16. `GET /api/v1/guide-sections`
Статус: отсутствует; руководство сейчас статическое.

Назначение:
- публично получить разделы руководства в порядке отображения.

Параметры:
- нет

Ответ `200`:
- тип:
```ts
interface GuideSection {
  id: string;
  title: string;
  content: string;
  order: number;
  updated_at: string; // ISO datetime
}
type GuideSectionListResponse = GuideSection[];
```
- пример:
```json
[
  {
    "id": "guide-1",
    "title": "Работа с картой",
    "content": "Пошаговое описание действий в интерфейсе...",
    "order": 1,
    "updated_at": "2026-02-16T12:41:00Z"
  }
]
```

---

### M-17. `GET /api/v1/admin/guide-sections`
Статус: отсутствует.

Назначение:
- админ-список разделов руководства (включая черновики, если есть).

Auth:
- `Bearer`, роль `Администратор`

Параметры:
- нет

Ответ `200`:
- тип: `GuideSection[]`
- пример:
```json
[
  {
    "id": "guide-1",
    "title": "Работа с картой",
    "content": "Полный текст...",
    "order": 1,
    "updated_at": "2026-02-16T12:41:00Z"
  }
]
```

---

### M-18. `POST /api/v1/admin/guide-sections`
Статус: отсутствует.

Назначение:
- создать раздел руководства.

Auth:
- `Bearer`, роль `Администратор`

Тело запроса (`application/json`):
```json
{
  "title": "Новый раздел",
  "content": "Текст раздела",
  "order": 10
}
```

Ответ `201` (тип `GuideSection`):
```json
{
  "id": "guide-10",
  "title": "Новый раздел",
  "content": "Текст раздела",
  "order": 10,
  "updated_at": "2026-02-16T13:00:00Z"
}
```

---

### M-19. `PUT /api/v1/admin/guide-sections/{id}`
Статус: отсутствует.

Назначение:
- обновить раздел руководства.

Параметры пути:
- `id`: `string`, обязательно, пример: `guide-10`

Тело запроса (`application/json`):
```json
{
  "title": "Новый раздел (обновлен)",
  "content": "Обновленный текст",
  "order": 9
}
```

Ответ `200` (тип `GuideSection`):
```json
{
  "id": "guide-10",
  "title": "Новый раздел (обновлен)",
  "content": "Обновленный текст",
  "order": 9,
  "updated_at": "2026-02-16T13:11:00Z"
}
```

---

### M-20. `DELETE /api/v1/admin/guide-sections/{id}`
Статус: отсутствует.

Назначение:
- удалить раздел руководства.

Параметры пути:
- `id`: `string`, обязательно, пример: `guide-10`

Ответ:
- `204 No Content`

---

### M-21. `GET /api/v1/admin/users`
Статус: отсутствует; блок пользователей в админке сейчас локальный.

Назначение:
- получить список пользователей для таблицы админ-панели.

Auth:
- `Bearer`, роль `Администратор`

Параметры запроса (`query`):
- `page`: `integer`, необязательно, пример: `1`
- `limit`: `integer`, необязательно, пример: `20`
- `search`: `string`, необязательно, пример: `ivanov`

Ответ `200`:
- тип:
```ts
interface AdminUser {
  id: string;
  fio: string;
  login: string;
  mail: string;
  phone_number: string;
  roles: string[];
  locked: boolean;
  date_created: string; // YYYY-MM-DD
}
interface AdminUsersResponse {
  page: number;
  limit: number;
  total: number;
  items: AdminUser[];
}
```
- пример:
```json
{
  "page": 1,
  "limit": 20,
  "total": 2,
  "items": [
    {
      "id": "u-1",
      "fio": "Администратор системы",
      "login": "admin",
      "mail": "admin@baikal.local",
      "phone_number": "70000000001",
      "roles": ["Администратор"],
      "locked": false,
      "date_created": "2026-01-01"
    }
  ]
}
```

---

### M-22. `POST /api/v1/admin/users`
Статус: отсутствует.

Назначение:
- создать пользователя из админки.

Auth:
- `Bearer`, роль `Администратор`

Тело запроса (`application/json`):
```json
{
  "fio": "Новый пользователь",
  "login": "new_user",
  "mail": "new_user@example.com",
  "phone_number": "79001234567",
  "password": "strongPass123",
  "roles": ["Авторизованный пользователь"]
}
```

Ответ `201` (тип `AdminUser`):
```json
{
  "id": "u-3",
  "fio": "Новый пользователь",
  "login": "new_user",
  "mail": "new_user@example.com",
  "phone_number": "79001234567",
  "roles": ["Авторизованный пользователь"],
  "locked": false,
  "date_created": "2026-02-16"
}
```

---

### M-23. `PATCH /api/v1/admin/users/{id}`
Статус: отсутствует.

Назначение:
- редактировать карточку пользователя (без изменения ролей).

Параметры пути:
- `id`: `string`, обязательно, пример: `u-3`

Тело запроса (`application/json`):
```json
{
  "fio": "Новый пользователь (обновлено)",
  "login": "new_user",
  "mail": "new_user@example.com",
  "phone_number": "79001234568"
}
```

Ответ `200` (тип `AdminUser`):
```json
{
  "id": "u-3",
  "fio": "Новый пользователь (обновлено)",
  "login": "new_user",
  "mail": "new_user@example.com",
  "phone_number": "79001234568",
  "roles": ["Авторизованный пользователь"],
  "locked": false,
  "date_created": "2026-02-16"
}
```

---

### M-24. `PATCH /api/v1/admin/users/{id}/role`
Статус: отсутствует.

Назначение:
- изменить роли пользователя.

Параметры пути:
- `id`: `string`, обязательно, пример: `u-3`

Тело запроса (`application/json`):
```json
{
  "roles": ["Администратор"]
}
```

Ответ `200`:
```json
{
  "id": "u-3",
  "roles": ["Администратор"]
}
```

---

### M-25. `PATCH /api/v1/admin/users/{id}/lock`
Статус: отсутствует.

Назначение:
- блокировать/разблокировать пользователя.

Параметры пути:
- `id`: `string`, обязательно, пример: `u-3`

Тело запроса (`application/json`):
```json
{
  "locked": true
}
```

Ответ `200`:
```json
{
  "id": "u-3",
  "locked": true
}
```

---

### M-26. `DELETE /api/v1/admin/users/{id}`
Статус: отсутствует.

Назначение:
- удалить пользователя.

Параметры пути:
- `id`: `string`, обязательно, пример: `u-3`

Ответ:
- `204 No Content`

---

### M-27. `GET /api/v1/admin/roles`
Статус: отсутствует.

Назначение:
- отдать список доступных ролей для селектов админки.

Параметры:
- нет

Ответ `200`:
- тип: `string[]`
- пример:
```json
[
  "Администратор",
  "Авторизованный пользователь"
]
```

---

## 3. Существующие методы, где нужно зафиксировать контракт (не добавлять моки)

Эти методы в Swagger есть, но сейчас схемы ответов в основном пустые (`{}`) или не совпадают с тем, что ожидает фронт.

### C-01. `GET /api/v1/publications/`
Назначение:
- список публикаций для страницы «Публикации».

Параметры (`query`):
- `search`: `string`, необязательно, пример: `байкал`

Ответ `200`:
- тип: `PublicationDto[]`
```json
[
  {
    "id": 1,
    "title": "Мониторинг Байкала",
    "description": "Аннотация",
    "authors": "И.И. Иванов",
    "url_path": "https://doi.org/10.1234/abcd",
    "url_server": null
  }
]
```

---

### C-02. `GET /api/v1/external_resources/get_resources`
Назначение:
- список внешних ресурсов для слайдера.

Ответ `200`:
- допускаются поля из разных старых версий, но минимум должен восстанавливаться в:
  - `id`
  - `title` или `name_service`
  - `link` или `url_reference`/`resource_url`/`href`
  - `imageUrl` или `image_url`/`image`/`preview`/`thumbnail`

Пример стабильного ответа:
```json
[
  {
    "id": "resource-1",
    "title": "VEGA-Science",
    "link": "https://sci-vega.ru",
    "imageUrl": "https://cdn.example.org/resources/vega.png"
  }
]
```

---

### C-03. Методы выдачи тайлов (нужен единый формат ответа)
Список:
- `GET /api/v1/files/satellite_data/get_landsat_tiles`
- `GET /api/v1/files/satellite_data/get_monthly_avg_tiles`
- `GET /api/v1/files/satellite_data/get_monthly_avg_many_years_tiles`
- `GET /api/v1/files/ground_data/get_chlorophyll_monthly_avg_tiles`

Фронт ожидает:
```ts
interface TileLinkResponse {
  link: string;
  min_temp?: number; // либо min
  max_temp?: number; // либо max
  min?: number;
  max?: number;
}
```

Пример ответа `200`:
```json
{
  "link": "satellite_data/tiles/monthly_avg/viirs/2025/08/{z}/{x}/{y}.png",
  "min_temp": 3.4,
  "max_temp": 18.7
}
```

---

### C-04. Методы доступных дат (нужен строгий формат строк)
Список и ожидаемые форматы:
- `GET /api/v1/files/satellite_data/get_available_dates_landsat` -> `YYYY-MM-DD[]`
- `GET /api/v1/files/satellite_data/get_available_dates_monthly_avg` -> `YYYY-MM[]`
- `GET /api/v1/files/satellite_data/get_available_dates_monthly_avg_many_years` -> `MM[]`
- `GET /api/v1/files/ground_data/get_available_dates_chlorophyll` -> `MM[]`
- `GET /api/v1/files/ground_data/get_available_dates` -> `YYYY-MM-DD[]`

Пример ответа:
```json
["2025-07-12", "2025-07-13", "2025-07-14"]
```

---

## 4. Совместимость маршрутов (чтобы не ломать фронт без рефакторинга)

### A-01. Alias для About
Сейчас фронт работает с `GET /api/v1/about-record`, а в Swagger есть `GET /api/v1/about/`.

Требование:
- поддержать `GET /api/v1/about-record` (как отдельный метод или алиас к `/api/v1/about/`).

---

### A-02. Alias для External Resources
Сейчас чтение идет через snake_case, запись через kebab-case:
- чтение: `/api/v1/external_resources/get_resources`
- запись: `/api/v1/external-resources/*`

Требование:
- поддерживать оба варианта до унификации фронта.

---

### A-03. `GET /api/v1/users/refresh` (опционально)
Сейчас во фронте есть fallback: сначала `POST /users/refresh`, потом `GET /users/refresh`.

Варианты:
- либо поддержать `GET /api/v1/users/refresh` с тем же форматом токенов,
- либо убрать fallback из фронта и оставить только `POST`.

Формат ответа токенов:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```