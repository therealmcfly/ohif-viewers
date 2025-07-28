## 1. Development Log

### 1.1 Understand the goal and requirements

* Read through the code challenge document.
* Goal: Create a button to download a zip containing metadata and image data from the viewer.
* Confusion: Mode vs Extension concepts.
* Assumption: SDK or template extension would be provided. JSZip recommended.
* Start logging from this stage.

### 1.2 Understanding concepts and architecture

* Focused on understanding OHIF's mode and extension system.
* Read "Getting Started", "Extensions", and "Modes" docs.
* Still unclear about hierarchical relation between mode and extension.

### 1.3 Planning

* Create a custom mode called `Export Mode` with the default layout plus an `Export Zip` button.
* Create an extension for the functionality.
* Responsibilities:

  * Mode: Layout + button registration
  * Extension: Button logic

#### Development Steps

1. Create mode `ohif-mode-export` and add export button to toolbar.
2. Create extension `ohif-ext-export` and add command.
3. Connect button to command.
4. Fetch metadata.
5. Extract image.
6. Use JSZip to create ZIP and trigger download.

### 1.4 Development environment setup

* Followed "Getting Started" guide:

  * Cloned OHIF/Viewers repo
  * Installed dependencies
  * Ran dev server

### 1.5 Create and link mode using CLI

* Used OHIF CLI:

  * `yarn run cli create-extension`
  * `yarn run cli create-mode`
* Studied and modified the generated templates

### 1.6 Add button to toolbar

* Copied `toolbarButtons.ts` and `initToolGroup.ts` from longitudinal mode
* Registered new button `Export-Zip`
* Added command `exportZip` in extension's `getCommandsModule`
* Assigned command to button in mode
* Used migration doc to find appropriate icon

### 1.7 Metadata extraction

* Implemented `exportZip` command:

```tsx
const viewportId = viewportGridService.getActiveViewportId();
const displaySetUID = viewportGridService.getViewportState(viewportId).displaySetInstanceUIDs[0];
const displaySet = displaySetService.getDisplaySetByUID(displaySetUID);
const patientName = displaySet?.instance?.PatientName[0]?.Alphabetic ?? 'undefined';
const studyDate = displaySet?.instance?.StudyDate ?? 'undefined';
```

### 1.8 Image extraction

* Get canvas from active viewport using `border-highlight` class
* Extract JPEG:

```tsx
const jpegBase64 = canvas.toDataURL('image/jpeg');
```

### 1.9 Zip using JSZip

* Added `jszip` to extension `package.json`
* Created ZIP with metadata and image:

```tsx
zip.file('metadata.json', JSON.stringify(metaDataJson, null, 2));
zip.file('image.jpg', imageData.split(',')[1], { base64: true });
```

* Triggered download via Blob + anchor click

### 1.10 Refactor and Cleanup

* Modularized canvas and zip code
* Removed unnecessary template code

### 1.11 Create Readme

* In progress

## 2. Challenges

### 2.1 Understanding Mode vs Extension

* Challenge statements:

  * "Extension should contain a new mode"
  * "Mode defines toolbar button and its logic"
* OHIF architecture says:

  * Extension = tools/commands
  * Mode = layout + extension usage
* Ambiguities:

  1. Are they the same thing?
  2. Can mode live inside extension?
  3. Who owns logic?
* Eventually focused on functionality rather than semantics
* Emailed assessor to clarify

### 2.2 Retrieving Patient Data

* Assumed it was in the viewport
* Used `viewportGridService` to get `displaySetUID`
* Used `displaySetService` to get data
* Patient name and study date not directly available
* Eventually found in `displaySet.instance.PatientName` and `instance.StudyDate`

### 2.3 Getting Image Data

* Dilemma: Extract from image ID vs rendered canvas
* Image ID method was ambiguous — hard to find currently displayed image
* Canvas method was simple but resolution depends on viewport size
* Tried scaling canvas but it didn't help
* Stuck with canvas method due to time

## 3. Future Implementations or Assumptions

### 3.1 Multiple image exports

* Add UI to select multiple images or sections
* Export all selected in ZIP

### 3.2 Additional metadata options

* Use more fields like age, gender, image type, etc. in `metadata.json`
* Display set has a lot more useful data


* This is a AI regenerated summary of my development log. Please refer to the link below for original version.

> 📄 Original full development logs: [View Full Logs in README](./DEVLOG_ORIGINAL.md)
