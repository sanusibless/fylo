<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Identity & Branding
    |--------------------------------------------------------------------------
    */
    'name' => env('APP_NAME', 'Fylo'),
    'tagline' => 'Cloud File Storage & Document Sharing Platform',
    'base_url' => rtrim(env('APP_URL', 'http://localhost:8000'), '/'),

    /*
    |--------------------------------------------------------------------------
    | Geographic & Business Context
    |--------------------------------------------------------------------------
    */
    'location' => [
        'city' => 'Abuja',
        'state' => 'Federal Capital Territory (FCT)',
        'country' => 'Nigeria',
        'full' => 'Abuja, Federal Capital Territory (FCT), Nigeria',
        'short' => 'Abuja, Nigeria',
    ],

    /*
    |--------------------------------------------------------------------------
    | Currency & Billing Configuration
    |--------------------------------------------------------------------------
    */
    'currency' => [
        'code' => 'NGN',
        'symbol' => '₦',
        'locale' => 'en-NG',
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Gateways Configuration
    |--------------------------------------------------------------------------
    */
    'payments' => [
        'default_gateway' => env('DEFAULT_PAYMENT_GATEWAY', 'moneta'),
        'yearly_discount_percentage' => 20,
        'paystack' => [
            'environment' => env('PAYSTACK_ENVIRONMENT', 'test'),
            'base_url' => env('PAYSTACK_BASE_URL', 'https://api.paystack.co'),
            'test_public_key' => env('PAYSTACK_TEST_PUBLIC_KEY'),
            'test_secret_key' => env('PAYSTACK_TEST_SECRET_KEY'),
            'live_public_key' => env('PAYSTACK_LIVE_PUBLIC_KEY'),
            'live_secret_key' => env('PAYSTACK_LIVE_SECRET_KEY'),
            'callback_url' => env('PAYSTACK_CALLBACK_URL'),
            'webhook_secret' => env('PAYSTACK_WEBHOOK_SECRET'),
        ],
        'moneta' => [
            'environment' => env('MONETA_ENVIRONMENT', 'test'),
            'base_url' => env('MONETA_BASE_URL'),
            'public_key' => env('MONETA_PUBLIC_KEY'),
            'secret_key' => env('MONETA_SECRET_KEY'),
            'callback_url' => env('MONETA_CALLBACK_URL'),
            'webhook_secret' => env('MONETA_WEBHOOK_SECRET'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Contact & Support Information
    |--------------------------------------------------------------------------
    */
    'contact' => [
        'support_email' => env('FYLO_SUPPORT_EMAIL', 'support@fylo.ng'),
        'sales_email' => env('FYLO_SALES_EMAIL', 'sales@fylo.ng'),
        'security_email' => env('FYLO_SECURITY_EMAIL', 'security@fylo.ng'),
        'privacy_email' => env('FYLO_PRIVACY_EMAIL', 'privacy@fylo.ng'),
        'phone' => env('FYLO_SUPPORT_PHONE', '+234 9 291 0482'),
        'hours' => 'Monday – Friday, 8:00 AM – 6:00 PM WAT',
    ],

    /*
    |--------------------------------------------------------------------------
    | Storage, Upload & Quota Configuration
    |--------------------------------------------------------------------------
    */
    'storage' => [
        'disk' => env('FYLO_STORAGE_DISK', 'local'),
        'default_free_capacity_gb' => 5,
        'default_max_file_size_mb' => 50,
        'trash_consumes_quota' => false,
        'allowed_extensions' => [
            // Images
            'jpg', 'jpeg', 'png', 'gif', 'webp',
            // Documents
            'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'md', 'json',
            // Video
            'mp4', 'mov', 'avi', 'webm',
            // Audio
            'mp3', 'wav', 'ogg', 'm4a',
            // Archives
            'zip', 'rar', '7z', 'tar', 'gz',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Subscription Plans (Single Source of Truth in NGN)
    |--------------------------------------------------------------------------
    */
    'plans' => [
        [
            'name' => 'Free',
            'slug' => 'free',
            'capacity' => '5',
            'price_monthly' => 0.00,
            'price_yearly' => 0.00,
            'currency' => 'NGN',
            'description' => 'Essential cloud storage for individuals in Abuja and across Nigeria getting started with digital document organization.',
            'features' => [
                '5 GB cloud storage quota',
                'Up to 50 MB per file upload',
                'Folder creation & hierarchical organization',
                'Direct user-to-user file sharing',
                'Public share links with expiration & password controls',
                'In-browser image, PDF, audio, video & text previews',
                'Recycle bin for deleted file recovery',
            ],
            'max_file_size_mb' => 50,
            'is_popular' => false,
            'is_active' => true,
        ],
        [
            'name' => 'Starter',
            'slug' => 'starter',
            'capacity' => '50',
            'price_monthly' => 15000.00,
            'price_yearly' => 144000.00,
            'currency' => 'NGN',
            'description' => 'Expanded storage capacity and higher upload limits for professionals and small businesses.',
            'features' => [
                '50 GB cloud storage quota',
                'Up to 250 MB per file upload',
                'Unlimited nested folders & color tags',
                'Direct user sharing & tokenized public links',
                'Password-protected & expiring share links',
                'In-browser media, PDF & text previews',
                'Full activity history & download tracking',
            ],
            'max_file_size_mb' => 250,
            'is_popular' => false,
            'is_active' => true,
        ],
        [
            'name' => 'Growth',
            'slug' => 'growth',
            'capacity' => '100',
            'price_monthly' => 20000.00,
            'price_yearly' => 192000.00,
            'currency' => 'NGN',
            'description' => 'High-capacity storage for growing teams, creative studios, and technical workflows.',
            'features' => [
                '100 GB cloud storage quota',
                'Up to 1,024 MB (1 GB) per file upload',
                'Unlimited nested folders & bulk file operations',
                'Password-protected & expiring public share links',
                'Direct user collaboration across accounts',
                'In-browser media, PDF & text previews',
                'Priority support from our Abuja technical team',
            ],
            'max_file_size_mb' => 1024,
            'is_popular' => true,
            'is_active' => true,
        ],
        [
            'name' => 'Business',
            'slug' => 'business',
            'capacity' => '250',
            'price_monthly' => 30000.00,
            'price_yearly' => 288000.00,
            'currency' => 'NGN',
            'description' => '250 GB enterprise capacity for organizations requiring large-scale document archiving and high upload limits.',
            'features' => [
                '250 GB cloud storage quota',
                'Up to 2,048 MB (2 GB) per file upload',
                'Unlimited nested folders & bulk management',
                'Password-protected & expiring public share links',
                'Comprehensive user activity & download logs',
                'In-browser media, PDF & document inspection',
                'Dedicated account & technical support',
            ],
            'max_file_size_mb' => 2048,
            'is_popular' => false,
            'is_active' => true,
        ],
    ],

];
