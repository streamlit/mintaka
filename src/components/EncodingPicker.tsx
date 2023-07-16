export function EncodingPicker({components, title, field, fields, setField, type, types, setType}) {
  return (
    <components.WidgetGroup title={title}>
      <components.WidgetWrapper>
        <components.Label>Field</components.Label>
        <components.SelectBox
          items={fields}
          value={field}
          setValue={setField}
        />
      </components.WidgetWrapper>

      <components.WidgetWrapper>
        <components.Label>Type</components.Label>
        <components.SelectBox
          items={types}
          value={type}
          setValue={setType}
        />
      </components.WidgetWrapper>
    </components.WidgetGroup>
  )
}
