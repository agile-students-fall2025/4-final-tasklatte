// test/profile.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const { getTestToken } = require("./testHelper");

chai.use(chaiHttp);
const { expect } = chai;

describe("User API Tests", () => {
  let token;

  before(async () => {
    token = await getTestToken();
  });

  it("should return 401 if not logged in", async () => {
    const res = await chai.request(app).get("/api/profile");
    expect(res).to.have.status(401);
    expect(res.body).to.have.property("error");
  });

  it("should return user profile if logged in", async () => {
    const res = await chai.request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("name");
    expect(res.body).to.have.property("username");
  });

  it("should fallback to defaults if optional fields missing", async () => {
    const res = await chai.request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("bio");
    expect(res.body).to.have.property("timezone");
  });
});
