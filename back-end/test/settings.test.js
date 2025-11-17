const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

chai.use(chaiHttp);
const { expect } = chai;

describe("Settings API Tests", () => {
  it("should get all settings", async () => {
    const res = await chai.request(app).get("/api/settings");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("bio");
    expect(res.body).to.have.property("major");
    expect(res.body).to.have.property("school");
    expect(res.body).to.have.property("grade");
    expect(res.body).to.have.property("timezone");
    expect(res.body).to.have.property("goals");
    expect(res.body.goals).to.be.an("array");

  });
 it("should update bio", async () => {
    const res = await chai.request(app).put("/api/settings/bio").send({value : "hello"});
    expect(res).to.have.status(200);
    expect(res.body).to.include({success: true, bio:"hello"});
  });

  it("should update major", async () => {
    const res = await chai.request(app).put("/api/settings/major").send({value : "Computer Science"});
    expect(res).to.have.status(200);
    expect(res.body).to.include({success: true, major:"Computer Science"});
  });

  it("should update school", async () => {
    const res = await chai.request(app).put("/api/settings/school").send({value : "NYU"});
    expect(res).to.have.status(200);
    expect(res.body).to.include({success: true, school:"NYU"});
  });

  it("should update grade", async () => {
    const res = await chai.request(app).put("/api/settings/grade").send({value : "Junior"});
    expect(res).to.have.status(200);
    expect(res.body).to.include({success: true, grade:"Junior"});
  });

   it("should update timezone", async () => {
    const res = await chai.request(app).put("/api/settings/timezone").send({value : "EST"});
    expect(res).to.have.status(200);
    expect(res.body).to.include({success: true, timezone:"EST"});
  });

   it("should add a new goal", async () => {
    const newGoal = {title: "Goal Test", description: "test"};
    const res = await chai.request(app).post("/api/settings/goals").send(newGoal);
    expect(res).to.have.status(200);
    expect(res.body).to.include({title: "Goal Test", description: "test"});
    expect(res.body).to.have.property("id");
   });

   it("should delete a goal", async () => {
    const addG = await chai.request(app).post("/api/settings/goals").send({title: "Delete Test", description: "Delete"});
    const goalID = addG.body.id;
    const deleteG = await chai.request(app).delete(`/api/settings/goals/${goalID}`);
    expect(deleteG).to.have.status(200);
    expect(deleteG.body).to.deep.equal({success:true});
   });

   it("should delete account", async () => {
    const res = await chai.request(app).delete("/api/settings/account");
    expect(res).to.have.status(200);
    expect(res.body).to.include({success: true});
   });
});