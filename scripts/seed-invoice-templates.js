const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsvweb';

const defaultTemplates = [
  {
    name: 'Web Development - Basic Package',
    type: 'invoice',
    items: [
      {
        description: 'Website Design & Development',
        quantity: 1,
        unitPrice: 2500.00
      },
      {
        description: 'Domain & Hosting Setup (1 year)',
        quantity: 1,
        unitPrice: 150.00
      },
      {
        description: 'SEO Optimization',
        quantity: 1,
        unitPrice: 500.00
      }
    ],
    taxRate: 10,
    currency: 'USD',
    terms: 'Payment due within 30 days of invoice date. Late payments may incur additional fees.',
    notes: 'Thank you for choosing our web development services. We look forward to working with you!',
    isDefault: true
  },
  {
    name: 'Web Development - Premium Package',
    type: 'invoice',
    items: [
      {
        description: 'Custom Website Design & Development',
        quantity: 1,
        unitPrice: 5000.00
      },
      {
        description: 'E-commerce Integration',
        quantity: 1,
        unitPrice: 1500.00
      },
      {
        description: 'Advanced SEO & Analytics Setup',
        quantity: 1,
        unitPrice: 800.00
      },
      {
        description: 'Content Management System',
        quantity: 1,
        unitPrice: 700.00
      },
      {
        description: 'Domain & Premium Hosting (1 year)',
        quantity: 1,
        unitPrice: 300.00
      }
    ],
    taxRate: 10,
    currency: 'USD',
    terms: 'Payment due within 30 days of invoice date. 50% deposit required before project start.',
    notes: 'Premium package includes ongoing support for 3 months post-launch.',
    isDefault: false
  },
  {
    name: 'Consulting Services - Hourly',
    type: 'invoice',
    items: [
      {
        description: 'Technical Consulting',
        quantity: 10,
        unitPrice: 150.00
      }
    ],
    taxRate: 8,
    currency: 'USD',
    terms: 'Payment due within 15 days of invoice date.',
    notes: 'Consulting hours can be used for technical advice, code review, or project planning.',
    isDefault: false
  },
  {
    name: 'Web Development Quote - Basic',
    type: 'quote',
    items: [
      {
        description: 'Responsive Website Design',
        quantity: 1,
        unitPrice: 1800.00
      },
      {
        description: 'Frontend Development (5 pages)',
        quantity: 1,
        unitPrice: 1200.00
      },
      {
        description: 'Contact Form Integration',
        quantity: 1,
        unitPrice: 300.00
      },
      {
        description: 'Basic SEO Setup',
        quantity: 1,
        unitPrice: 400.00
      }
    ],
    taxRate: 10,
    currency: 'USD',
    terms: 'Quote valid for 30 days. 50% deposit required to begin work.',
    notes: 'This quote includes responsive design, cross-browser compatibility, and basic SEO optimization.',
    isDefault: true
  },
  {
    name: 'E-commerce Development Quote',
    type: 'quote',
    items: [
      {
        description: 'E-commerce Website Design',
        quantity: 1,
        unitPrice: 3500.00
      },
      {
        description: 'Shopping Cart & Checkout System',
        quantity: 1,
        unitPrice: 2000.00
      },
      {
        description: 'Payment Gateway Integration',
        quantity: 1,
        unitPrice: 800.00
      },
      {
        description: 'Product Management System',
        quantity: 1,
        unitPrice: 1200.00
      },
      {
        description: 'Inventory Management',
        quantity: 1,
        unitPrice: 1000.00
      }
    ],
    taxRate: 10,
    currency: 'USD',
    terms: 'Quote valid for 45 days. Payment schedule: 40% deposit, 40% at milestone, 20% on completion.',
    notes: 'E-commerce solution includes SSL certificate, security features, and admin dashboard.',
    isDefault: false
  },
  {
    name: 'Mobile App Development Quote',
    type: 'quote',
    items: [
      {
        description: 'Mobile App UI/UX Design',
        quantity: 1,
        unitPrice: 2500.00
      },
      {
        description: 'iOS App Development',
        quantity: 1,
        unitPrice: 4000.00
      },
      {
        description: 'Android App Development',
        quantity: 1,
        unitPrice: 4000.00
      },
      {
        description: 'Backend API Development',
        quantity: 1,
        unitPrice: 3000.00
      },
      {
        description: 'App Store Deployment',
        quantity: 1,
        unitPrice: 500.00
      }
    ],
    taxRate: 10,
    currency: 'USD',
    terms: 'Quote valid for 60 days. Development timeline: 12-16 weeks.',
    notes: 'Includes cross-platform compatibility, API integration, and app store submission.',
    isDefault: false
  }
];

async function seedTemplates() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const collection = db.collection('invoicetemplates');
    
    // Check if templates already exist
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing templates. Skipping seed.`);
      console.log('To reseed, delete existing templates first.');
      return;
    }
    
    console.log('Inserting default templates...');
    const result = await collection.insertMany(defaultTemplates.map(template => ({
      ...template,
      createdAt: new Date(),
      updatedAt: new Date()
    })));
    
    console.log(`✅ Successfully inserted ${result.insertedCount} invoice templates`);
    console.log('Templates created:');
    defaultTemplates.forEach((template, index) => {
      console.log(`  ${index + 1}. ${template.name} (${template.type})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
}

// Run the seeder
if (require.main === module) {
  seedTemplates();
}

module.exports = { seedTemplates, defaultTemplates };
