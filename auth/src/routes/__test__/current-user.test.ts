import request from "supertest";
import { app } from "../../app";

it("response with details about the user", async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
    
  expect(res.body.user.email).toEqual("test@test.com");
});

it("response with 401 if user not authenticated", async () => {
    
  const res = await request(app)
  .get("/api/users/currentuser")
  .send()
  .expect(401);

});