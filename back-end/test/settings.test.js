const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../server");

const User = require("../models/User");
const { getTestToken } = require("./testHelper");

chai.use(chaiHttp);
const { expect } = chai;

describe("Settings API Tests", function () {
  this.timeout(10000);

  let token;

  before(async () => {
    token = await getTestToken();
  });

  afterEach(() => sinon.restore());

  function mockUser(overrides = {}) {
    return {
      _id: "123",
      username: "testuser",
      name: "Test User",
      bio: "hello",
      major: "CS",
      school: "NYU",
      grade: "Junior",
      timezone: "America/New_York",
      photo: "old.png",
      goals: [
        {
          _id: "g1",
          title: "Goal 1",
          description: "desc",
          completed: false,
          dueDate: null,
        },
      ],
      save: sinon.stub().resolves(),
      ...overrides,
    };
  }

  // -------------------------------------------------------
  // GET /settings
  // -------------------------------------------------------
  it("should get user settings", async function () {
    sinon.stub(User, "findById").resolves(mockUser());

    const res = await chai
      .request(app)
      .get("/api/settings")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.username).to.equal("testuser");
    expect(res.body.bio).to.equal("hello");
  });


  // GET /settings/goals
  it("should get all goals", async function () {
    sinon.stub(User, "findById").resolves(mockUser());

    const res = await chai
      .request(app)
      .get("/api/settings/goals")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.length).to.equal(1);
    expect(res.body[0].title).to.equal("Goal 1");
  });


  // PUT /settings/goals/:goalId
  it("should update a goal", async function () {
    const user = mockUser();
    user.goals.id = (id) => (id === "g1" ? user.goals[0] : null);

    sinon.stub(User, "findById").resolves(user);

    const res = await chai
      .request(app)
      .put("/api/settings/goals/g1")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Goal" });

    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal("Updated Goal");
  });


  // DELETE /settings/goals/:goalId
  it("should delete a goal", async function () {
    const user = mockUser();
    user.goals.id = (id) => (id === "g1" ? user.goals[0] : null);
    user.goals[0].deleteOne = sinon.stub().resolves();

    sinon.stub(User, "findById").resolves(user);

    const res = await chai
      .request(app)
      .delete("/api/settings/goals/g1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  // DELETE /settings/account
  it("should delete the account", async function () {
    sinon.stub(User, "findByIdAndDelete").resolves(true);

    const res = await chai
      .request(app)
      .delete("/api/settings/account")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  // PUT /settings/photo
  it("should update photo", async function () {
    const user = mockUser();

    sinon.stub(User, "findById").resolves(user);

    const res = await chai
      .request(app)
      .put("/api/settings/photo")
      .set("Authorization", `Bearer ${token}`)
      .send({ photo: "newPhoto.png" });

    expect(res.status).to.equal(200);
    expect(res.body.photo).to.equal("newPhoto.png");
  });

  it("should return 400 when no photo provided", async function () {
    const res = await chai
      .request(app)
      .put("/api/settings/photo")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).to.equal(400);
  });

  // GET /settings/:field
  it("should get a specific field", async function () {
    sinon.stub(User, "findById").resolves(mockUser());

    const res = await chai
      .request(app)
      .get("/api/settings/bio")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.bio).to.equal("hello");
  });

  it("should return 400 for invalid field in GET", async function () {
    sinon.stub(User, "findById").resolves(mockUser());

    const res = await chai
      .request(app)
      .get("/api/settings/invalidField")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(400);
  });

  // PUT /settings/:field
  it("should update a specific field", async function () {
    const user = mockUser();
    sinon.stub(User, "findById").resolves(user);

    const res = await chai
      .request(app)
      .put("/api/settings/bio")
      .set("Authorization", `Bearer ${token}`)
      .send({ value: "Updated Bio" });

    expect(res.status).to.equal(200);
    expect(res.body.bio).to.equal("Updated Bio");
  });

  it("should return 400 for invalid field in PUT", async function () {
    const res = await chai
      .request(app)
      .put("/api/settings/notAllowed")
      .set("Authorization", `Bearer ${token}`)
      .send({ value: "something" });

    expect(res.status).to.equal(400);
  });

  it("should return 404 when user not found", async function () {
    sinon.stub(User, "findById").resolves(null);

    const res = await chai
      .request(app)
      .get("/api/settings")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(404);
  });

  it("should return 500 on server error", async function () {
    sinon.stub(User, "findById").throws(new Error("DB error"));

    const res = await chai
      .request(app)
      .get("/api/settings")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(500);
  });
});
