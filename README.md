# README

## 1. Installation and Run

### 1.1 Clone Repo

Clone the OHIF Viewer repository.

### 1.2 Install Dependencies

```bash
yarn install
```

### 1.3 Run the Viewer

```bash
yarn run dev
```

* This will automatically open the viewer running at localhost:3000 in the browser.
* It may take a while to compile for the first time.

## 2. Usage Instructions

### 2.1 Open Study

Click on any study in the study list.

### 2.2 Enter Export Mode

Click on the **Export Mode** button.

### 2.3 Select Image

Double-click the viewport containing the image you want to export to expand it. Once it becomes a single full-screen viewport, use your mouse wheel to scroll through the image stack and stop at the specific layer you wish to export.

### 2.4 Export Zip

Locate the **Export Zip** button in the toolbar above (last button on the right). This will trigger a download of the zip file.

### 2.5 Extract and Verify

Extract the downloaded zip file. It should contain:

* `image.jpg`
* `metadata.json`

### 2.6 Verify Contents

* Open `image.jpg` and confirm it matches the image shown in the current active viewport.
* Open `metadata.json` with Notepad or another text editor and confirm that the patient name and study date match the data in the viewer.

  * **Patient Name** can be verified by clicking "Patient" in the top-right toolbar of the OHIF viewer.
  * **Study Date** can be found at the top of the left panel.

For development notes and technical details, see [DEVLOG.md](./DEVLOG.md).
