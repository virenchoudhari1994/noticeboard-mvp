#!/usr/bin/env node

/**
 * Noticeboard MVP - Core Flow Testing Script
 * 
 * This script helps validate the core user flows before pilot launch.
 * Run this after deployment to ensure all critical paths work correctly.
 */

const https = require('https');
const fs = require('fs');

// Configuration
const BASE_URL = process.env.BASE_URL || 'https://your-vercel-domain.vercel.app';
const TEST_EMAIL = 'test@example.com';

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test functions
async function testHomePage() {
  console.log('🧪 Testing home page...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    
    if (response.statusCode === 200) {
      addResult('Home Page', true, 'Page loads successfully');
    } else {
      addResult('Home Page', false, `Status code: ${response.statusCode}`);
    }
  } catch (error) {
    addResult('Home Page', false, error.message);
  }
}

async function testAuthPages() {
  console.log('🧪 Testing authentication pages...');
  
  const authPages = [
    '/auth/signin',
    '/auth/signup'
  ];
  
  for (const page of authPages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page}`);
      
      if (response.statusCode === 200) {
        addResult(`Auth Page: ${page}`, true, 'Page loads successfully');
      } else {
        addResult(`Auth Page: ${page}`, false, `Status code: ${response.statusCode}`);
      }
    } catch (error) {
      addResult(`Auth Page: ${page}`, false, error.message);
    }
  }
}

async function testAPIEndpoints() {
  console.log('🧪 Testing API endpoints...');
  
  const apiEndpoints = [
    '/api/candidates/search',
    '/api/contacts/request',
    '/api/stripe/create-checkout',
    '/api/verification/request'
  ];
  
  for (const endpoint of apiEndpoints) {
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // API endpoints should return 401 for unauthenticated requests
      if (response.statusCode === 401 || response.statusCode === 405) {
        addResult(`API Endpoint: ${endpoint}`, true, 'Properly protected endpoint');
      } else {
        addResult(`API Endpoint: ${endpoint}`, false, `Unexpected status: ${response.statusCode}`);
      }
    } catch (error) {
      addResult(`API Endpoint: ${endpoint}`, false, error.message);
    }
  }
}

async function testCandidatePages() {
  console.log('🧪 Testing candidate pages...');
  
  const candidatePages = [
    '/candidate/profile',
    '/verification/request',
    '/verification/status'
  ];
  
  for (const page of candidatePages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page}`);
      
      // These pages should redirect to auth if not logged in
      if (response.statusCode === 200 || response.statusCode === 302) {
        addResult(`Candidate Page: ${page}`, true, 'Page accessible or properly redirected');
      } else {
        addResult(`Candidate Page: ${page}`, false, `Status code: ${response.statusCode}`);
      }
    } catch (error) {
      addResult(`Candidate Page: ${page}`, false, error.message);
    }
  }
}

async function testEmployerPages() {
  console.log('🧪 Testing employer pages...');
  
  const employerPages = [
    '/employer/search',
    '/employer/billing'
  ];
  
  for (const page of employerPages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page}`);
      
      // These pages should redirect to auth if not logged in
      if (response.statusCode === 200 || response.statusCode === 302) {
        addResult(`Employer Page: ${page}`, true, 'Page accessible or properly redirected');
      } else {
        addResult(`Employer Page: ${page}`, false, `Status code: ${response.statusCode}`);
      }
    } catch (error) {
      addResult(`Employer Page: ${page}`, false, error.message);
    }
  }
}

async function testAdminPages() {
  console.log('🧪 Testing admin pages...');
  
  const adminPages = [
    '/admin/verification'
  ];
  
  for (const page of adminPages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page}`);
      
      // Admin pages should redirect to auth if not logged in
      if (response.statusCode === 200 || response.statusCode === 302) {
        addResult(`Admin Page: ${page}`, true, 'Page accessible or properly redirected');
      } else {
        addResult(`Admin Page: ${page}`, false, `Status code: ${response.statusCode}`);
      }
    } catch (error) {
      addResult(`Admin Page: ${page}`, false, error.message);
    }
  }
}

async function testStripeWebhook() {
  console.log('🧪 Testing Stripe webhook endpoint...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': 'test-signature'
      },
      body: JSON.stringify({
        type: 'test.event',
        data: { object: {} }
      })
    });
    
    // Webhook should return 400 for invalid signature
    if (response.statusCode === 400) {
      addResult('Stripe Webhook', true, 'Properly validates webhook signature');
    } else {
      addResult('Stripe Webhook', false, `Unexpected status: ${response.statusCode}`);
    }
  } catch (error) {
    addResult('Stripe Webhook', false, error.message);
  }
}

// Helper function to add test results
function addResult(testName, passed, message) {
  results.tests.push({
    name: testName,
    passed,
    message,
    timestamp: new Date().toISOString()
  });
  
  if (passed) {
    results.passed++;
    console.log(`✅ ${testName}: ${message}`);
  } else {
    results.failed++;
    console.log(`❌ ${testName}: ${message}`);
  }
}

// Generate test report
function generateReport() {
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  console.log(`Total Tests: ${results.tests.length}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);
  
  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter(test => !test.passed)
      .forEach(test => {
        console.log(`  - ${test.name}: ${test.message}`);
      });
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: {
      total: results.tests.length,
      passed: results.passed,
      failed: results.failed,
      successRate: (results.passed / results.tests.length) * 100
    },
    tests: results.tests
  };
  
  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to test-report.json');
  
  // Return exit code
  return results.failed === 0 ? 0 : 1;
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Noticeboard MVP Flow Tests');
  console.log(`📍 Testing against: ${BASE_URL}`);
  console.log('=====================================\n');
  
  try {
    await testHomePage();
    await testAuthPages();
    await testAPIEndpoints();
    await testCandidatePages();
    await testEmployerPages();
    await testAdminPages();
    await testStripeWebhook();
    
    console.log('\n' + '='.repeat(50));
    const exitCode = generateReport();
    
    if (exitCode === 0) {
      console.log('\n🎉 All tests passed! Ready for pilot launch.');
    } else {
      console.log('\n⚠️  Some tests failed. Please fix issues before pilot launch.');
    }
    
    process.exit(exitCode);
    
  } catch (error) {
    console.error('💥 Test runner error:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testHomePage,
  testAuthPages,
  testAPIEndpoints,
  testCandidatePages,
  testEmployerPages,
  testAdminPages,
  testStripeWebhook
};
