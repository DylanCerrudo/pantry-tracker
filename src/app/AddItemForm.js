"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "./firebase/config";
import { TextField, Button } from "@mui/material";

// auto-format MM/DD/YYYY
function formatDateInput(value) {
  const cleaned = value.replace(/\D/g, ""); // Remove non-digits
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
  if (!match) return value;

  const [, mm, dd, yyyy] = match;
  let formatted = mm;
  if (dd) formatted += `/${dd}`;
  if (yyyy) formatted += `/${yyyy}`;
  return formatted;
}

export default function AddItemForm({ onItemAdded }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !quantity || !expiry) return;

    await addDoc(collection(db, "pantryItems"), {
      name,
      quantity,
      expiry,
    });

    setName("");
    setQuantity("");
    setExpiry("");

    if (onItemAdded) onItemAdded(); //Refresh items without reload
  };

  return (
    <form
  onSubmit={handleSubmit}
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    alignItems: "flex-start",
    maxWidth: "800px", 
  }}
>
  <TextField
    label="Item Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    sx={{ width: "200px" }}
    margin="normal"
  />
  <TextField
    label="Quantity"
    type="number"
    value={quantity}
    onChange={(e) => setQuantity(e.target.value)}
    sx={{ width: "120px" }}
    margin="normal"
  />
  <TextField
    label="Expiration Date"
    type="text"
    placeholder="MM/DD/YYYY"
    value={expiry}
    onChange={(e) => setExpiry(formatDateInput(e.target.value))}
    sx={{ width: "180px" }}
    margin="normal"
  />
  <Button
    type="submit"
    variant="contained"
    sx={{
      backgroundColor: "#6b4f3b",
      color: "#ffffff",
      height: "56px",
      marginTop: "16px", 
      "&:hover": {
        backgroundColor: "#5a4031",
      },
    }}
  >
    Add Item
  </Button>
</form>
  );
}
