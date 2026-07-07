// ── Venue ────────────────────────────────────────────────────────
export interface Venue {
    id: number;
    name: string;
    city: string;
}

export interface CreateVenueRequest {
    name: string;
    city: string;
}

// ── Event ────────────────────────────────────────────────────────
export interface Event {
    id: number;
    // name: string;
    type: string;
    clientName: string;
    clientEmail: string;
    miscText?: string;
    // venueId: number;
    venueName: string;
    venueCity: string;
    guestCount: number;
    eventStatus: EventStatus;

}

export type EventStatus =
    | "QUOTED"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export interface CreateEventRequest {
    type: string;
    clientName: string;
    clientEmail: string;
    venueId: number;
    guestCount: number;
}

// ── API Response wrapper ─────────────────────────────────────────
export interface ApiError {
    message: string;
    status: number;
}