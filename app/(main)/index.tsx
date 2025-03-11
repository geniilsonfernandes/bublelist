import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function index() {
  return (
    <View>
      <Text>Main</Text>
        <Link href="/(main)">main</Link>
    </View>
  )
}