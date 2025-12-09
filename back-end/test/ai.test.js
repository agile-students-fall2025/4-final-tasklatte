const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const { getTestToken } = require("./testHelper");

chai.use(chaiHttp);
chai.should();

const { expect } = chai;

describe("AI Daily Tasks API Tests", () => {
  let token;

  before(async () => {
    token = await getTestToken();
  });

  it("should return 404 if /daily/ is called without a date param", (done) => {
    chai
      .request(app)
      .get("/api/ai/daily/")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("should filter tasks by search query 'q'", (done) => {
    chai
      .request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Report Task", date: "2025-12-20T10:00" })
      .end(() => {
        chai
          .request(app)
          .get("/api/tasks?q=report")
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("array");
            done();
          });
      });
  });

  it("should filter tasks by priority", (done) => {
    chai
      .request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "High Priority Task", date: "2025-12-20T10:00", priority: "high" })
      .end(() => {
        chai
          .request(app)
          .get("/api/tasks?priority=high")
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("array");
            done();
          });
      });
  });

  it("should filter tasks by date", (done) => {
    const date = "2025-12-25";
    chai
      .request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Christmas Task", date: `${date}T10:00` })
      .end(() => {
        chai
          .request(app)
          .get(`/api/tasks?date=${date}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("array");
            done();
          });
      });
  });

  it("should filter tasks by completed status", (done) => {
    chai
      .request(app)
      .get("/api/tasks?completed=true")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an("array");
        res.body.forEach((t) => expect(Boolean(t.completed)).to.equal(true));
        done();
      });
  });

  it("should get all tasks for user", (done) => {
    chai
      .request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an("array");
        done();
      });
  });
});
