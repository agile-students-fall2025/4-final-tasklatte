const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../server");

const User = require("../models/User");
const Task = require("../models/Task");
const { getTestToken } = require("./testHelper");

chai.use(chaiHttp);
const { expect } = chai;

describe("Dashboard API Tests", function () {
  this.timeout(10000);

  let token;
  let userFindStub;
  let taskFindStub;

  before(async () => {
    token = await getTestToken();
  });

  afterEach(() => {
    // restore mocks after every test
    sinon.restore();
  });

  it("should return dashboard stats correctly", async function () {
    // Mock user
    userFindStub = sinon.stub(User, "findById").resolves({
      username: "testuser",
      name: "Test User",
    });

    // Get today + week boundaries
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    const todayStr = localToday.toISOString().split("T")[0];

    const dayOfWeek = localToday.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(localToday);
    monday.setDate(localToday.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mondayStr = monday.toISOString().split("T")[0];
    const sundayStr = sunday.toISOString().split("T")[0];

    // Mock tasks
    taskFindStub = sinon.stub(Task, "find").resolves([
      // Appears today
      { date: `${todayStr}T10:00`, completed: false },
      // Today completed
      { date: `${todayStr}T15:00`, completed: true },

      // Inside this week but not today
      { date: `${mondayStr}T12:00`, completed: false },
      { date: `${sundayStr}T18:00`, completed: true },

      // Outside this week → should not count
      { date: "2000-01-01T00:00", completed: false }
    ]);

    const res = await chai
      .request(app)
      .get("/api/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);

    expect(res.body.user.username).to.equal("testuser");
    expect(res.body.dailyTasks.total).to.equal(2);
    expect(res.body.dailyTasks.completed).to.equal(1);

    expect(res.body.weeklyTasks.total).to.equal(4);
    expect(res.body.weeklyTasks.completed).to.equal(2);

    sinon.restore();
  });

  it("should return 404 if user not found", async function () {
    userFindStub = sinon.stub(User, "findById").resolves(null);

    const res = await chai
      .request(app)
      .get("/api/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal("User not found");
  });

  it("should return 500 on server error", async function () {
    userFindStub = sinon.stub(User, "findById").throws(new Error("DB error"));

    const res = await chai
      .request(app)
      .get("/api/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(500);
    expect(res.body.error).to.equal("Server error");
  });
});
