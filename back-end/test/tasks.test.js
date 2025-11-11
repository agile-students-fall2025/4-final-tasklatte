const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

chai.use(chaiHttp);
const { expect } = chai;

describe("Task API Tests", () => {
  it("should get all tasks", async () => {
    const res = await chai.request(app).get("/api/tasks");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("should get daily tasks for a date", async () => {
    const res = await chai.request(app).get("/api/tasks/daily/2025-10-30");
    expect(res).to.have.status(200);
  });

  it("should post new task", async () => {
    const res = await chai.request(app).post("/api/tasks").send({
      title: "New Task",
      details: "mock details",
      course: "Mock 101",
      date: "2025-11-10T10:00",
      priority: "Medium",
    });
    expect(res).to.have.status(201);
    expect(res.body.success).to.be.true;
  });
});
