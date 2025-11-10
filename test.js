import axios from "axios";

const url = "https://api.tndk.app/api/v1/users_field/get_users_fields";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjkxMjA4NjM4ZWU0ZTQ1ZDI0Y2Y4NzlhIiwiX2lkIjoiNjkxMjA4NjM4ZWU0ZTQ1ZDI0Y2Y4NzlhIiwidWlkIjoiMDAwMDAxIiwiZW1haWwiOiJ0bmRrYXBpdGFsQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiKzg4MDE3MTIzNDU2NzgiLCJzdGF0dXMiOiJhY3RpdmUiLCJyb2xlIjoiYWRtaW4iLCJpc0RlbGV0ZWQiOmZhbHNlLCJpc0Fzc2lnblNwb2tlIjpmYWxzZSwiY3VzdG9tRmllbGRzIjp7fSwiY3JlYXRlZEF0IjoiMjAyNS0xMS0xMFQxNTo0NDozNS4xMzJaIiwidXBkYXRlZEF0IjoiMjAyNS0xMS0xMFQxNTo0NDozNS4xMzJaIiwiX192IjowLCJpYXQiOjE3NjI3OTIzMjcsImV4cCI6MTc5NDMyODMyN30.G6ZjHUjRrraGo01i8cxCLzmAHaxBoKhXuQ2PApiO_pM";

const headers = {
  Authorization: `Bearer ${token}`,
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTest() {
  console.log("Starting performance test...");
  const results = [];

  for (let i = 1; i <= 100000; i++) {
    const start = Date.now();
    try {
      const res = await axios.get(url, { headers });
      const duration = Date.now() - start;
      results.push(duration);
      console.log(`#${i} ✅ ${duration}ms`);
    } catch (err) {
      console.error(`#${i} ❌ Error:`, err.response?.status || err.message);
    }

    await delay(50); // 1 second delay
  }

  const avg = results.reduce((a, b) => a + b, 0) / results.length;
  console.log(`\n✅ Test complete. Average response time: ${avg.toFixed(2)} ms`);
}

runTest();
