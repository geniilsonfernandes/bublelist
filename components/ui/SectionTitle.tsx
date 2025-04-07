
import { ThemedText } from "./ThemedText";



type SectionTitleProps = {
    title: string;
} & React.ComponentProps<typeof ThemedText>;
// Componentização simples para os títulos de seção
export function SectionTitle(props: SectionTitleProps) {
  const { title, ...rest } = props;
  return (
    <ThemedText type="defaultSemiBold" colorName="text.5"
      {...rest}
    >
      {title}
    </ThemedText>
  );
}
