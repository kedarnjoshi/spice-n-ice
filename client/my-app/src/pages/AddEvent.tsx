import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormInput, FormSelect } from "../components/FormInput";
import { createEvent } from "../api/events";
import { getAllVenues } from "../api/venues";
import type { Venue } from "../types";

const C = {
    bg: "#0D0F1A",
    surface: "#13162A",
    surfaceHigh: "#1B1F35",
    border: "#252A45",
    gold: "#C9973A",
    goldLight: "#E5B96A",
    saffron: "#E8631A",
    pearl: "#F2EDE4",
    muted: "#7A7F9A",
    green: "#2ECC9A",
    red: "#E05A5A",
};

// Indian event types — the cultural specificity that matters
const EVENT_TYPES = [
    { value: "WEDDING", label: "💍 Wedding" },
    { value: "RECEPTION", label: "🥂 Reception" },
    { value: "ENGAGEMENT", label: "💛 Engagement / Sagai" },
    { value: "ROKA", label: "🪔 Roka" },
    { value: "HALDI", label: "🌼 Haldi" },
    { value: "MEHENDI", label: "🌿 Mehendi" },
    { value: "SANGEET", label: "🎵 Sangeet" },
    { value: "BARAAT", label: "🐴 Baraat" },
    { value: "GRIHA_PRAVESH", label: "🏠 Griha Pravesh" },
    { value: "BIRTHDAY", label: "🎂 Birthday" },
    { value: "ANNIVERSARY", label: "❤️ Anniversary" },
    { value: "CORPORATE", label: "🏢 Corporate Event" },
    { value: "PRODUCT_LAUNCH", label: "🚀 Product Launch" },
    { value: "CONFERENCE", label: "🎤 Conference" },
    { value: "POOJA", label: "🪔 Pooja / Religious" },
    { value: "BABY_SHOWER", label: "👶 Baby Shower" },
    { value: "OTHER", label: "✦ Other" },
];

interface FormState {
    type: string;
    clientName: string;
    clientEmail: string;
    venueId: string;
    guestCount: string;
}

