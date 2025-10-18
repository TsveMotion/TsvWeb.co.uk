const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/blog?status=published',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('=== API RESPONSE ===');
      console.log(`Total posts returned: ${response.posts?.length || 0}`);
      console.log('\nPosts:');
      response.posts?.forEach((post, index) => {
        console.log(`\n${index + 1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Status: ${post.status}`);
      });
    } catch (error) {
      console.error('Error parsing response:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  console.log('\nMake sure dev server is running: npm run dev');
});

req.end();
