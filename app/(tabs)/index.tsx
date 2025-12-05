import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal, Alert, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState, AppDispatch } from "@/store/store";
import { loadLists, setCurrentList, createList, deleteList, Item } from "@/store/shoppingSlice";
import ItemCard from "@/components/ItemCard";
import AddItemModal from "@/components/AddItemModal";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "Last week";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function ShoppingApp() {
  const dispatch = useDispatch<AppDispatch>();
  const recentLists = useSelector((state: RootState) => state.shopping.recentLists);
  const currentListIndex = useSelector((state: RootState) => state.shopping.currentListIndex);
  const currentList = currentListIndex !== null ? recentLists[currentListIndex] : null;

  const [createVisible, setCreateVisible] = useState(false);
  const [createName, setCreateName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem("shopping_lists");
      if (json) dispatch(loadLists(JSON.parse(json)));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("shopping_lists", JSON.stringify(recentLists));
  }, [recentLists]);

  const saveCreate = () => {
    const name = createName.trim();
    if (!name) return Alert.alert("Enter list name");
    dispatch(createList(name));
    setCreateVisible(false);
    setCreateName("");
  };

  const confirmDeleteList = (index: number) => {
    Alert.alert(
      "Delete List",
      `Are you sure you want to delete "${recentLists[index].name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => dispatch(deleteList(index)) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {currentListIndex === null ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Grocery List</Text>
          <ScrollView>
            {recentLists.map((list, i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Text style={{ opacity: 0.6, marginBottom: 4, marginLeft: 4 }}>
                  {list.completedAt ? `Completed: ${formatDate(list.completedAt)}` : `Created: ${formatDate(list.createdAt)}`}
                </Text>
                <View style={[styles.card, list.completedAt ? { opacity: 0.6 } : {}]}>
                  <TouchableOpacity onPress={() => dispatch(setCurrentList(i))} style={{ flex: 1 }}>
                    <Text style={{ fontSize: 24 }}>🛍️</Text>
                    <Text style={{ fontWeight: "bold" }}>{list.name}</Text>
                    <Text style={{ opacity: 0.6 }}>{list.items.length} products</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDeleteList(i)} style={[styles.smallBtn, { backgroundColor: "#ff5252" }]}>
                    <Text style={{ color: "white" }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.createBtn} onPress={() => setCreateVisible(true)}>
            <Text style={{ color: "white", textAlign: "center" }}>Create new list</Text>
          </TouchableOpacity>

          <Modal visible={createVisible} transparent animationType="slide">
            <View style={styles.modalBG}>
              <View style={styles.modalBox}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>Create New List</Text>
                <TextInput style={styles.input} value={createName} onChangeText={setCreateName} placeholder="Enter list name" autoFocus />
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <TouchableOpacity style={styles.saveBtn} onPress={saveCreate}><Text style={{ color: "white" }}>Create</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setCreateVisible(false)}><Text style={{ color: "white" }}>Cancel</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => dispatch(setCurrentList(null))} style={styles.backCircle}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{currentList?.name}</Text>

          <View style={styles.totalBox}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Total: R
              {currentList
                ? currentList.items.filter(i => !i.purchased).reduce((sum, i) => sum + i.quantity * i.price, 0).toFixed(2)
                : "0.00"}
            </Text>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 140 }}>
            {currentList?.items.map(item => <ItemCard key={item.id} item={item} />)}
          </ScrollView>

          <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>

          <AddItemModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ShoppingApp />
    </Provider>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  totalBox: { padding: 12, backgroundColor: "#fff", borderRadius: 10, marginBottom: 10 },
  fab: { position: "absolute", bottom: 20, alignSelf: "center", backgroundColor: "#ff643c", width: 65, height: 65, borderRadius: 35, justifyContent: "center", alignItems: "center", elevation: 6 },
  fabText: { color: "white", fontSize: 34, fontWeight: "bold", marginTop: -3 },
  item: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 10 },
  itemDone: { opacity: 0.6 },
  itemHeader: { flexDirection: "row", alignItems: "center" },
  itemText: { fontSize: 16 },
  deleteBtn: { color: "white", backgroundColor: "#ff5252", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  editBox: { backgroundColor: "#f2f2f2", padding: 10, borderRadius: 8, marginTop: 10 },
  editInput: { backgroundColor: "white", padding: 8, borderRadius: 6, marginBottom: 8 },
  saveBtn: { backgroundColor: "#4caf50", padding: 10, borderRadius: 8, marginRight: 10 },
  cancelBtn: { backgroundColor: "#999", padding: 10, borderRadius: 8 },
  createBtn: { backgroundColor: "#ff643c", padding: 15, borderRadius: 10, marginTop: 20 },
  card: { flexDirection: "row", backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 10, alignItems: "center" },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginLeft: 10 },
  backCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#ccc", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  backIcon: { fontSize: 20, color: "#333" },
  modalBG: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "85%", backgroundColor: "white", padding: 20, borderRadius: 10 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginTop: 10 },
});

