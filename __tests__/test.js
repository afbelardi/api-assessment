const index = require("../server/index");

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", index);


test("index route works", done => {
    request(app)
        .get("/")
        .expect("Content-Type", "text/html; charset=utf-8")
        .expect(200, done)
});


test("ping route works", done => {
    request(app)
        .get("/api/ping")
        .expect("Content-Type", /json/)
        .expect({ success: true })
        .expect(200, done)
})


test("posts route work", done => {
    request(app)
        .get("/api/posts")
        .query({ tags: "tech,science" })
        .expect("Content-Type", /json/)
        .expect(200, done)
})


test("post route doesn't work without tags", done => {
    request(app)
        .get("/api/posts")
        .expect("Content-Type", /json/)
        .expect(400, done)
})