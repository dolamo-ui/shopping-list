
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AppDispatch } from "../store/store";
import { togglePurchased, editItem, deleteItem, Item } from "../store/shoppingSlice";

export default function ItemCard({ item }: { item: Item }) {
  const dispatch = useDispatch<AppDispatch>();
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQty, setEditQty] = useState(String(item.quantity));
  const [editPrice, setEditPrice] = useState(String(item.price));

  const saveEdit = () => {
    if (!editName.trim()) return Alert.alert("Enter item name");
    dispatch(
      editItem({
        ...item,
        name: editName,
        quantity: Number(editQty) || 1,
        price: Number(editPrice) || 0,
      })
    );
    setEditMode(false);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => dispatch(deleteItem(item.id)) },
      ]
    );
  };

  return (
    <View style={[styles.item, item.purchased && styles.itemDone]}>
      <View style={styles.itemHeader}>
        <TouchableOpacity onPress={() => dispatch(togglePurchased(item.id))}>
          <Text style={{ fontSize: 20 }}>{item.purchased ? "⦿" : "⦾"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setEditMode(true)}
          style={{ flex: 1, marginHorizontal: 8 }}
        >
          <Text
            style={[
              styles.itemText,
              item.purchased && { textDecorationLine: "line-through", opacity: 0.5 },
            ]}
          >
            {item.name} ({item.quantity}) - R{item.price.toFixed(2)}
          </Text>
        </TouchableOpacity>

       
        <TouchableOpacity onPress={() => setEditMode(true)} style={styles.editBtn}>
          <FontAwesome name="pencil" size={16} color="white" /> 
          <Text style={{ color: "white", marginLeft: 4 }}>Edit</Text>
        </TouchableOpacity>

        
        <TouchableOpacity onPress={confirmDelete} style={styles.deleteBtnContainer}>
          <FontAwesome name="trash" size={16} color="white" />
          <Text style={{ color: "white", marginLeft: 4 }}>Delete</Text>
        </TouchableOpacity>
      </View>

      {editMode && (
        <View style={styles.editBox}>
          <TextInput
            style={styles.editInput}
            value={editName}
            onChangeText={setEditName}
            placeholder="Item Name"
          />
          <TextInput
            style={styles.editInput}
            keyboardType="numeric"
            value={editQty}
            onChangeText={setEditQty}
            placeholder="Quantity"
          />
          <TextInput
            style={styles.editInput}
            keyboardType="numeric"
            value={editPrice}
            onChangeText={setEditPrice}
            placeholder="Price"
          />
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}>
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 10 },
  itemDone: { opacity: 0.6 },
  itemHeader: { flexDirection: "row", alignItems: "center" },
  itemText: { fontSize: 16 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff643c",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  deleteBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff5252",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editBox: { backgroundColor: "#f2f2f2", padding: 10, borderRadius: 8, marginTop: 10 },
  editInput: { backgroundColor: "white", padding: 8, borderRadius: 6, marginBottom: 8 },
  saveBtn: { backgroundColor: "#4caf50", padding: 10, borderRadius: 8, marginRight: 10 },
  cancelBtn: { backgroundColor: "#999", padding: 10, borderRadius: 8 },
});
