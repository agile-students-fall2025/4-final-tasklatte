const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

chai.use(chaiHttp);
chai.should();
const { expect } = chai;

describe("AI Daily Tasks API Tests", () => {
  const tasksData = require("../data/tasksData");
  const initialSnapshot = JSON.parse(JSON.stringify(tasksData));

  beforeEach(() => {
    tasksData.length = 0;
    initialSnapshot.forEach(t => tasksData.push(JSON.parse(JSON.stringify(t))));
  });

  it("should return daily tasks for a specific date with correct duration", (done) => {
    chai.request(app)
      .post("/api/tasks")
      .send({ title: "Study Math", date: "2025-12-15T09:00", duration: 90 })
      .end(() => {
        chai.request(app)
          .post("/api/tasks")
          .send({ title: "Read Book", date: "2025-12-15T14:00", duration: 45 })
          .end(() => {
            chai.request(app)
              .get("/api/ai/daily/2025-12-15")
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("array");
                res.body.length.should.equal(2);

                const mathTask = res.body.find(t => t.task === "Study Math");
                expect(mathTask).to.exist;
                expect(mathTask.duration).to.equal(90);

                const readTask = res.body.find(t => t.task === "Read Book");
                expect(readTask).to.exist;
                expect(readTask.duration).to.equal(45);
                done();
              });
          });
      });
  });

  it("should apply default duration (60) when missing", (done) => {
    chai.request(app)
      .post("/api/tasks")
      .send({ title: "No Duration Task", date: "2025-12-20T10:00" })
      .end(() => {
        chai.request(app)
          .get("/api/ai/daily/2025-12-20")
          .end((err, res) => {
            res.should.have.status(200);
            res.body.length.should.equal(1);
            expect(res.body[0].duration).to.equal(60);
            expect(res.body[0].task).to.equal("No Duration Task");
            done();
          });
      });
  });

  it("should ignore tasks missing a date field", (done) => {
    tasksData.push({ id: "tnodate", title: "No Date Task" });
    chai.request(app)
      .get("/api/ai/daily/2025-12-20")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an("array");
        expect(res.body.length).to.equal(0);
        done();
      });
  });

  it("should return empty array for invalid date format", (done) => {
    chai.request(app)
      .get("/api/ai/daily/not-a-date")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an("array");
        expect(res.body.length).to.equal(0);
        done();
      });
  });

  it("should return 404 if /daily/ is called without a date param", (done) => {
    chai.request(app)
      .get("/api/ai/daily/")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("should filter tasks by search query 'q' (title)", (done) => {
    chai.request(app)
      .get("/api/tasks?q=report")
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.length).to.be.greaterThan(0);
        expect(res.body[0].title.toLowerCase()).to.include("report");
        done();
      });
  });

  it("should filter tasks by search query 'q' (details)", (done) => {
    chai.request(app)
      .get("/api/tasks?q=polish")
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.some(t => (t.details || "").toLowerCase().includes("polish"))).to.be.true;
        done();
      });
  });

  it("should filter tasks by course", (done) => {
    chai.request(app)
      .get("/api/tasks?course=CS 101")
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.every(t => (t.course || "").toLowerCase().includes("cs 101"))).to.be.true;
        done();
      });
  });

  it("should filter tasks by priority", (done) => {
    chai.request(app)
      .get("/api/tasks?priority=High")
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.every(t => t.priority === "High")).to.be.true;
        done();
      });
  });

  it("should filter tasks by date", (done) => {
    const date = tasksData[0].date.slice(0, 10);
    chai.request(app)
      .get(`/api/tasks?date=${date}`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.every(t => (t.date || "").startsWith(date))).to.be.true;
        done();
      });
  });

  it("should filter tasks by completed=true", (done) => {
    chai.request(app)
      .get("/api/tasks?completed=true")
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.every(t => t.completed === true)).to.be.true;
        done();
      });
  });

  it("should filter tasks by completed=false", (done) => {
    chai.request(app)
      .get("/api/tasks?completed=false")
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.every(t => t.completed === false)).to.be.true;
        done();
      });
  });

  it("should return a single task by id", (done) => {
    chai.request(app)
      .post("/api/tasks")
      .send({ title: "Single Task", date: "2025-12-23T10:00" })
      .end((_, res) => {
        const newTaskId = res.body.task.id;
        chai.request(app)
          .get(`/api/tasks/${newTaskId}`)
          .end((err, res2) => {
            res2.should.have.status(200);
            expect(res2.body.title).to.equal("Single Task");
            done();
          });
      });
  });

  it("should return 404 for non-existent id", (done) => {
    chai.request(app)
      .get("/api/tasks/nonexistent")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("should update task fields and completed status (boolean)", (done) => {
    const id = tasksData[0].id;
    chai.request(app)
      .put(`/api/tasks/${id}`)
      .send({ title: "Updated Title", completed: true })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.task.title).to.equal("Updated Title");
        expect(res.body.task.completed).to.be.true;
        done();
      });
  });

  it("should parse completed status from string values", (done) => {
    const id = tasksData[0].id;
    chai.request(app)
      .put(`/api/tasks/${id}`)
      .send({ completed: "1" })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.task.completed).to.be.true;
        chai.request(app)
          .put(`/api/tasks/${id}`)
          .send({ completed: "false" })
          .end((err2, res2) => {
            res2.should.have.status(200);
            expect(res2.body.task.completed).to.be.false;
            done();
          });
      });
  });

  it("should update date when 'due' is provided on PUT", (done) => {
    const id = tasksData[0].id;
    chai.request(app)
      .put(`/api/tasks/${id}`)
      .send({ due: "2025-12-31T09:00" })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.task.date).to.equal("2025-12-31T09:00");
        done();
      });
  });

  it("should return 404 when updating non-existent task", (done) => {
    chai.request(app)
      .put("/api/tasks/nonexistent")
      .send({ title: "Nope" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("should delete a task", (done) => {
    const id = tasksData[0].id;
    chai.request(app)
      .delete(`/api/tasks/${id}`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.deleted.id).to.equal(id);
        done();
      });
  });

  it("should return 404 when deleting non-existent task", (done) => {
    chai.request(app)
      .delete("/api/tasks/nonexistent")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("should store explicit duration when provided on POST", (done) => {
    chai.request(app)
      .post("/api/tasks")
      .send({ title: "Duration Task", date: "2025-12-26T10:00", duration: 120 })
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body.task.duration).to.equal(120);
        done();
      });
  });
});