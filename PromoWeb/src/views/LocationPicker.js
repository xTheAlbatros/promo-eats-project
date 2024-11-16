import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "reactstrap";
import pinIcon from "../assets/img/pin.png";

const customIcon = L.icon({
    iconUrl: pinIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const LocationPicker = ({ onLocationSelect }) => {
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setSelectedPosition({ lat, lng });
                onLocationSelect({ latitude: lat, longitude: lng });
            },
        });

        return selectedPosition ? <Marker position={selectedPosition} icon={customIcon} /> : null;
    };

    const MoveToLocation = ({ position }) => {
        const map = useMap();
        if (position) {
            map.setView(position, 15);
        }
        return null;
    };

    const geocodeAddress = async () => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    address
                )}`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);

                setSelectedPosition({ lat: latitude, lng: longitude });
                onLocationSelect({ latitude, longitude });
                setError("");
            } else {
                setError("Nie znaleziono lokalizacji. Spróbuj wpisać inny adres.");
            }
        } catch (err) {
            console.error("Błąd geokodowania:", err);
            setError("Wystąpił błąd podczas wyszukiwania lokalizacji.");
        }
    };

    return (
        <div>
            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Wpisz adres"
                    style={{ width: "80%", padding: "8px" }}
                />
                <Button color="warning" onClick={geocodeAddress} style={{ marginLeft: "8px" }}>
                    Wyszukaj adres
                </Button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
            <MapContainer
                style={{ height: "400px", width: "100%" }}
                center={selectedPosition || [51.23537909545088, 22.548748325229347]}
                zoom={15}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
                <MoveToLocation position={selectedPosition} />
            </MapContainer>
        </div>
    );
};

export default LocationPicker;