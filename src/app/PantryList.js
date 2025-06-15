"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import db from "./firebase/config";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

const formatDateInput = (value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

const PantryList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editItem, setEditItem] = useState({ name: "", quantity: "", expiry: "" });

  const fetchItems = async () => {
    const snapshot = await getDocs(collection(db, "pantryItems"));
    const fetched = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.name && item.quantity && item.expiry);
    setItems(fetched);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const expired = isExpired(item.expiry);
      if (filter === "expired") return matchesSearch && expired;
      if (filter === "valid") return matchesSearch && !expired;
      return matchesSearch;
    });
    setFilteredItems(filtered);
  }, [items, searchTerm, filter]);

  const confirmDelete = (id) => {
    setSelectedItemId(id);
    setOpenConfirm(true);
  };

  const handleDelete = async () => {
    if (selectedItemId) {
      await deleteDoc(doc(db, "pantryItems", selectedItemId));
      setItems(items.filter((item) => item.id !== selectedItemId));
      setOpenConfirm(false);
    }
  };

  const isExpired = (expiryDate) => {
    const [month, day, year] = expiryDate.split("/");
    if (!month || !day || !year) return false;
    const formattedExpiry = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const today = new Date().toISOString().split("T")[0];
    return formattedExpiry < today;
  };

  const openEditDialog = (item) => {
    setEditItem(item);
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({
      ...prev,
      [name]: name === "expiry" ? formatDateInput(value) : value,
    }));
  };

  const handleUpdate = async () => {
  const { id, name, quantity, expiry } = editItem;

  //Basic Validation
  if (!name.trim() || !quantity.trim() || !expiry.trim()) {
    alert("All fields must be filled out.");
    return;
  }

  await updateDoc(doc(db, "pantryItems", id), { name, quantity, expiry });
  setOpenEdit(false);
  fetchItems();
};

  return (
    <div style={{ marginLeft: "1px", marginTop: "2rem" }}>


      <div
  style={{
    backgroundColor: "#e7c9a9", 
    borderRadius: "16px",
    padding: "2rem",
    width: "100%",
    maxWidth: "550px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  }}
>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Image src="/PantryEmojiPIC.png" alt="Pantry" width={32} height={32} />
          <h2 style={{ color: "#000000" }}>Pantry Items</h2>
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <TextField
            label="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ maxWidth: 220 }}
          />

          <TextField
            select
            label="Filter by status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
            sx={{
              maxWidth: 200,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
            <MenuItem value="valid">Not Expired</MenuItem>
          </TextField>
        </div>

        <ul style={{ marginTop: "1rem" }}>
          {filteredItems.map((item) => (
            <li key={item.id} style={{ marginBottom: "0.5rem" }}>
              <span
                style={{
                  color: isExpired(item.expiry) ? "red" : "#000",
                  fontWeight: isExpired(item.expiry) ? "bold" : "normal",
                }}
              >
                • <strong>{item.name}</strong> — {item.quantity} units (expires: {item.expiry}
                {isExpired(item.expiry) && " — expired"})
              </span>{" "}
              <Button size="small" onClick={() => openEditDialog(item)}>Edit</Button>
              <Button color="error" size="small" onClick={() => confirmDelete(item.id)}>
                DELETE
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
       <Image
  src="/BreadShockedPIC.jpeg"
  alt="Shocked Bread"
  width={80}
  height={80}
  style={{ marginBottom: "1rem" }}
/>
          <div>Are you sure you want to delete this item? This cannot be undone.</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
          <TextField label="Name" name="name" value={editItem.name} onChange={handleEditChange} fullWidth margin="dense" />
          <TextField label="Quantity" name="quantity" value={editItem.quantity} onChange={handleEditChange} fullWidth margin="dense" />
          <TextField label="Expiration Date" name="expiry" value={editItem.expiry} onChange={handleEditChange} placeholder="MM/DD/YYYY" fullWidth margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PantryList;
