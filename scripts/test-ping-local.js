#!/usr/bin/env node

/**
 * Test script for ping functionality on local dev server
 * Usage: node scripts/test-ping-local.js
 */

const axios = require("axios");

const LOCAL_URL = "http://localhost:3000/schedule";

async function testPingLocal() {
  console.log("🏓 Testing ping functionality on local dev server...\n");

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
    console.log(`📡 Sending ping to: ${LOCAL_URL}`);
    const startTime = Date.now();

    const response = await axios.post(LOCAL_URL, pingPayload, {
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
      return true;
    } else {
      console.log("⚠️  Unexpected response - Check logs");
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing ping:");

    if (error.code === "ECONNREFUSED") {
      console.error(
        "🚨 Cannot connect to local server. Make sure 'vercel dev' is running!"
      );
    } else if (error.response) {
      console.error(`📊 Status: ${error.response.status}`);
      console.error(`📋 Response:`, error.response.data);
    } else {
      console.error(error.message);
    }

    return false;
  }
}

// Run the test
testPingLocal()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
