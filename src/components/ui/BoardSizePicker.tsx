import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BoardSize } from '../../data/queensPuzzleLoader';

interface BoardSizePickerProps {
  value: BoardSize;
  onChange: (boardSize: BoardSize) => void;
}

const BOARD_SIZES: BoardSize[] = [6, 7, 8, 9];

export function BoardSizePicker({ value, onChange }: BoardSizePickerProps) {
  return (
    <View style={styles.container}>
      {BOARD_SIZES.map((size) => (
        <Pressable
          key={size}
          onPress={() => onChange(size)}
          style={[
            styles.button,
            value === size ? styles.buttonActive : styles.buttonInactive,
          ]}
        >
          <Text
            style={[
              styles.text,
              value === size ? styles.textActive : styles.textInactive,
            ]}
          >
            {size}×{size}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    minWidth: 60,
  },
  buttonActive: {
    backgroundColor: '#4F6EF7',
    borderColor: '#4F6EF7',
  },
  buttonInactive: {
    backgroundColor: '#13131A',
    borderColor: '#2A2A3D',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  textActive: {
    color: '#0A0A0F',
  },
  textInactive: {
    color: '#8888AA',
  },
});
