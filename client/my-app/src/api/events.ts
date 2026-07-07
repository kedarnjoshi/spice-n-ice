import type { Event, CreateEventRequest } from "../types";

const BASE = "/api/event";

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => "Unknown error");
        throw new Error(text || `Request failed with status ${res.status}`);
    }
    return res.json() as Promise<T>;
}

export async function getAllEvents(): Promise<Event[]> {
    const res = await fetch(`${BASE}/list`);
    return handleResponse<Event[]>(res);
}

export async function createEvent(data: CreateEventRequest): Promise<Event> {
    const res = await fetch(`${BASE}/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<Event>(res);
}