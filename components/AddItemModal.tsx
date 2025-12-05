import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { addItem } from "../store/shoppingSlice";

export default function AddItemModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return Alert.alert("Enter item name");
    dispatch(addItem({ name, quantity: Number(qty) || 1, price: Number(price) || 0 }));
    setName(""); setQty(""); setPrice(""); onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBG}>
        <View style={styles.modalBox}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Add Item</Text>
          <TextInput style={styles.input} placeholder="Item Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Quantity" keyboardType="numeric" value={qty} onChangeText={setQty} />
          <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" value={price} onChangeText={setPrice} />
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}><Text style={{ color: "white" }}>Save</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={{ color: "white" }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBG: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "85%", backgroundColor: "white", padding: 20, borderRadius: 10 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginTop: 10 },
  saveBtn: { backgroundColor: "#4caf50", padding: 10, borderRadius: 8, marginRight: 10 },
  cancelBtn: { backgroundColor: "#999", padding: 10, borderRadius: 8 },
});
