const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

chai.use(chaiHttp);

/**
 * Register a test user and return JWT token
 */
async function getTestToken() {
  const timestamp = Date.now().toString().slice(-8);
  const username = `test_${timestamp}`;
  
  const res = await chai.request(app)
    .post("/api/register")
    .send({
      username,
      password: "testpass123",
      name: "Test User"
    });

  if ((res.status === 200 || res.status === 201) && res.body.token) {
    return res.body.token;
  }
  console.error("Register response:", res.status, res.body);
  throw new Error("Failed to register test user");
}

module.exports = { getTestToken };
