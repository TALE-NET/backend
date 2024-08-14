export const roles = [
    {
        role: 'admin',
        permissions: [
            'create_product',
            'delete_product',
            'update_product',
            'create_event',
            'delete_event',
            'update_event',
            'create_company',
            'delete_company',
            'update_company',
            'create_gallery',
            'delete_gallery',
            'update_gallery',
            'update_profile',
            'delete_profile',
            'update_user',
            'delete_user',
        ]
    },
    {
        role: 'vendor',
        permissions: [
            'create_product',
            'delete_product',
            'update_product',
            'create_event',
            'delete_event',
            'update_event',
            'create_company',
            'delete_company',
            'update_company',
            'update_profile',
            // 'delete_profile'
        ]
    },
    {
        role: 'user',
        permissions: [
            'update_profile',
            'delete_profile'
        ]
    }
];