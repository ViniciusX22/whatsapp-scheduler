#!/usr/bin/env node

/**
 * Test script for ping functionality
 * Usage: node scripts/test-ping.js [url]
 */

const axios = require("axios");

const DEFAULT_URL = process.env.BASE_URL;

async function testPing(url = DEFAULT_URL) {
  console.log("🏓 Testing ping functionality...\n");

  const pingPayload = {
    data: {
      key: {
        id: `ping-test-${Date.now()}`,
        fromMe: true,
        remoteJid: "5511999999999@s.whatsapp.net", // Use same number for sender and remoteJid
      },
      message: {
        conversation: "/ping",
      },
    },
    sender: "5511999999999@s.whatsapp.net", // Must match remoteJid for "message to self"
    instance: "TestInstance",
  };

  try {
    console.log(`📡 Sending ping to: ${url}`);
    const startTime = Date.now();

    const response = await axios.post(url, pingPayload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    const responseTime = Date.now() - startTime;

    console.log(`✅ Response received in ${responseTime}ms`);
    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Response:`, JSON.stringify(response.data, null, 2));

    if (response.data.success && response.data.action === "ping") {
      console.log("🎉 Ping test SUCCESSFUL - All services are working!");
    } else {
      console.log("⚠️  Unexpected response - Check logs");
    }
  } catch (error) {
    console.error("❌ Ping test FAILED:");

    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    } else if (error.request) {
      console.error("   No response received - Network/timeout error");
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

// Run the test if called directly
if (require.main === module) {
  const url = process.argv[2];
  testPing(url).catch(console.error);
}

module.exports = { testPing };
