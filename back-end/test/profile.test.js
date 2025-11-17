// test/profile.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const { users } = require("../data/user");

chai.use(chaiHttp);
const { expect } = chai;

describe("User API Tests", () => {
  // Seed users before tests run
  before(() => {
    if (!users.find(u => u.id === "u1")) {
      users.push({ id: "u1", name: "Test User", username: "testuser" });
    }
  });

  it("should return 401 if not logged in", async () => {
    const res = await chai.request(app).get("/api/profile");
    expect(res).to.have.status(401);
    expect(res.body).to.have.property("error", "Not logged in");
  });

  it("should return 404 if user not found", async () => {
    const res = await chai.request(app).get("/api/profile?userId=doesnotexist");
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error", "User not found");
  });

  it("should return user profile if logged in", async () => {
    const testUser = users.find(u => u.id === "u1");
    const res = await chai.request(app).get(`/api/profile?userId=${testUser.id}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("name", testUser.name);
    expect(res.body).to.have.property("username", testUser.username);
    // check defaults exist
    expect(res.body).to.have.property("avatar");
    expect(res.body).to.have.property("goals");
    expect(res.body).to.have.property("stats");
  });

  it("should fallback to defaults if optional fields missing", async () => {
    const tempUser = { id: "temp123", name: "Temp User", username: "temp" };
    if (!users.find(u => u.id === tempUser.id)) {
      users.push(tempUser);
    }

    const res = await chai.request(app).get(`/api/profile?userId=${tempUser.id}`);
    expect(res).to.have.status(200);
    expect(res.body.grade).to.equal("");
    expect(res.body.avatar).to.equal("https://picsum.photos/id/237/200/300");
    expect(res.body.goals).to.deep.equal({ shortTerm: [], longTerm: [] });
    expect(res.body.stats).to.be.an("array");
  });
});
