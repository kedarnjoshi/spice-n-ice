import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormInput } from "../components/FormInput";
import { createVenue } from "../api/venues";

// ── Design tokens (same as prototype) ───────────────────────────
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

interface FormState {
    name: string;
    city: string;
}

interface FormErrors {
    name?: string;
    city?: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export default function AddVenue() {
    const navigate = useNavigate();

    const [form, setForm] = useState<FormState>({ name: "", city: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitState, setSubmitState] = useState<SubmitState>("idle");
    const [serverError, setServerError] = useState<string>("");
    const [createdName, setCreatedName] = useState<string>("");

    // ── Validation ─────────────────────────────────────────────────
    function validate(): boolean {
        const e: FormErrors = {};
        if (!form.name.trim()) e.name = "Venue name is required";
        else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
        if (!form.city.trim()) e.city = "City is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    // ── Handlers ───────────────────────────────────────────────────
    function handleChange(field: keyof FormState) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm(prev => ({ ...prev, [field]: e.target.value }));
            if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
        };
    }

    async function handleSubmit() {
        if (!validate()) return;

        setSubmitState("loading");
        setServerError("");

        try {
            const created = await createVenue({
                name: form.name.trim(),
                city: form.city.trim(),
            });
            setCreatedName(created.name);
            setSubmitState("success");
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Something went wrong");
            setSubmitState("error");
        }
    }

    function handleAddAnother() {
        setForm({ name: "", city: "" });
        setErrors({});
        setSubmitState("idle");
        setCreatedName("");
        setServerError("");
    }

    // ── Success screen ─────────────────────────────────────────────
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
                    Venue Added
                </h2>
                <p style={{ color: C.muted, fontSize: 14, margin: "0 0 32px" }}>
                    <span style={{ color: C.goldLight, fontWeight: 600 }}>{createdName}</span> has been saved successfully.
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    <button
                        onClick={handleAddAnother}
                        style={{
                            background: C.surfaceHigh, color: C.pearl,
                            border: `1px solid ${C.border}`, borderRadius: 8,
                            padding: "10px 20px", fontSize: 13, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        Add Another Venue
                    </button>
                    <button
                        onClick={() => navigate("/events/new")}
                        style={{
                            background: `linear-gradient(135deg, ${C.gold}, ${C.saffron})`,
                            color: "#000", border: "none", borderRadius: 8,
                            padding: "10px 20px", fontSize: 13, fontWeight: 700,
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        Add an Event →
                    </button>
                </div>
            </div>
        );
    }

    // ── Form ───────────────────────────────────────────────────────
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
                        Add Venue
                    </h1>
                </div>
                <div style={{
                    height: 2, width: 48,
                    background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                    borderRadius: 1, marginLeft: 28,
                }} />
                <p style={{ color: C.muted, fontSize: 13, margin: "10px 0 0 28px" }}>
                    Venues can be assigned to events when creating or editing them.
                </p>
            </div>

            {/* Card */}
            <div style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 28,
            }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    <FormInput
                        label="Venue Name"
                        value={form.name}
                        onChange={handleChange("name")}
                        placeholder="e.g. Leela Palace, Farmhouse Sector 42"
                        required
                        error={errors.name}
                        hint="The name clients and staff will recognise"
                    />

                    <FormInput
                        label="City"
                        value={form.city}
                        onChange={handleChange("city")}
                        placeholder="e.g. Delhi, Mumbai, Bangalore"
                        required
                        error={errors.city}
                    />

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
                        disabled={submitState === "loading"}
                        style={{
                            background: submitState === "loading"
                                ? C.surfaceHigh
                                : `linear-gradient(135deg, ${C.gold}, ${C.saffron})`,
                            color: submitState === "loading" ? C.muted : "#000",
                            border: "none", borderRadius: 8,
                            padding: "10px 28px", fontSize: 13, fontWeight: 700,
                            cursor: submitState === "loading" ? "not-allowed" : "pointer",
                            fontFamily: "inherit", flex: 1,
                            transition: "all 0.15s",
                        }}
                    >
                        {submitState === "loading" ? "Saving…" : "Save Venue"}
                    </button>
                </div>
            </div>
        </div>
    );
}