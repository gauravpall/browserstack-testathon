export const TestData = {
  users: {
    validUser: {
      username: 'demouser',
      password: 'testingisfun99',
    },
    lockedUser: {
      username: 'locked_user',
      password: 'anypassword',
    },
    invalidUser: {
      username: 'nonexistentuser',
      password: 'wrongpassword',
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

