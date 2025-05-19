import { Text, TextInput, View } from "react-native"
import { StyleSheet } from "react-native"

export default function FormTextField({ label, errors = [], ...rest }) {
  return (
    <View>
      {label && (
        <Text
          style={styles.label}>
          {label}
        </Text>
      )}

      <TextInput

        style={styles.input}
        autoCapitalize='none'
        {...rest}
      />
      {errors.map((err)=>{
        return (
          <Text key={err} style={{color:'red', marginTop:2}}>
            {err}
          </Text>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  label: { 
    color: '#334155', 
    fontWeight: "500" 
  },
  input:{
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    textAlign: 'center',
  }
})