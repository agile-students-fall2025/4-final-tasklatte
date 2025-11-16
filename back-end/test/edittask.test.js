const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

chai.use(chaiHttp);
chai.should();

const { expect } = chai;

describe("Edit Task / Completion / Daily API Tests", () => {
  const tasksData = require("../data/tasksData");
  // snapshot of initial tasks so we can reset between tests
  const initialSnapshot = JSON.parse(JSON.stringify(tasksData));

  beforeEach(() => {
    // reset in-memory tasks array to the initial snapshot
    tasksData.length = 0;
    initialSnapshot.forEach((t) => tasksData.push(JSON.parse(JSON.stringify(t))));
  });

  it("should edit a task (PUT) and update fields including completed", (done) => {
    // create a new task first
    chai
      .request(app)
      .post("/api/tasks")
      .send({
        title: "To Edit",
        details: "old",
        course: "TST",
        date: "2025-12-01T09:00",
        priority: "Low",
        completed: false,
      })
      .end((err, postRes) => {
        postRes.should.have.status(201);
        const id = postRes.body.task.id;

        chai
          .request(app)
          .put(`/api/tasks/${id}`)
          .send({
            title: "Edited",
            details: "new",
            course: "TST2",
            due: "2025-12-02T10:30",
            priority: "High",
            completed: true,
          })
          .end((err2, putRes) => {
            putRes.should.have.status(200);
            putRes.body.task.title.should.equal("Edited");
            putRes.body.task.details.should.equal("new");
            putRes.body.task.course.should.equal("TST2");
            putRes.body.task.date.should.equal("2025-12-02T10:30");
            putRes.body.task.priority.should.equal("High");
            putRes.body.task.completed.should.equal(true);
            done();
          });
      });
  });

  it("should filter tasks by completed status", (done) => {
    chai
      .request(app)
      .post("/api/tasks")
      .send({ title: "A", date: "2025-12-05T09:00", completed: true })
      .end((errA, resA) => {
        resA.should.have.status(201);
        chai
          .request(app)
          .post("/api/tasks")
          .send({ title: "B", date: "2025-12-05T10:00", completed: false })
          .end((errB, resB) => {
            resB.should.have.status(201);

            chai.request(app).get("/api/tasks?completed=true").end((errC, compRes) => {
              compRes.should.have.status(200);
              compRes.body.forEach((t) => expect(Boolean(t.completed)).to.equal(true));

              chai.request(app).get("/api/tasks?completed=false").end((errD, incomRes) => {
                incomRes.should.have.status(200);
                incomRes.body.forEach((t) => expect(Boolean(t.completed)).to.equal(false));
                done();
              });
            });
          });
      });
  });

  it("should toggle completed via PUT (simulate checkbox)", (done) => {
    chai
      .request(app)
      .post("/api/tasks")
      .send({ title: "Toggle", date: "2025-12-06T08:00", completed: false })
      .end((errP, postRes) => {
        postRes.should.have.status(201);
        const id = postRes.body.task.id;

        chai.request(app).put(`/api/tasks/${id}`).send({ completed: true }).end((e1, p1) => {
          p1.should.have.status(200);
          expect(Boolean(p1.body.task.completed)).to.equal(true);

          chai.request(app).put(`/api/tasks/${id}`).send({ completed: false }).end((e2, p2) => {
            p2.should.have.status(200);
            expect(Boolean(p2.body.task.completed)).to.equal(false);
            done();
          });
        });
      });
  });

  it("should return daily tasks for a specific date (calendar -> daily)", (done) => {
    chai
      .request(app)
      .post("/api/tasks")
      .send({ title: "D1", date: "2025-12-10T09:00" })
      .end(() => {
        chai.request(app).post("/api/tasks").send({ title: "D2", date: "2025-12-10T14:00" }).end(() => {
          chai.request(app).post("/api/tasks").send({ title: "Other", date: "2025-12-11T10:00" }).end(() => {
            chai.request(app).get("/api/tasks/daily/2025-12-10").end((errR, resR) => {
              resR.should.have.status(200);
              resR.body.should.be.an("array");
              resR.body.length.should.equal(2);
              done();
            });
          });
        });
      });
  });
});
