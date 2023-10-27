import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Dimensions, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'column',
    backgroundColor: 'lightgray',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    textAlign: 'center',
    padding: 4,
    backgroundColor: 'white',
  },
  headerCell: {
    backgroundColor: 'lightgreen',
    fontWeight: 'bold',
  },
  downloadButton: {
    marginTop: 10,
  },
  resetButton: {
    marginTop: 10,
  },
});

const Grid = () => {
  const numRows = 10;
  const numCols = 5;
  const initialGridData = Array(numRows)
    .fill('')
    .map(() => Array(numCols).fill(''));

  const [gridData, setGridData] = useState(initialGridData);

  useEffect(() => {
    // Load grid data from SecureStore when the component mounts
    loadGridData();
  }, []);

  const loadGridData = async () => {
    try {
      const savedGridData = await SecureStore.getItemAsync('gridData');
      if (savedGridData) {
        setGridData(JSON.parse(savedGridData));
      }
    } catch (error) {
      console.error('Error loading grid data:', error);
    }
  };

  const saveGridData = async (data) => {
    try {
      await SecureStore.setItemAsync('gridData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving grid data:', error);
    }
  };

  const renderGrid = () => {
    const grid = [];

    // Header Row
    const headerRow = ['A', 'B', 'C', 'D', 'E'].map((header, col) => (
      <Text key={header} style={[styles.cell, styles.headerCell]}>
        {header}
      </Text>
    ));
    grid.push(
      <View key="header" style={[styles.row, styles.headerRow]}>
        {headerRow}
      </View>
    );

    for (let row = 0; row < numRows; row++) {
      const rowCells = [];

      for (let col = 0; col < numCols; col++) {
        const cellKey = `${row}-${col}`;

        rowCells.push(
          <TextInput
            key={cellKey}
            style={styles.cell}
            value={gridData[row][col]}
            onChangeText={(text) => handleCellChange(row, col, text)}
          />
        );
      }

      grid.push(
        <View key={`row-${row}`} style={styles.row}>
          {rowCells}
        </View>
      );
    }

    return grid;
  };

  const handleCellChange = (row, col, text) => {
    const updatedGridData = [...gridData];
    updatedGridData[row][col] = text;
    setGridData(updatedGridData);
    saveGridData(updatedGridData); // Save the updated grid data to SecureStore
  };

  const handleDownload = async () => {
    const csvData = gridData.map((row) => row.join(',')).join('\n');
    const filePath = `${FileSystem.documentDirectory}/excel.csv`;

    try {
      await FileSystem.writeAsStringAsync(filePath, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Alert.alert('CSV File Created', 'The CSV file has been successfully created in ' + filePath);

      handleReset();

    } catch (error) {
      Alert.alert('Error', 'An error occurred while creating the CSV file.');
      console.error(error);
    }
  };

  const handleReset = () => {
    setGridData(initialGridData); // Reset the grid data to its initial state
    saveGridData(initialGridData); // Save the reset data to SecureStore
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={[styles.grid, { width: screenWidth }]}>
      {renderGrid()}
      <Button title="Download" onPress={handleDownload} style={styles.downloadButton} />
      <Button title="Reset" onPress={handleReset} style={styles.resetButton} />
    </View>
  );
};

export default Grid;
