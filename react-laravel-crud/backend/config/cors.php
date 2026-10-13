<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    // Comma-separated in FRONTEND_URL, e.g. "https://my-app.onrender.com,http://localhost:5173"
    'allowed_origins' => array_values(array_filter(array_map('trim', explode(',', env('FRONTEND_URL', 'http://localhost:5173'))))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
