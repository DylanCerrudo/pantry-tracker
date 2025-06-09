"use client";
import * as React from "react";
import AddItemForm from "./AddItemForm";
import PantryList from "./PantryList";

export default function Home() {
  const [refreshList, setRefreshList] = React.useState(false);

  const handleItemAdded = () => {
    setRefreshList((prev) => !prev); // trigger re-fetch
  };

  return (
    <main style={{ padding: "2rem" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          padding: "1rem 2rem",
          borderRadius: "16px",
          maxWidth: "fit-content",
          marginBottom: "2rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
                <h1 style={{ margin: 1 }}>Welcome to Dylans Pantry Tracker!</h1>

      </div>

      <AddItemForm onItemAdded={handleItemAdded} />
      <PantryList key={refreshList} />
    </main>
  );
}
