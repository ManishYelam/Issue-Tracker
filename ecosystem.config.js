module.exports = {
  apps: [
    {
      name: 'main-server',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.MAIN_SERVER_PORT,
      },
    },
    {
      name: 'pharmacy',
      script: './src/api/departments/pharmacy/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PHARMACY_PORT,
      },
    },
    {
      name: 'logistics',
      script: './src/api/departments/logistics/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.LOGISTICS_PORT,
      },
    },
    {
      name: 'customer-support',
      script: './src/api/departments/customer-support/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.CUSTOMER_SUPPORT_PORT,
      },
    },
    {
      name: 'sales-marketing',
      script: './src/api/departments/sales-marketing/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.SALES_MARKETING_PORT,
      },
    },
    {
      name: 'finance-accounting',
      script: './src/api/departments/finance-accounting/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.FINANCE_ACCOUNTING_PORT,
      },
    },
    {
      name: 'compliance-legal',
      script: './src/api/departments/compliance-legal/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.COMPLIANCE_LEGAL_PORT,
      },
    },
    {
      name: 'healthcare',
      script: './src/api/departments/healthcare/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.HEALTHCARE_PORT,
      },
    },
    {
      name: 'it-development',
      script: './src/api/departments/it-development/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.IT_DEVELOPMENT_PORT,
      },
    },
    {
      name: 'inventory-management',
      script: './src/api/departments/inventory-management/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.INVENTORY_MANAGEMENT_PORT,
      },
    },
    {
      name: 'data-analytics',
      script: './src/api/departments/data-analytic/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.DATA_ANALYTICS_PORT,
      },
    },
    {
      name: 'hr',
      script: './src/api/departments/human-resource/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.HR_PORT,
      },
    },
    {
      name: 'partnerships',
      script: './src/api/departments/partnerships/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PARTNERSHIPS_PORT,
      },
    },
  ],
};
