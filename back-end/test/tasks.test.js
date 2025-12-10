const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const { getTestToken } = require("./testHelper");

chai.use(chaiHttp);
const { expect } = chai;

describe("Task API Tests", function () {
  this.timeout(15000);

  let token;

  // Get token before running tests
  before(async function () {
    token = await getTestToken();
  });

  it("should get all tasks", async function () {
    const res = await chai.request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("should get daily tasks for a date", async function () {
    const res = await chai.request(app)
      .get("/api/tasks/daily/2025-10-30")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
  });

  it("should post new task", async function () {
    const res = await chai.request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New Task",
        details: "mock details",
        course: "Mock 101",
        date: "2025-11-10T10:00",
        priority: "medium",
      });

    expect(res).to.have.status(201);
    expect(res.body.success).to.be.true;
  });
});
