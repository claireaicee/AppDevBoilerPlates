# React + Laravel CRUD boilerplate

- `backend/`  Laravel API (`/api/tasks` CRUD, validation, CORS, tests, Dockerfile)
- `frontend/` React + Vite UI (list, add, edit, toggle, delete)
- `../render.yaml` Render Blueprint (Postgres + API + static site)

## Run locally

**Backend** (needs PHP 8.3+ and Composer)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve        # http://localhost:8000
php artisan test         # optional
```

**Frontend** (Node 20+)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

## Deploy on Render

1. Generate a key locally: `cd backend && php artisan key:generate --show`
2. Render dashboard -> **New + -> Blueprint** -> select this repo -> apply.
3. When prompted, fill in:
   - `APP_KEY` = the key from step 1
   - `FRONTEND_URL` = the static site URL (e.g. `https://appdev-web.onrender.com`)
   - `VITE_API_URL` = the API URL + `/api` (e.g. `https://appdev-api.onrender.com/api`)
   Service URLs depend on the names in `render.yaml`; if a name is taken Render adds a suffix, so check the real URLs, then update the values and redeploy.
4. Migrations run automatically on every API start.

Notes
- Free web services sleep after inactivity (first request ~30s); free Postgres expires after 30 days. Change `plan:` in `render.yaml` for production.
- The container uses `php artisan serve` for simplicity. For heavy traffic, swap in nginx + php-fpm or FrankenPHP.
- `VITE_API_URL` is baked in at build time; changing it requires a redeploy of the static site.

## Add a new resource

1. `php artisan make:model Post -mf` and `make:controller PostController --api`
2. Add `Route::apiResource('posts', PostController::class);` in `backend/routes/api.php`
3. Frontend: `export const posts = crud('/posts')` in `src/api.js`
