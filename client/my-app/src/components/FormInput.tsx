import React from "react";

interface FormInputProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    type?: "text" | "email" | "number" | "tel";
    disabled?: boolean;
    hint?: string;
}

export function FormInput({
                              label,
                              value,
                              onChange,
                              placeholder,
                              required = false,
                              error,
                              type = "text",
                              disabled = false,
                              hint,
                          }: FormInputProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{
                color: "#7A7F9A",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
            }}>
                {label}
                {required && <span style={{ color: "#E8631A", marginLeft: 3 }}>*</span>}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                style={{
                    background: "#1B1F35",
                    border: `1px solid ${error ? "#E05A5A" : "#252A45"}`,
                    borderRadius: 7,
                    color: "#F2EDE4",
                    fontSize: 14,
                    padding: "10px 14px",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? "not-allowed" : "text",
                    fontFamily: "inherit",
                }}
                onFocus={e => { if (!error) e.target.style.borderColor = "#C9973A"; }}
                onBlur={e => { if (!error) e.target.style.borderColor = "#252A45"; }}
            />

            {hint && !error && (
                <span style={{ color: "#7A7F9A", fontSize: 11 }}>{hint}</span>
            )}
            {error && (
                <span style={{ color: "#E05A5A", fontSize: 11 }}>{error}</span>
            )}
        </div>
    );
}

// ── Select variant ───────────────────────────────────────────────
interface FormSelectProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string | number; label: string }[];
    required?: boolean;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
}

export function FormSelect({
                               label,
                               value,
                               onChange,
                               options,
                               required = false,
                               error,
                               disabled = false,
                               placeholder,
                           }: FormSelectProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{
                color: "#7A7F9A",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
            }}>
                {label}
                {required && <span style={{ color: "#E8631A", marginLeft: 3 }}>*</span>}
            </label>

            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                style={{
                    background: "#1B1F35",
                    border: `1px solid ${error ? "#E05A5A" : "#252A45"}`,
                    borderRadius: 7,
                    color: value === "" ? "#7A7F9A" : "#F2EDE4",
                    fontSize: 14,
                    padding: "10px 14px",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    cursor: disabled ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7F9A' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                    paddingRight: 36,
                }}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(o => (
                    <option key={o.value} value={o.value} style={{ background: "#1B1F35" }}>
                        {o.label}
                    </option>
                ))}
            </select>

            {error && (
                <span style={{ color: "#E05A5A", fontSize: 11 }}>{error}</span>
            )}
        </div>
    );
}