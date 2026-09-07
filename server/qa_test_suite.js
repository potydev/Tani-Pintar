/**
 * Automated QA & Security Test Suite for TaniPintar
 * Comprehensive testing of all endpoints, authentication, RBAC,
 * data masking, marketplace operations, and AI resilience.
 */

const BASE_URL = 'http://127.0.0.1:5000';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runQA() {
  console.log('====================================================');
  console.log('  TaniPintar End-to-End QA & Security Test Suite');
  console.log('====================================================\n');

  // 1. Health Check
  console.log('[TEST GROUP 1: Health & Infrastructure]');
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    assert(res.status === 200 && data.status === 'ok', 'Server /api/health responds with 200 OK');
  } catch (e) {
    assert(false, `Server health check failed: ${e.message}`);
  }

  // 2. Authentication Security & Bypass Prevention
  console.log('\n[TEST GROUP 2: Security & Authentication Enforcement]');
  try {
    // 2.1 Unauthenticated call to protected endpoint
    const resNoAuth = await fetch(`${BASE_URL}/api/auth/me`);
    assert(resNoAuth.status === 401, 'Unauthenticated request to /api/auth/me is BLOCKED (401 Unauthorized)');

    // 2.2 Spoofed / fake JWT token
    const resSpoofed = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': 'Bearer fake_tampered_token_signature_xyz' }
    });
    assert(resSpoofed.status === 401, 'Tampered Bearer token without valid cryptographic signature is BLOCKED (401)');
  } catch (e) {
    assert(false, `Security check failed: ${e.message}`);
  }

  // 3. Verified Farmer Authentication & Token Verification (hidayat@tanipintar.id)
  console.log('\n[TEST GROUP 3: Verified Farmer Login & Data Integrity]');
  let farmerToken = null;
  try {
    const farmerLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hidayat@tanipintar.id', password: 'rahasia123' })
    });
    const farmerLoginData = await farmerLoginRes.json();
    assert(farmerLoginRes.status === 200 && farmerLoginData.success, 'Farmer login succeeds with credentials (hidayat@tanipintar.id)');
    assert(farmerLoginData.token && typeof farmerLoginData.token === 'string', 'Farmer login issues a cryptographic session token');
    assert(farmerLoginData.user?.role === 'verified_farmer', 'Farmer user object has role "verified_farmer"');
    assert(farmerLoginData.user?.full_name === 'Pak Hidayat Sugiono', 'Farmer user object has full_name "Pak Hidayat Sugiono"');
    farmerToken = farmerLoginData.token;

    // Call protected /api/auth/me with valid Bearer token
    const profileRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${farmerToken}` }
    });
    const profileData = await profileRes.json();
    assert(profileRes.status === 200 && profileData.success, 'Verified farmer can access /api/auth/me with Bearer token');
  } catch (e) {
    assert(false, `Farmer auth flow failed: ${e.message}`);
  }

  // 4. User Registration & Schema Protection
  console.log('\n[TEST GROUP 4: User Registration & Password Hashing]');
  const testEmail = `farmer.test.${Date.now()}@tanipintar.id`;
  let userToken = null;
  let testUserId = null;
  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'PasswordRahasia123!',
        full_name: 'Budi Santoso',
        farm_location: 'Malang, Jawa Timur',
        primary_commodity: 'Cabai Rawit Merah',
        land_size: '2 Hektar'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 200 && regData.success, 'New user registration SUCCEEDS without schema cache error');
    assert(regData.token && regData.user?.id, 'Registration returns signed token and user profile');
    userToken = regData.token;
    testUserId = regData.user?.id;

    // Test duplicate registration rejection
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'any',
        full_name: 'Dupe'
      })
    });
    assert(dupRes.status === 400, 'Duplicate registration is rejected with 400 Bad Request');
  } catch (e) {
    assert(false, `Registration flow failed: ${e.message}`);
  }

  // 5. User Login & Password Validation
  console.log('\n[TEST GROUP 5: User Login & Session Validation]');
  try {
    // Wrong password
    const wrongRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'WrongPassword999' })
    });
    assert(wrongRes.status === 401, 'Login with incorrect password correctly rejected (401)');

    // Correct password
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'PasswordRahasia123!' })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.success, 'Login with correct password SUCCEEDS');
    assert(loginData.token, 'Login issues a valid session token');
  } catch (e) {
    assert(false, `User login flow failed: ${e.message}`);
  }

  // 6. User Onboarding Flow
  console.log('\n[TEST GROUP 6: Onboarding Preferences]');
  try {
    const onbRes = await fetch(`${BASE_URL}/api/auth/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        farm_location: 'Banyuwangi, Jawa Timur',
        primary_commodity: 'Bawang Merah',
        land_size: '3 Hektar',
        role: 'farmer'
      })
    });
    const onbData = await onbRes.json();
    assert(onbRes.status === 200 && onbData.success, 'User onboarding preferences saved successfully');
    assert(onbData.user?.farm_location === 'Banyuwangi, Jawa Timur', 'Updated farm location is reflected');
  } catch (e) {
    assert(false, `Onboarding failed: ${e.message}`);
  }

  // 7. Farmer Seller Verification & KYC Data Masking
  console.log('\n[TEST GROUP 7: Farmer Seller Verification & PII Protection]');
  try {
    const upgradeRes = await fetch(`${BASE_URL}/api/auth/upgrade-seller`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        email: testEmail,
        full_name: 'Budi Santoso',
        farm_location: 'Cilacap, Jawa Tengah',
        primary_commodity: 'Cabai Merah Besar',
        land_size: '2 Hektar',
        nik: '3301051204850003',
        bank_name: 'BRI',
        account_number: '0123-01-045678-50-2',
        phone: '081399887766'
      })
    });
    const upgradeData = await upgradeRes.json();
    assert(upgradeRes.status === 200 && upgradeData.success, 'Farmer verification submission succeeds (200 OK)');
    assert(upgradeData.user?.role === 'verified_farmer', 'Account upgraded to "verified_farmer" role');
    assert(upgradeData.user?.nik && upgradeData.user.nik.includes('******'), `PII Protection: NIK is masked (${upgradeData.user?.nik})`);
  } catch (e) {
    assert(false, `Seller verification check failed: ${e.message}`);
  }

  // 8. Marketplace Product Creation & Listing
  console.log('\n[TEST GROUP 8: Marketplace Operations]');
  let createdProductId = null;
  try {
    // 8.1 Create Product
    const createProdRes = await fetch(`${BASE_URL}/api/marketplace/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        seller_id: testUserId,
        name: 'Cabai Rawit Merah Super QA',
        category: 'cabai',
        price: 45000,
        unit: 'kg',
        min_order: 20,
        stock: 500,
        description: 'Cabai rawit segar langsung dari panen kebun Banyuwangi, Grade A.',
        grade: 'Grade A',
        organic: true,
        location: 'Banyuwangi, Jawa Timur'
      })
    });
    const createProdData = await createProdRes.json();
    assert(createProdRes.status === 200 && createProdData.success, 'Seller product creation SUCCEEDS without tags column error');
    createdProductId = createProdData.data?.id;

    // 8.2 Get Products
    const listRes = await fetch(`${BASE_URL}/api/marketplace/products?limit=5`);
    const listData = await listRes.json();
    assert(listRes.status === 200 && Array.isArray(listData.data), 'Marketplace product listing returns 200 OK with product array');

    // 8.3 Get Product Detail
    if (createdProductId) {
      const detailRes = await fetch(`${BASE_URL}/api/marketplace/products/${createdProductId}`);
      const detailData = await detailRes.json();
      assert(detailRes.status === 200 && detailData.data?.name === 'Cabai Rawit Merah Super QA', 'Product detail endpoint returns correct item');
    }
  } catch (e) {
    assert(false, `Marketplace product test failed: ${e.message}`);
  }

  // 9. Marketplace Order Creation & Stock Management
  console.log('\n[TEST GROUP 9: Order Placement & Fulfillment]');
  let createdOrderId = null;
  try {
    if (createdProductId) {
      const orderRes = await fetch(`${BASE_URL}/api/marketplace/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          buyer_id: testUserId,
          product_id: createdProductId,
          quantity: 20,
          shipping_address: 'Jl. Pemuda No. 45, Surabaya',
          buyer_phone: '081298765432',
          payment_method: 'transfer'
        })
      });
      const orderData = await orderRes.json();
      assert(orderRes.status === 200 && orderData.success, 'Buyer order placement SUCCEEDS');
      createdOrderId = orderData.data?.order?.id;

      // Check stock decrement
      const detailAfterOrder = await (await fetch(`${BASE_URL}/api/marketplace/products/${createdProductId}`)).json();
      assert(detailAfterOrder.data?.stock === 480, 'Product stock was accurately decremented (500 - 20 = 480)');
    }

    // 9.2 Fetch My Orders
    const myOrdersRes = await fetch(`${BASE_URL}/api/marketplace/orders/my-orders?buyer_id=${testUserId}`);
    const myOrdersData = await myOrdersRes.json();
    assert(myOrdersRes.status === 200 && myOrdersData.success, 'Fetching user orders returns 200 OK');

    // 9.3 Update Order Status
    if (createdOrderId) {
      const patchRes = await fetch(`${BASE_URL}/api/marketplace/orders/${createdOrderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Dalam Pengiriman' })
      });
      const patchData = await patchRes.json();
      assert(patchRes.status === 200 && patchData.success, 'Order status update to "Dalam Pengiriman" SUCCEEDS');
    }
  } catch (e) {
    assert(false, `Order flow failed: ${e.message}`);
  }

  // 10. AI Chatbot Resiliency
  console.log('\n[TEST GROUP 10: TaniBot AI Market Consultant Resiliency]');
  try {
    const aiRes = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Berapa harga cabai merah hari ini dan kapan waktu jual terbaik?',
        userContext: {
          userName: 'Budi Santoso',
          location: 'Banyuwangi, Jawa Timur',
          commodity: 'Cabai Merah Besar'
        }
      })
    });
    const aiData = await aiRes.json();
    assert(aiRes.status === 200 && aiData.success, 'TaniBot AI Chatbot responds with 200 OK (no 500 error)');
    assert(aiData.reply && aiData.reply.length > 50, 'TaniBot provides detailed, structured market intelligence advice');
    assert(aiData.model && typeof aiData.model === 'string', `Response generated by engine: ${aiData.model}`);
  } catch (e) {
    assert(false, `AI Chatbot resiliency test failed: ${e.message}`);
  }

  // 11. Market Data & Commodity Recommendations
  console.log('\n[TEST GROUP 11: Real-time Prices & Arbitrase Recommendations]');
  try {
    const latestRes = await fetch(`${BASE_URL}/api/prices/latest`);
    const latestData = await latestRes.json();
    assert(latestRes.status === 200 && Array.isArray(latestData.data) && latestData.data.length > 0, 'Latest commodity prices returned');

    const recRes = await fetch(`${BASE_URL}/api/recommendations?commodity=Cabai+Merah&origin=Jawa+Timur`);
    const recData = await recRes.json();
    assert(recRes.status === 200 && Array.isArray(recData.data) && recData.data.length > 0, 'AI Market Arbitrage Recommendations returned with calculated profit margins');

    const demandRes = await fetch(`${BASE_URL}/api/demand/regional?commodity=Cabai+Merah`);
    const demandData = await demandRes.json();
    assert(demandRes.status === 200 && Array.isArray(demandData.data), 'Regional demand index returned');
  } catch (e) {
    assert(false, `Market data test failed: ${e.message}`);
  }

  // 12. Real-time Notifications Engine
  console.log('\n[TEST GROUP 12: Real-time Notifications Engine]');
  try {
    // 12.1 GET /api/notifications
    const notifRes = await fetch(`${BASE_URL}/api/notifications?email=test.farmer@tanipintar.id&commodity=Cabai+Merah`);
    const notifData = await notifRes.json();
    assert(notifRes.status === 200 && notifData.success, 'Notifications endpoint responds with 200 OK');
    assert(Array.isArray(notifData.data) && notifData.data.length > 0, 'Real market and order notifications generated');
    
    const sampleNotif = notifData.data[0];
    assert(sampleNotif.title && sampleNotif.message && sampleNotif.type, 'Notification object contains complete structured payload');

    // 12.2 PATCH /api/notifications/:id/read
    const markReadRes = await fetch(`${BASE_URL}/api/notifications/${encodeURIComponent(sampleNotif.id)}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test.farmer@tanipintar.id' })
    });
    const markReadData = await markReadRes.json();
    assert(markReadRes.status === 200 && markReadData.success, 'Mark single notification as read SUCCEEDS');

    // 12.4 Strict Order & Notification Isolation for New Accounts (Zero Stranger Orders Leakage)
    console.log('\n[TEST GROUP 12.4: Zero Stranger Orders Leakage on New Accounts]');
    const brandNewUserId = `new_user_${Date.now()}`;
    const brandNewEmail = `fresh_farmer_${Date.now()}@tanipintar.id`;

    // 1. Check orders for brand new user
    const newAccountOrdersRes = await fetch(`${BASE_URL}/api/marketplace/orders/my-orders?buyer_id=${brandNewUserId}&seller_id=${brandNewUserId}&email=${brandNewEmail}`);
    const newAccountOrders = await newAccountOrdersRes.json();
    assert(newAccountOrders.success, 'New account orders endpoint returns success');
    assert(Array.isArray(newAccountOrders.data?.buyerOrders) && newAccountOrders.data.buyerOrders.length === 0, 'New account has strictly 0 buyer orders (no stranger orders)');
    assert(Array.isArray(newAccountOrders.data?.sellerOrders) && newAccountOrders.data.sellerOrders.length === 0, 'New account has strictly 0 seller orders (no stranger orders)');

    // 2. Check notifications for brand new user
    const newAccountNotifRes = await fetch(`${BASE_URL}/api/notifications?email=${brandNewEmail}&user_id=${brandNewUserId}&commodity=Cabai+Merah`);
    const newAccountNotifData = await newAccountNotifRes.json();
    assert(newAccountNotifRes.status === 200 && newAccountNotifData.success, 'New account notifications endpoint returns 200 OK');
    
    // Ensure no stranger order notifications are leaked
    const leakedStrangerOrders = newAccountNotifData.data.filter(n => n.type === 'order' && n.id.startsWith('order_seller_'));
    const leakedStrangerBuyerOrders = newAccountNotifData.data.filter(n => n.type === 'order' && n.id.startsWith('order_buyer_'));
    assert(leakedStrangerOrders.length === 0, 'Zero stranger incoming sales leaked to new account in notifications');
    assert(leakedStrangerBuyerOrders.length === 0, 'Zero stranger purchases leaked to new account in notifications');

    // Ensure educational promo card is provided instead
    const orderPromo = newAccountNotifData.data.find(n => n.type === 'order');
    assert(orderPromo && orderPromo.id.startsWith('order_promo_'), 'Educational marketplace promo card is shown to new accounts instead of stranger orders');
  } catch (e) {
    assert(false, `Notification test failed: ${e.message}`);
  }

  console.log('\n====================================================');
  console.log(`  QA TEST RUN COMPLETE: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('====================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runQA();
