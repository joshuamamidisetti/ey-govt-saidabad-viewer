import { useState } from "react";
import saidabad from "../../data/saidabad.json";

interface SearchProps {
        onSearch: (value: string) => void;
}

function Search({ onSearch }: SearchProps) {

        const [value, setValue] = useState("");
        const [showsuggestions, setShowSuggestions] = useState(false);

        const handleSubmit = (event: React.FormEvent) => {
                event.preventDefault();
                if (!value.trim()) return;
                onSearch(value.trim());
        };

        return (
                <div style={{
                        position: "absolute",
                        top: "10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 11,
                }}>
                        <form
                                onSubmit={handleSubmit}
                                style={{
                                        background: "white",
                                        padding: "8px",
                                        borderRadius: "6px",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                                        display: "flex",
                                        alignItems: "flex-start",
                                }}
                        >
                                <div style={{ position: "relative" }}>
                                        <input
                                                type="text"
                                                value={value}
                                                placeholder="&#128269;  Search building / road / slum..."
                                                onChange={(event) => {
                                                        const newValue = event.target.value;
                                                        setValue(newValue);
                                                        setShowSuggestions(newValue.trim().length > 0);
                                                }}
                                                style={{
                                                        width: "260px",
                                                        padding: "8px",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px",
                                                }}
                                        />
                                        {showsuggestions && (
                                                <div style={{
                                                        position: "absolute",
                                                        top: "42px",
                                                        left: 0,
                                                        width: "260px",
                                                        background: "white",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px",
                                                        zIndex: 1000,
                                                        maxHeight: "220px",
                                                        overflowY: "auto",
                                                }}>
                                                        {saidabad.features
                                                                .filter((feature) => {
                                                                        const label = feature.properties?.label;
                                                                        return (
                                                                                typeof label === "string" &&
                                                                                label.toLowerCase().includes(value.trim().toLowerCase())
                                                                        );
                                                                }).slice(0, 10).map((feature) => {
                                                                        const label = feature.properties?.label;
                                                                        return (
                                                                                <div
                                                                                        key={String(feature.properties?.fid)}
                                                                                        onClick={() => {
                                                                                                setValue(String(label));
                                                                                                setShowSuggestions(false);
                                                                                                onSearch(String(label));
                                                                                        }}
                                                                                        style={{ padding: "8px 10px", cursor: "pointer" }}
                                                                                >
                                                                                        {String(label)}
                                                                                </div>
                                                                        );
                                                                })}
                                                </div>
                                        )}
                                </div>
                                <button type="submit" style={{ marginLeft: "6px", padding: "8px 12px" }}>
                                        Search
                                </button>
                        </form>
                </div>
        );
}

export default Search;
