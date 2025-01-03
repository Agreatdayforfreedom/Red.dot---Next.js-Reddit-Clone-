import { t_expression, publicRoutes, r_expression } from "@/routes";

describe("public routes", () => {
  const index = "/";
  const thread_case1 = "/r/[slug]/thread/nawdoidawnoidaw";
  const thread_case2 = "/r/[slug]/thread/n";
  const thread_case3 = "/r/[slug]/thread/newdjawlkdjawk";
  const thread_case4 = "/r/[slug]/thread/newdjawlkdjawk/12949302";

  it("should pass / path", () => {
    const exp = publicRoutes.includes(index);

    expect(exp).toBeTruthy();
  });

  it("r_expression should pass /r/* on publicRoutes[1] and not match t_expression", () => {
    const toMatch = publicRoutes[1];

    expect(toMatch).toMatch(r_expression);
    expect(toMatch).not.toMatch(t_expression);
  });
  it("t_expression should pass /r/*/thread/* on publicRoutes[2] and not match r_expression", () => {
    const toMatch = publicRoutes[2];

    expect(toMatch).toMatch(t_expression);
    //!it matches /r/* but should return null if it is /r/*/thread/*
    const match = toMatch.match(r_expression);
    //!match: /r/* , toMatch /r/*/thread/*
    const exp = match ? match[0] === toMatch : null;
    expect(exp).toBeFalsy();
  });

  it("path / should not pass regex", () => {
    const match = index.match(t_expression);
    const exp = match ? match[0] === index : null;

    expect(exp).toBeFalsy();
  });

  it("should pass with random id and random slug", () => {
    // const match = thread_case1.atch(expression);
    expect(thread_case1).toMatch(t_expression);
    expect(thread_case2).toMatch(t_expression);
    expect(thread_case3).toMatch(t_expression);
    expect(thread_case4).toMatch(t_expression);
  });
});

describe("private routes", () => {
  const new_thread = "/submit";
  it("path /submit should not pass regex", () => {
    const match = new_thread.match(t_expression);
    const exp = match ? match[0] === new_thread : null;

    expect(exp).toBeFalsy();
  });
});
