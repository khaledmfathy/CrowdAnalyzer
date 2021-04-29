const supertest = require("supertest");
const app = require("../../");

jest.setTimeout(30000);

describe("Testing the movies API", () => {
  it("tests the base route and returns true for status", async (done) => {
    const response = await supertest(app).post("/api/engagement/track");
    expect(response.status).toBe(200);
    done();
  });
});
