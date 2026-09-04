import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "./contact-form";
import { site } from "@/lib/site";

/**
 * The form now delivers for real: submissions POST to the Formspree endpoint
 * in lib/site.ts. These tests pin the contract — endpoint called, payload
 * complete, every outcome honest (no success unless the endpoint accepted).
 */

const NAME = "Maya";
const EMAIL = "maya@example.com";
const MESSAGE = "Hello from the observatory.";

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: NAME },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: EMAIL },
  });
  fireEvent.change(screen.getByLabelText(/message/i), {
    target: { value: MESSAGE },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ContactForm", () => {
  it("renders the inquiry categories and the essential fields", () => {
    render(<ContactForm />);

    for (const option of ["General", "Partnership", "Support"]) {
      expect(
        screen.getByRole("button", { name: option })
      ).toBeInTheDocument();
    }
    expect(screen.getByLabelText(/name/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/message/i)).toBeRequired();
  });

  it("POSTs the form fields to the Formspree endpoint and shows success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Message received.")).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(site.contactFormEndpoint);
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ Accept: "application/json" });

    const body = init.body as FormData;
    expect(body.get("name")).toBe(NAME);
    expect(body.get("email")).toBe(EMAIL);
    expect(body.get("message")).toBe(MESSAGE);
  });

  it("carries the selected inquiry category with the submission", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "Partnership" }));
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await screen.findByText("Message received.");

    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get("category")).toBe("Partnership");
  });

  it("does not call the endpoint when a required field is empty", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: NAME },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      /didn't send|didn’t send/i
    );
  });

  it("rejects a malformed email before calling the endpoint, with a specific message", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: NAME },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "maya-at-example" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: MESSAGE },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      /email address doesn’t look right/i
    );
  });

  it("shows the error state instead of a false success when the endpoint rejects", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status: 422 })
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByRole("alert")).toBeInTheDocument()
    );
    expect(screen.getByRole("alert")).toHaveTextContent(/on our end/i);
    expect(screen.queryByText("Message received.")).not.toBeInTheDocument();
  });

  it("returns to a fresh form after success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    );

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    fireEvent.click(
      await screen.findByRole("button", { name: /send another message/i })
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue("");
    expect(screen.getByLabelText(/message/i)).toHaveValue("");
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });
});
