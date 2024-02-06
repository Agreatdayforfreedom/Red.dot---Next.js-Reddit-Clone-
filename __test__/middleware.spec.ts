import { expression, publicRoutes } from "@/routes";

describe("public routes", () => {
  const index = "/";
  const thread_case1 = "/thread/nawdoidawnoidaw";
  const thread_case2 = "/thread/n";
  const thread_case3 = "/thread/newdjawlkdjawk";

  it("should pass / path", () => {
    const exp = publicRoutes.includes(index);

    expect(exp).toBeTruthy();
  });

  it("path / should not pass regex", () => {
    const match = index.match(expression);
    const exp = match ? match[0] === index : null;

    expect(exp).toBeFalsy();
  });

  it("should pass with random id", () => {
    // const match = thread_case1.atch(expression);
    expect(thread_case1).toMatch(expression);
    expect(thread_case2).toMatch(expression);
    expect(thread_case3).toMatch(expression);
  });
});

describe("private routes", () => {
  const new_thread = "/thread/new";
  const edit_thread = "/thread/randomid/edit";
  it("path /thread/new should not pass regex", () => {
    const match = new_thread.match(expression);
    const exp = match ? match[0] === new_thread : null;

    expect(exp).toBeFalsy();
  });

  it("path /thread/randomid/edit should now pass regex", () => {
    const match = edit_thread.match(expression);

    const exp = match ? match[0] === edit_thread : null;
    expect(exp).toBeFalsy();
  });
});
