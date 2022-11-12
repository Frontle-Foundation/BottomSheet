# @frontle/bottomsheet

> BottomSheet UI
>

![화면-기록-2022-07-12-오후-5.15.45](https://user-images.githubusercontent.com/49587288/197342550-9b052bac-24f0-4e15-ae98-aee8b046e378.gif)

## Usage

```javascript
import { BottomSheet } from "../../browser_modules/@frontle/bottomsheet/index.js";

const bottomSheet = new BottomSheet(
  "#app",
  '<button id="closeButton">close</button>'
);
bottomSheet.height = 100;
bottomSheet.startY = -50;
bottomSheet.beforeOpen = (sheetId) => {
  document.querySelector("#closeButton").onclick = () => {
    bottomSheet.close(sheetId);
  };
};
bottomSheet.open();
```

## Install

**Frontle**

```shell
frontle install @frontle/bottomsheet --notBuild
```

**Download files**

https://github.com/Frontle-Foundation/BottomSheet

## API

#### new BottomSheet(parents, html)

Create a bottom sheet object

```javascript
const bottomSheet = new BottomSheet(
  "#app",
  '<button id="closeButton">close</button>'
);
```

#### .sheetClass 

#### .contentsClass 

#### .backgroundClass

Set the css class of a bottom sheet

```javascript
bottomSheet.sheetClass = 'cssClassName';
bottomSheet.contentsClass = 'cssClassName1 cssClassName2';
bottomSheet.backgroundClass = '';
```

#### .height

Set bottom sheet height

```javascript
bottomSheet.height = 50;
```

#### .startY

Set bottom sheet start y position

```javascript
bottomSheet.startY = 0;
```

#### .backgroundClickExit

Set whether bottom sheet can be closed by clicking on bottom sheet background

```javascript
bottomSheet.backgroundClickExit = true;
```

#### .beforeOpen

This lifecycle is executed before the bottom sheet is opened

```javascript
bottomSheet.beforeOpen = (sheetID) => { console.log('before opened') }
```

#### .afterOpen

This lifecycle is executed after the bottom sheet is opened

```javascript
bottomSheet.afterOpen = (sheetID) => { console.log('after opened') }
```

#### .beforeEnd

This lifecycle is executed before the bottom sheet closes

```javascript
bottomSheet.beforeEnd = (sheetID) => { console.log('before closed') }
```

#### .afterEnd

This lifecycle is executed after the bottom sheet is closed

```javascript
bottomSheet.afterEnd = (sheetID) => { console.log('after closed') }
```

#### .open()

Open bottom sheet

```javascript
const sheetID = await bottomSheet.open();
```

#### .close(sheetID)

Close bottom sheet

```javascript
await bottomSheet.close(sheetID);
```

## People

The original author of @frontle/bottomsheet is [MushStory](https://github.com/MushStory)

## License

 [MIT](LICENSE)
