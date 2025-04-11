import React from "react";
import { StyleSheet, View } from "react-native";

import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { ThemedText } from "@/components/ui/ThemedText";

export default function PrivacyPolicy() {
  return (
    <BodyScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <ThemedText type="title">Política de Privacidade</ThemedText>
        <ThemedText style={styles.lastUpdated}>
          Última atualização: {new Date().toLocaleDateString()}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          1. Informações Coletadas
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          O Buble List funciona totalmente offline e não coleta, armazena ou
          compartilha informações pessoais dos usuários.
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          2. Uso de Dados
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Todos os dados (listas e itens criados) ficam armazenados localmente
          no seu dispositivo. Nenhuma informação é enviada para servidores
          externos.
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          3. Compartilhamento de Dados
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          O Buble List não compartilha dados com terceiros.
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          4. Seus Direitos
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Como todos os dados ficam no seu dispositivo, você tem total controle
          sobre eles. Você pode excluir ou modificar suas informações a qualquer
          momento dentro do próprio aplicativo.
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          5. Alterações nesta Política
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Podemos atualizar esta política de tempos em tempos. A versão mais
          recente estará sempre disponível no aplicativo.
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          6. Contato
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Se você tiver dúvidas sobre esta política de privacidade, entre em
          contato:
        </ThemedText>
        <ThemedText style={styles.contact}>
          orriker.dev@gmail.com
        </ThemedText>
      </View>
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  section: {
    marginBottom: 24,
  },
  lastUpdated: {
    color: "gray",
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 24,
  },
  contact: {
    marginTop: 8,
    color: "#007AFF",
  },
});
