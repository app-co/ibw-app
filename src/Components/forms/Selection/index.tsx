import { Select } from "native-base";
import theme from "../../../global/styles/theme";

export type TSelectionItem = { value: string; label: string };

interface I {
  itens: TSelectionItem[];
  itemSelected: (value: string) => void;
  placeholder: string;
}

export function Selection({ itens, placeholder, itemSelected }: I) {
  return (
    <Select
      onValueChange={(h) => itemSelected(h)}
      _text={{ color: theme.colors.text[2] }}
      defaultValue="Selecione um item"
      rounded="15px"
      h="45px"
      placeholder={placeholder}
    >
      {itens.map((h) => (
        <Select.Item
          color={theme.colors.text[2]}
          key={h.value}
          label={h.label}
          value={h.value}
        />
      ))}
    </Select>
  );
}
