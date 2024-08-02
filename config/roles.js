export const roles = [
    {
        role: 'admin',
        permissions: [
            'create_product',
            // 'read_product',
            'delete_product',
            'update_product',
            'update_user',
            'delete_user',
            'update_profile',
            'delete_profile'
        ]
    },
    {
        role: 'vendor',
        permissions: [
            'create_product',
            // 'read_product',
            'delete_product',
            'update_product',
            'update_profile',
            'delete_profile'
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