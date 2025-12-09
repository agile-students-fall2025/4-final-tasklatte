const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const { getTestToken } = require("./testHelper");

chai.use(chaiHttp);
chai.should();

const { expect } = chai;

describe("Edit Task / Completion / Daily API Tests", () => {
  let token;

  before(async () => {
    token = await getTestToken();
  });

  it("should edit a task (PUT) and update fields including completed", (done) => {
    chai
      .request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "To Edit",
        details: "old",
        course: "TST",
        date: "2025-12-01T09:00",
        priority: "high",
        completed: false,
      })
      .end((err, postRes) => {
        postRes.should.have.status(201);
        const id = postRes.body.task._id;

        chai
          .request(app)
          .put(`/api/tasks/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            title: "Edited",
            details: "new",
            course: "TST2",
            date: "2025-12-02T10:30",
            priority: "high",
            completed: true,
          })
          .end((err2, putRes) => {
            putRes.should.have.status(200);
            putRes.body.task.title.should.equal("Edited");
            putRes.body.task.details.should.equal("new");
            putRes.body.task.course.should.equal("TST2");
            putRes.body.task.priority.should.equal("high");
            putRes.body.task.completed.should.equal(true);
            done();
          });
      });
  });

  it("should toggle completed via PUT (simulate checkbox)", (done) => {
    chai
      .request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Toggle", course: "TST 101", date: "2025-12-06T08:00" })
      .end((errP, postRes) => {
        if (postRes.status !== 201) {
          done(new Error(`Expected 201, got ${postRes.status}: ${JSON.stringify(postRes.body)}`));
          return;
        }
        const id = postRes.body.task._id;

        chai
          .request(app)
          .put(`/api/tasks/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ completed: true })
          .end((e1, p1) => {
            p1.should.have.status(200);
            expect(Boolean(p1.body.task.completed)).to.equal(true);

            chai
              .request(app)
              .put(`/api/tasks/${id}`)
              .set("Authorization", `Bearer ${token}`)
              .send({ completed: false })
              .end((e2, p2) => {
                p2.should.have.status(200);
                expect(Boolean(p2.body.task.completed)).to.equal(false);
                done();
              });
          });
      });
  });

  it("should filter tasks by completed status", (done) => {
    chai
      .request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Completed Task", course: "TST 101", date: "2025-12-05T09:00" })
      .end((errA, resA) => {
        if (resA.status !== 201) {
          done(new Error(`Expected 201, got ${resA.status}: ${JSON.stringify(resA.body)}`));
          return;
        }
        const id = resA.body.task._id;

        chai
          .request(app)
          .put(`/api/tasks/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ completed: true })
          .end(() => {
            chai
              .request(app)
              .get("/api/tasks?completed=true")
              .set("Authorization", `Bearer ${token}`)
              .end((errC, compRes) => {
                compRes.should.have.status(200);
                compRes.body.forEach((t) => expect(Boolean(t.completed)).to.equal(true));
                done();
              });
          });
      });
  });
});
