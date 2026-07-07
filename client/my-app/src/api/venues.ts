import type { Venue, CreateVenueRequest } from "../types";

const BASE = "/api/venue";

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => "Unknown error");
        throw new Error(text || `Request failed with status ${res.status}`);
    }
    return res.json() as Promise<T>;
}

export async function getAllVenues(): Promise<Venue[]> {
    const res = await fetch(`${BASE}/list`);
    return handleResponse<Venue[]>(res);
}

export async function createVenue(data: CreateVenueRequest): Promise<Venue> {
    const res = await fetch(`${BASE}/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<Venue>(res);
}