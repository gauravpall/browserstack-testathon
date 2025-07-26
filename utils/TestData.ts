export const TestData = {
  users: {
    demouser: {
      username: 'demouser',
      password: 'testingisfun99',
      description: 'Standard demo user with full access',
      capabilities: ['login', 'browse', 'cart', 'checkout', 'orders', 'favorites'],
      restrictions: [],
      expectedIssues: []
    },
    image_not_loading_user: {
      username: 'image_not_loading_user',
      password: 'testingisfun99',
      description: 'User experiencing image loading issues',
      capabilities: ['login', 'browse', 'cart', 'checkout'],
      restrictions: [],
      expectedIssues: ['images_not_loading', 'visual_degradation']
    },
    existing_orders_user: {
      username: 'existing_orders_user',
      password: 'testingisfun99',
      description: 'User with existing order history',
      capabilities: ['login', 'browse', 'cart', 'checkout', 'view_orders'],
      restrictions: [],
      expectedIssues: []
    },
    locked_user: {
      username: 'locked_user',
      password: 'testingisfun99',
      description: 'User account that may be locked or restricted',
      capabilities: ['login_attempt'],
      restrictions: ['may_not_login', 'limited_access'],
      expectedIssues: ['login_failure', 'access_denied']
    },
    fav_user: {
      username: 'fav_user',
      password: 'testingisfun99',
      description: 'User with existing favorites/wishlist items',
      capabilities: ['login', 'browse', 'cart', 'checkout', 'view_favorites'],
      restrictions: [],
      expectedIssues: []
    },
    invalidUser: {
      username: 'nonexistentuser',
      password: 'wrongpassword',
      description: 'Invalid user for negative testing',
      capabilities: [],
      restrictions: ['invalid_credentials'],
      expectedIssues: ['login_failure']
    },
  },
  products: {
    iphone12Pro: {
      name: 'iPhone 12 Pro',
      price: '$999.00',
      installment: '5 x $ 199.80',
      id: '4'
    },
    iphone12ProMax: {
      name: 'iPhone 12 Pro Max',
      price: '$1099.00',
      installment: '9 x $ 122.11',
      id: '3'
    },
    iphone12: {
      name: 'iPhone 12',
      price: '$799.00',
      installment: '9 x $ 88.78',
      id: '1'
    },
    iphone12Mini: {
      name: 'iPhone 12 Mini',
      price: '$699.00',
      installment: '9 x $ 77.67',
      id: '2'
    },
    galaxyS20Ultra: {
      name: 'Galaxy S20 Ultra',
      price: '$1399.00',
      installment: '12 x $ 116.58',
      id: '12'
    }
  },
  urls: {
    signin: '/signin',
    demo: '/demo',
    cart: '/cart',
  },
  securityTests: {
    sqlInjection: "' OR '1'='1",
    xssPayload: '<script>alert("XSS")</script>',
  },
};

