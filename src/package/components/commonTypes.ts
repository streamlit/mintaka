interface ColSpec {
  label: str,
  field: str | null,
  detectedType: str | null,
}

interface Dict<T> {
  [key: str]: T,
}

interface BuilderPaneProps {
  marks: any,  // name -> {label, advanced, isDefault}
  channels: any,  // name -> {label, advanced, defaultFieldIndex}
  fields: any,  // name -> {label, advanced}
  components: {
    // TODO
  },
  columns: ColSpec[],
  state: {
    spec: any,
    setSpec: (any) => void,
  },
  baseSpec: any,
}