interface FormErrors {
    type?: string;
    clientName?: string;
    clientEmail?: string;
    venueId?: string;
    guestCount?: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export default function AddEvent() {
    const navigate = useNavigate();

    const [form, setForm] = useState<FormState>({
        type: "",
        clientName: "",
        clientEmail: "",
        venueId: "",
        guestCount: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitState, setSubmitState] = useState<SubmitState>("idle");
    const [serverError, setServerError] = useState<string>("");
    const [createdClientName, setCreatedClientName] = useState<string>("");

    // Venues for dropdown
    const [venues, setVenues] = useState<Venue[]>([]);
    const [venuesLoading, setVenuesLoading] = useState(true);
    const [venuesError, setVenuesError] = useState<string>("");

    // Load venues on mount
    useEffect(() => {
        getAllVenues()
            .then(setVenues)
            .catch(err => setVenuesError(err.message))
            .finally(() => setVenuesLoading(false));
    }, []);

    // ── Validation ──────────────────────────────────────────────────
    function validate(): boolean {
        const e: FormErrors = {};
        if (!form.type) e.type = "Event type is required";
        if (!form.clientName.trim()) e.clientName = "Client name is required";
        if (!form.clientEmail.trim()) e.clientEmail = "Client email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail))
            e.clientEmail = "Enter a valid email address";
        if (!form.venueId) e.venueId = "Please select a venue";
        if (!form.guestCount) e.guestCount = "Guest count is required";
        else if (parseInt(form.guestCount) < 1)
            e.guestCount = "Guest count must be at least 1";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    // ── Handlers ────────────────────────────────────────────────────
    function handleInputChange(field: keyof FormState) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm(prev => ({ ...prev, [field]: e.target.value }));
            if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
        };
    }

    function handleSelectChange(field: keyof FormState) {
        return (e: React.ChangeEvent<HTMLSelectElement>) => {
            setForm(prev => ({ ...prev, [field]: e.target.value }));
            if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
        };
    }

    async function handleSubmit() {
        if (!validate()) return;

        setSubmitState("loading");
        setServerError("");

        try {
            const created = await createEvent({
                type: form.type,
                clientName: form.clientName.trim(),
                clientEmail: form.clientEmail.trim(),
                venueId: parseInt(form.venueId),
                guestCount: parseInt(form.guestCount),
            });
            setCreatedClientName(created.clientName);
            setSubmitState("success");
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Something went wrong");
            setSubmitState("error");
        }
    }

    // ── Success screen ──────────────────────────────────────────────
    if (submitState === "success") {
        return (
            <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
                <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: `${C.green}20`, border: `2px solid ${C.green}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, margin: "0 auto 24px",
                }}>✓</div>

                <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: C.pearl, fontSize: 24, margin: "0 0 8px", fontWeight: 700,
                }}>
                    Event Created
                </h2>
                <p style={{ color: C.muted, fontSize: 14, margin: "0 0 8px" }}>
                    Event for <span style={{ color: C.goldLight, fontWeight: 600 }}>{createdClientName}</span> has been saved.
                </p>
                <p style={{ color: C.muted, fontSize: 12, margin: "0 0 32px" }}>
                    Status set to <span style={{ color: C.gold }}>Quoted</span> — update once confirmed.
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    <button
                        onClick={() => {
                            setForm({ type: "", clientName: "", clientEmail: "", venueId: "", guestCount: "" });
                            setErrors({});
                            setSubmitState("idle");
                            setServerError("");
                        }}
                        style={{
                            background: C.surfaceHigh, color: C.pearl,
                            border: `1px solid ${C.border}`, borderRadius: 8,
                            padding: "10px 20px", fontSize: 13, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        Add Another Event
                    </button>
                    <button
                        onClick={() => navigate("/events")}
                        style={{
                            background: `linear-gradient(135deg, ${C.gold}, ${C.saffron})`,
                            color: "#000", border: "none", borderRadius: 8,
                            padding: "10px 20px", fontSize: 13, fontWeight: 700,
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        View All Events →
                    </button>
                </div>
            </div>
        );
    }

    // ── Form ────────────────────────────────────────────────────────
    return (
        <div style={{ maxWidth: 560, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: "none", border: "none", color: C.muted,
                            cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1,
                        }}
                    >←</button>
                    <h1 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: C.pearl, fontSize: 26, margin: 0, fontWeight: 700,
                    }}>
                        New Event
                    </h1>
                </div>
                <div style={{
                    height: 2, width: 48,
                    background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                    borderRadius: 1, marginLeft: 28,
                }} />
                <p style={{ color: C.muted, fontSize: 13, margin: "10px 0 0 28px" }}>
                    Fill in the client and event details. You can add vendors and team later.
                </p>
            </div>

            {/* Venues failed to load */}
            {venuesError && (
                <div style={{
                    background: `${C.red}15`, border: `1px solid ${C.red}40`,
                    borderRadius: 8, padding: "12px 16px", marginBottom: 20,
                    color: C.red, fontSize: 13,
                }}>
                    Could not load venues: {venuesError}. <button
                    onClick={() => { setVenuesError(""); setVenuesLoading(true); getAllVenues().then(setVenues).catch(e => setVenuesError(e.message)).finally(() => setVenuesLoading(false)); }}
                    style={{ background: "none", border: "none", color: C.goldLight, cursor: "pointer", fontFamily: "inherit", fontSize: 13, textDecoration: "underline", padding: 0 }}
                >Retry</button>
                </div>
            )}

            {/* Card */}
            <div style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 28,
            }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Event type */}
                    <FormSelect
                        label="Event Type"
                        value={form.type}
                        onChange={handleSelectChange("type")}
                        options={EVENT_TYPES}
                        placeholder="Select event type…"
                        required
                        error={errors.type}
                    />

                    {/* Client details */}
                    <div style={{
                        paddingTop: 4,
                        borderTop: `1px solid ${C.border}`,
                    }}>
                        <div style={{ color: C.muted, fontSize: 10, letterSpacing: 1, fontWeight: 600, marginBottom: 16, marginTop: 8 }}>
                            CLIENT DETAILS
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <FormInput
                                label="Client Name"
                                value={form.clientName}
                                onChange={handleInputChange("clientName")}
                                placeholder="e.g. Sharma Family, Infosys Ltd."
                                required
                                error={errors.clientName}
                            />
                            <FormInput
                                label="Client Email"
                                value={form.clientEmail}
                                onChange={handleInputChange("clientEmail")}
                                placeholder="e.g. rahul@sharma.com"
                                type="email"
                                required
                                error={errors.clientEmail}
                                hint="Used for automatic payment reminders and confirmations"
                            />
                        </div>
                    </div>

                    {/* Event details */}
                    <div style={{
                        paddingTop: 4,
                        borderTop: `1px solid ${C.border}`,
                    }}>
                        <div style={{ color: C.muted, fontSize: 10, letterSpacing: 1, fontWeight: 600, marginBottom: 16, marginTop: 8 }}>
                            EVENT DETAILS
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                            {/* Venue dropdown */}
                            <FormSelect
                                label="Venue"
                                value={form.venueId}
                                onChange={handleSelectChange("venueId")}
                                options={venues.map(v => ({
                                    value: v.id,
                                    label: `${v.name} — ${v.city}`,
                                }))}
                                placeholder={venuesLoading ? "Loading venues…" : "Select a venue…"}
                                required
                                error={errors.venueId}
                                disabled={venuesLoading || !!venuesError}
                            />

                            {/* No venues yet */}
                            {!venuesLoading && !venuesError && venues.length === 0 && (
                                <div style={{
                                    background: `${C.gold}10`, border: `1px solid ${C.gold}30`,
                                    borderRadius: 7, padding: "10px 14px",
                                    color: C.gold, fontSize: 12,
                                }}>
                                    No venues added yet.{" "}
                                    <button
                                        onClick={() => navigate("/venues/new")}
                                        style={{ background: "none", border: "none", color: C.goldLight, cursor: "pointer", fontFamily: "inherit", fontSize: 12, textDecoration: "underline", padding: 0 }}
                                    >
                                        Add a venue first →
                                    </button>
                                </div>
                            )}

                            <FormInput
                                label="Expected Guest Count"
                                value={form.guestCount}
                                onChange={handleInputChange("guestCount")}
                                placeholder="e.g. 500"
                                type="number"
                                required
                                error={errors.guestCount}
                                hint="Approximate number — can be updated later"
                            />
                        </div>
                    </div>

                </div>

                {/* Server error */}
                {submitState === "error" && serverError && (
                    <div style={{
                        marginTop: 20,
                        background: `${C.red}15`,
                        border: `1px solid ${C.red}40`,
                        borderRadius: 7,
                        padding: "10px 14px",
                        color: C.red,
                        fontSize: 13,
                    }}>
                        {serverError}
                    </div>
                )}

                {/* Actions */}
                <div style={{
                    display: "flex", gap: 10, marginTop: 28,
                    paddingTop: 20, borderTop: `1px solid ${C.border}`,
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: "none", color: C.muted,
                            border: `1px solid ${C.border}`, borderRadius: 8,
                            padding: "10px 20px", fontSize: 13, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={submitState === "loading" || venuesLoading}
                        style={{
                            background: (submitState === "loading" || venuesLoading)
                                ? C.surfaceHigh
                                : `linear-gradient(135deg, ${C.gold}, ${C.saffron})`,
                            color: (submitState === "loading" || venuesLoading) ? C.muted : "#000",
                            border: "none", borderRadius: 8,
                            padding: "10px 28px", fontSize: 13, fontWeight: 700,
                            cursor: (submitState === "loading" || venuesLoading) ? "not-allowed" : "pointer",
                            fontFamily: "inherit", flex: 1,
                            transition: "all 0.15s",
                        }}
                    >
                        {submitState === "loading" ? "Creating…" : "Create Event"}
                    </button>
                </div>
            </div>
        </div>
    );
}