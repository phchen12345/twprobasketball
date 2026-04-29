import {
  clearStoredAccessToken,
  readStoredAccessToken,
  storeAccessToken,
} from "@/lib/storage/token";

describe("access token storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores and reads an access token", () => {
    storeAccessToken("test-token");

    expect(readStoredAccessToken()).toBe("test-token");
  });

  it("clears a stored access token", () => {
    storeAccessToken("test-token");
    clearStoredAccessToken();

    expect(readStoredAccessToken()).toBeNull();
  });
});
