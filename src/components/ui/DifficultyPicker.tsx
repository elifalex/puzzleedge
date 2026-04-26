import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Difficulty } from '../../constants/gameConfig';

interface DifficultyPickerProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <View style={styles.container}>
      {DIFFICULTIES.map((diff) => (
        <Pressable
          key={diff}
          onPress={() => onChange(diff)}
          style={[
            styles.button,
            value === diff ? styles.buttonActive : styles.buttonInactive,
          ]}
        >
          <Text
            style={[
              styles.text,
              value === diff ? styles.textActive : styles.textInactive,
            ]}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    borderWidth: 1,
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
  },
  textActive: {
    color: '#0A0A0F',
  },
  textInactive: {
    color: '#8888AA',
  },
});
