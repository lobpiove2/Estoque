import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [inventory, setInventory] = useState([]);
  const [removeQuantity, setRemoveQuantity] = useState("");
  const [history, setHistory] = useState([]);

  const addItem = () => {
    if (itemName.trim() && itemQuantity) {
      const existingItem = inventory.find((item) => item.name === itemName);
      const quantityToAdd = parseInt(itemQuantity);

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
        setInventory([...inventory]);
      } else {
        setInventory([
          ...inventory,
          { name: itemName, quantity: quantityToAdd },
        ]);
      }

      // Adiciona ao histórico
      setHistory([
        ...history,
        {
          action: "Adicionado",
          name: itemName,
          quantity: quantityToAdd,
          time: new Date(),
        },
      ]);

      setItemName("");
      setItemQuantity("");
    }
  };

  const removeItem = (name) => {
    // Verifica se a quantidade a remover não está vazia
    if (!removeQuantity) {
      return; // Não faz nada se não houver quantidade a remover
    }

    const existingItem = inventory.find((item) => item.name === name);
    const quantityToRemove = parseInt(removeQuantity);

    if (existingItem) {
      existingItem.quantity -= quantityToRemove;
      if (existingItem.quantity <= 0) {
        setInventory(inventory.filter((item) => item.name !== name));
      } else {
        setInventory([...inventory]);
      }

      // Adiciona ao histórico
      setHistory([
        ...history,
        {
          action: "Removido",
          name: name,
          quantity: quantityToRemove,
          time: new Date(),
        },
      ]);
    }

    setRemoveQuantity("");
  };

  const getTotalStock = () => {
    return inventory.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Item"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade a Adicionar"
        value={itemQuantity}
        keyboardType="numeric"
        onChangeText={setItemQuantity}
      />
      <TouchableOpacity style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Adicionar Item</Text>
      </TouchableOpacity>

      <Text style={styles.totalStock}>Estoque Total: {getTotalStock()}</Text>

      <FlatList
        data={inventory}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>{`${item.name}: ${item.quantity}`}</Text>
            <TextInput
              style={styles.removeInput}
              placeholder="Qtd. a Remover"
              value={removeQuantity}
              keyboardType="numeric"
              onChangeText={setRemoveQuantity}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.name)}
            >
              <Text style={styles.buttonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.historyTitle}>Histórico</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()} // Usando o índice como chave
        renderItem={({ item }) => (
          <Text style={styles.historyItem}>
            {`${item.action} ${item.name}: ${
              item.quantity
            } em ${item.time.toLocaleString()}`}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E0F7FA", // Azul claro
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#00796B", // Cor do título
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    fontSize: 18,
    borderRadius: 5,
    fontFamily: "Arial",
  },
  totalStock: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00796B",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  item: {
    fontSize: 18,
    fontFamily: "Arial",
    color: "#424242",
  },
  removeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    width: 80,
    marginRight: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00796B", // Cor do botão
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  removeButton: {
    backgroundColor: "#D32F2F", // Cor do botão de remover
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", // Cor do texto do botão
    fontSize: 16,
    fontWeight: "bold",
  },
  historyTitle: {
    fontSize: 22,
    marginVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00796B",
  },
  historyItem: {
    fontSize: 16,
    color: "#424242",
    marginVertical: 5,
  },
});
