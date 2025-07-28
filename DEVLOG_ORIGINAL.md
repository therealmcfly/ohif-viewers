1. Development Log
    1. Understand the goal and requirements

        To have a base understanding of the goals and requirements before moving on to studying the viewer, I read through the code challenge document once thoroughly. The goal was basically to create a button to download a zip file that contains metadata and the image data that is currently displayed from the viewer. Everything else was clear except the mode and extension concept was a bit confusing at this time. For others, I assumed that there would be a SDK or a template extension provided by the developers, and using a JSZip library was recommended, thus felt that the only thing left to do was to understand the project structure and the concepts. In addition, the challenge involved a submitting a brief write-up so started logging the process at this stage.

    2. Understanding concepts and architecture

        From the previous stage, I found that understanding the concept of modes and extensions would be essential to this challenge. I started with reading and studying the documentations. I initially though just reading the Getting Started, Extensions and Modes page would be enough to understand and start development. Although I had a hard time understanding the hierarchal relation between Mode and Extension. Detailed information about this is explained in Challenges.

    3. Planning

        The basic plan is to create a custom mode called “Export Mode” that has all the basic layout and buttons as the basic view mode with addition to a Export Zip button. Also an extension that will provide the functionality of the button will be created. The button placement and setup implementation will be in the mode layer and the button functionality will be implemented in the extension layer.

        Development Steps

        1. Create mode ohif-mode-export and add export button to toolbar
        2. Create extension ohif-ext and add commands for the mode to utilize
        3. Add button to toolbar
        4. Get metadata
        5. Get image
        6. Create Zip using JSZip and trigger download
    4. Development environment setup & initialization

        The setup was very straight forward in the Getting Started documentation.

        - Fork and clone, or clone the OFIF/Viewers repository
        - Install dependencies
        - start local dev server to run the viewer
    5. Create and link mode using **OHIF Command Line Interface**

        The OHIF CLI provided simple way to create a mode and extension template using the commands below.

        - `yarn run cli create-extension` - creates a new template extension called ohif-ext-export
        - `yarn run cli create-mode` - creates a new template extension ohif-mode-export

        Then I studied the structure of the templates created also in comparison to the other extensions and modes, making test modifications, analyzing references and definitions to understand the code further.

    6. Add button to toolbar
        - Copied `toolbarButtons.ts` & `initToolGroup.ts` from longitudinal mode src folder to ohif-mode-export/src so the custom mode is not dependent on longitudinal mode
        - Add the new Button called `Export-Zip` to `toolbarButtons.ts` so it can be registered and also in the mode’s onModeEnter `toolbarService.updateSection`
        - In created extension, added command via `getCommandsModule` called `exportZip`
        - In mode, set the command for `Export-Zip` button to `exportZip`
        - Add export icon and apply
            - referred to [`2-Migration-3p10-Icons.md`](http://2-Migration-3p10-Icons.md) in migration-guide/ in the project
    7. getting meta data implementation
        - implement funcitonality of button in `exportZip` via `commandFn`

            ```tsx
            getCommandsModule: ({ servicesManager, commandsManager, extensionManager }) => {
                return {
                  definitions: {
                    exportZip: {
                      commandFn: () => {.......}
            ```

        - Retrieve display set ID

            ```tsx
            // Fetch the viewport ID
            const viewportId = viewportGridService.getActiveViewportId();
            // Retrieve displayset ID from viewport data
            const displaySetUID = viewportGridService.getViewportState(viewportId).displaySetInstanceUIDs[0];
            ```

        - Fetch display set data by retrieved display set ID

            ```tsx
            // Fetch display set data by retrieved display set ID
            const displaySet = displaySetService.getDisplaySetByUID(displaySetUID);
            ```

        - Retrieve patient name and study date from display set

            ```tsx
            // Fetch display set data by retrieved display set ID
            const patientName = displaySet.instance.PatientName[0].Alphabetic ?? 'undefined';
            const studyDate = displaySet.instance.StudyDate ?? 'undefined';
            ```

    8. get image implimentation
        - Get viewport elements in the DOM
        - Get active viewport by checking `border-highlight` attribute.
        - Get canvas element of active viewport and extract base64-encoded JPEG image

            ```tsx
            let canvas;

            elements.forEach(element => {
                const children = element.children;
                const overlayDiv = children[1];
                const contentDiv = children[0];

                if (overlayDiv?.classList.contains('border-highlight')) {
                  canvas = contentDiv.querySelector('canvas');
                  return;
                }
              });

              const jpegBase64 = canvas.toDataURL('image/jpeg');
            ```

    9. Zip the file using JSZip and trigger download
        - add JSZip library to the extension’s package.json to keep the dependency localized and avoids affecting the rest of the project.

            ```tsx
             // ohif-exp-export/package.json
             "dependencies": {
                "jszip": "^3.10.1"
              },
            ```

        - create json of patient name and study date
        - generate the zip and trigger download

            ```tsx
            // Create a zip file from JSZip
              const zip: JSZip = new JSZip();
              const metaDataJson = {
                patientName: patientName,
                studyDate: studyDate,
              };
              // Add metadata JSON and imageData to the zip file
              zip.file('metadata.json', JSON.stringify(metaDataJson, null, 2));
              zip.file('image.jpg', imageData.split(',')[1], { base64: true });

              // Generate the ZIP and trigger download
              zip.generateAsync({ type: 'blob' }).then(zipBlob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(zipBlob);
                link.download = `ohif-export.zip`.replace(/\s+/g, '_');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              });
            ```

    10. Refactor and cleanup
        - modularized some export zip functionality and get active canvas functionality to increase readability
        - removed unnecessary code from create export and mode template
    11. Create Readme
        1.
    12.
2. Challenges
    1. Understanding of  the relationship between Modes and Extensions’

        The confusion started after reading the code challenge document again. The statement “Your work should be encapsulated in a new, custom OHIF extension.” and “The extension should contain a new "mode" that can be activated.” questioned my understanding of what the mode and extensions were. At this point, my basic understanding of mode was the options that user can enter within a study in the study list page(eg. Basic Viewer, Segmentation, Microscopy, etc..), and the extension is a set of functionalities you can utilize within the mode. The tutorial videos in the HOIF documentations, especially the create-extension video showing adding extensions to as the mode’s package.json and index.tsx as depencencies , made me question the how the encapsulation and mode containment within the extension can be possible. Also the architecture documentation’s extension and mode section aligns with my understandings.

        https://docs.ohif.org/development/architecture

        I’ve spent several hours trying to understand and align the intent of the 2 statements to to my understanding of the concepts so I could pass every requirement of the code challenge, but was taking too much time.  Since it was a Saturday emailing employeer didnt seem to be an option Thus I decided to focus less on the 2 statement and focus more on the functionality instead.

        I eventually emailed the assessor to confirm if my understanding was correct

    2. Dilemma: Interpreting Code Challenge Instructions on OHIF Extension vs. Mode

        ## 📜 Conflicting Requirements

        The code challenge states:

        > “Your work should be encapsulated in a new, custom OHIF extension.”
        >
        >
        > “The extension should contain a new ‘mode’ that can be activated.”
        >
        > “This mode will define the new toolbar button and its associated logic.”
        >

        These statements raise multiple ambiguities:

        ---

        ### ❓ Ambiguity 1: Are Extension and Mode the Same Thing?

        - In OHIF’s architecture, **modes and extensions are different**:
            - **Extensions** provide tools, services, commands, viewports, etc.
            - **Modes** define how extensions are used — UI layout, routes, toolbars, etc.
        - The challenge language blurs this line by implying that the extension and mode are one entity.

        ---

        ### ❓ Ambiguity 2: Should a Mode Be Defined *Inside* the Extension?

        - The phrase *“the extension should contain a new mode”* is confusing.
            - Normally, **modes import extensions** via `extensionDependencies`, not the other way around.
        - This raises questions like:
            - Is it acceptable to define the mode and export it via `getModeModule()` in the extension?
            - Or is this wording just asking that all submitted code be *in one extension folder*, not strictly "nested"?

        ---

        ### ❓ Ambiguity 3: What Does “Mode Defines the Toolbar Button and Logic” Mean?

        - It says: *“This mode will define the new toolbar button and its associated logic.”*
        - But **commands** are usually part of the **extension**, not the mode.
            - The **mode registers them**, but doesn't own or define their behavior.
        - If the mode contains everything — button + logic — what’s left for the extension to do?
    3. Retrieving patient data
        - I Assumed that the data displayed on the viewport would have the metadata needed, so read through [“Service Manager](https://docs.ohif.org/platform/managers/service)” section in OHIF documentation, read through [“ViewportGridService”](https://docs.ohif.org/platform/services/ui/viewport-grid-service/) section and `ViewportGridService.ts`
        - Upon investigating the viewport data, found that did not contain meta data for the study but had displaySetUID. I assumed the display set data would contain relevent data thus read though “[Display Set Service](https://docs.ohif.org/platform/services/data/DisplaySetService)”  section and `DisplaySetService.ts`
        - Retrieved display set data using `displaySetService.getDisplaySetByUID` and did not find the patient name and study date in it, although found study ID which I can use to fetch the patient name and study date.
        - I remembered the DICOM Metadata Store in the documentation so read through [DICOM Metadata Store](https://docs.ohif.org/platform/services/data/DicomMetadataStore) and `DicomMetadataStore.ts`
        - I investigated the data returned from getStudy and getSeries but didnt find the patient name and study data in both. I found them from the instance data returned from getInstanceByImageId and recalled the instance data being in the display set data retrieved from the `displaySetService.getDisplaySetByUID,` .
        - Both were in instance.PatientName and instance.StudyData in the display set data.
    4. Fetching the current image data
        - There was a delema of how I can get the reference of the images.
            1. via the imageIds in the display set data
            2. via the canvas element in the DOM
        - the 1st method was my initial option but I since I need to provide a image file like JPEG, and I was sure that the display set data doesn’t contain the image file. I knew that the browser it self cannot display a Dicom images, so something must be converting them. That led me to investigate how the image was actually being displayed in the viewer.
        - The way this works is: OHIF uses cornerstone.js, a library designed to render medical images in the browser. It takes a DICOM image and renders the pixel data in to a <canvas> element. And I recalled a past project where I extracted jpeg from canvas elements, so researched about this.
        - I found that extracting the jpeg image from canvas was done using `toDataURL('image/jpeg')` . So I just needed to get the canvas element that was active and extract the jpeg image from there.
        - At this point the delema was how to get the image that is currently displayed in the viewport when there was more than one viewport available. For this, I noticed there was a border-highlight attribute on the selected viewport. So i got the canvas from the viewport element that had the border-highlight attribute and extracted the jpeg from that canvas.
        - problem with this method was that the size of the jpeg was the size of the displayed canvas on the viewport. Therfore, if there was multiple viewports displayed of the viewport grid, the jpeg image was small.
        - Going back to option 1, this method had problem with getting the actual layer image of the section. I as able to locate the image IDs(all layers), but I was not able to figure out the image ID of the current layer image showing on the viewport. Option 2 did not have a issue with this since it was actually getting the jpeg of the image that was rendered.
        - I attempted a sloppy way of increasing the scale of canvas to fit the window width and after extracting the jpeg before jpeg extraction, but this didnt work since the cornerstone seems to change the resolution of the pixels when it is rendered and resizing the canvas element just increased the size.
        - With more time, I would have like to investigate option 1 more, but the overhead was already too big at the moment so just went with option 2.

3. Future Implementations or Assumptions
    1. Options to including multiple sections and images in the ZIP file
        - if this wasn’t an assessment and had more time, I would have liked to add options to include the one or multiple sections that would download all the images in the sections selected in jpeg format.
        - The initial image extraction canvas element seems to be changed to a different method for this implementation.
    2. Option to select to add other patient and section datas
        - Ive found that the display set data contained a lot of information that can be added to the metadata.json file such ad age, gender, type of image etc, which I would have added tot he metadata in other circumstances.
