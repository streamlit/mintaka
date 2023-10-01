<img src="https://github.com/streamlit/mintaka/assets/103002884/6d6e762d-c428-4110-a5d6-7bd1717ba44b" width="100px">

# Mintaka

**Mintaka is an open-source chart builder library for Vega-Lite written in React.**

What makes it special is that it's ultra-configurable:

* Mintaka uses your React components. All labels, selectboxes, etc, that is draws are provided by you.
* You choose which Vega-Lite properties to expose to the user.
* You can specify smart chart presets, so users don't need to know anything about Vega-Lite.
* And much more! See below for more.

👉 [Live demo](https://streamlit.github.io/mintaka/)


## How to use it in your project

1. Install Mintaka:

   ```sh
   npm install mintaka
   ```

1. Import the `BuilderPane` component:

   ```js
   import { BuilderPane } from "mintaka"
   import { Vega } from "react-vega"
   ```

1. Insert the `<BuilderPane>` component somewhere in your React project:

   ```jsx
   const [ generatedSpec, setGeneratedSpec ] = useState(null)

   return (
     ...

     <BuilderPane
         columnTypes={columnTypes}  // <-- Tell us what your data looks like 
         setGeneratedSpec={setGeneratedSpec}
         initialSpec={null}  // <-- Pass an initial VL spec for us to load into the builder
         ui={{
           BuilderContainer: MyContainer,  // <-- Bring your own UI components
           ChannelContainer: MyChannelContainer,
           GenericPickerWidget: MyGenericPickerWidget,
           ...
         }}
         config={{
           ...  // <-- Which VL properties to show, how to group them, etc.
                //     This has a pretty rich structure, and it's still in motion,
                //     so I'm leaving it out of this spec for the time being! 
         }}
         presets={{
           "Pie chart": {...},  // Specify presets.
           ...
         }}
       />

     <Vega data={myDataGoesHere} spec={generatedSpec} />  // <-- Just pass the spec into VegaLite

     ...
   )
   ```


## More info

- **The builder doesn’t draw the chart itself.** It just outputs a VL spec, and which you draw by passing into your own Vega-Lite component. Or you can use one I provide. Up to you!

    This allows you pass whatever settings you’d like to your VL component. Streamlit, for example, does some magic in order to support fast `.add_rows()`. This component doesn’t interfere with that.


- **The builder doesn’t actually need to access your data.** It only needs to know which columns it has, and what kinds of columns they are, via the `columnTypes` parameter. **This allows it to work with *any* data format**

    For example: Streamlit can continue to use Arrow, Snowsight can continue to use… whatever it uses today (it doesn’t matter what it is!)


- **The BuilderPane component doesn’t actually draw a single HTML element onscreen,** like divs, buttons, etc. Instead, it tells React to use the UI components provided via the `ui` prop. This means:
    - You can make it **use your own widget library**

        For example: The BuilderPane could use Streamlit widgets when inside Streamlit, and Snowsight widgets when inside Worksheets.

    - You can **customize it** *quite a bit!*

        For example: you could make the `mark` selectbox show little icons next to each mark, with a nice explanation below them. Or you could make the `color -> value` input use an actual color picker.


- **There’s a very powerful `config` parameter in there,** which allows you to do a few things:
    - Specify **how much of VL you’d like to expose** to users.

        For example: Don’t want to show the `aggregate` option? You can just omit it from the `config` object!


- **For complete noobs, you can specify presets** via a `presets` prop.

    For example: add a “Pie chart” preset that automatically builds a VL spec for a pie chart based on your data.

    - Here’s how this pie chart preset can be specified

        ```jsx
        presets={{
          "Pie chart": {
            mark: {  // Add this to the VL spec
              type: "arc",
              tooltip: true,
            },
            findColumns: {  // Search for matching columns, and name them A1, B1, etc.
              A1: { type: ["quantitative"] },
              B1: { type: ["nominal", "ordinal"], maxUnique: 20 },
              A2: {},
              B2: {},
            },
            ifColumn: {
              A1: {  // If A1 was found, add this to the VL spec
                encoding: {
                  theta: { field: "A1", aggregate: "sum" },
                }
              },
              B1: {  // If B1 was found, add this
                encoding: {
                  color: { field: "B1", bin: null },
                }
              },
              A2: {   // etc.
                encoding: {
                  theta: { field: "A2", aggregate: "count" },
                }
              },
              B2: {
                encoding: {
                  color: { field: "B2", bin: true },
                }
              },
            },
          },
        }}
        ```


## UI Structure

Below are the custom containers you should pass into `<BuilderPane>`'s `ui` prop, and how they
get structured in the DOM:

* `<BuilderContainer>`
  * `<PresetsContainer>` _(if exists in current viewMode)_
    * title: "Chart type"
    * statePath: ["preset"]
    * groupName: null
    * viewMode: null
    * customState: any
    * setCustomState: (any) => void

    * `<GenericPickerWidget>`

  * `<LayerContainer>`

    * `<MarkContainer>` _(if exists in current viewMode)_
      * title: "Mark"
      * statePath: ["mark"]
      * groupName: null
      * viewMode: string
      * customState: any
      * setCustomState: (any) => void

      * `<GenericPickerWidget>` x N
        * statePath: ["mark", propertyName]
        * groupName: string
        * widgetHint: string
        * label: string
        * value: any
        * setValue: (any) => void
        * items: Record<string, any>
        * customState: any
        * setCustomState: (any) => void

    * `<EncodingContainer>` _(if exists in current viewMode)_
      * title: "Encoding"
      * statePath: ["encoding"]
      * groupName: null
      * viewMode: string
      * customState: any
      * setCustomState: (any) => void

      * `<ChannelContainer>` x N _(if exists in current viewMode)_
        * title: "Encoding"
        * statePath: ["encoding", channelName]
        * groupName: null
        * viewMode: string
        * customState: any
        * setCustomState: (any) => void

        * `<GenericPickerWidget>` x N
          * statePath: ["encoding", channelName, propertyName]
          * groupName: string
          * widgetHint: string
          * label: string
          * value: any
          * setValue: (any) => void
          * items: Record<string, any>
          * customState: any
          * setCustomState: (any) => void

  * `<ToolbarContainer>`

    * `<ModePicker>`
        * items: Record<string, any>
        * value: any
        * setValue: (any) => void

    * `<ResetButton>`
        * onClick: () => void
