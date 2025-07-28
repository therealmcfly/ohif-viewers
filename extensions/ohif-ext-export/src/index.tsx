import { id } from './id';
import getActiveCanvas from './getActiveCanvas';
import exportZip from './exportZip';
import { Icons } from '@ohif/ui-next';
import exportIcon from './exportIcon';

export default {
  id,
  preRegistration: ({ servicesManager, commandsManager, configuration = {} }) => {
    Icons.addIcon('export', exportIcon);
  },
  getCommandsModule: ({ servicesManager, commandsManager, extensionManager }) => {
    return {
      definitions: {
        exportZip: {
          commandFn: () => {
            // Get all elements in the viewport grid
            const elements = document.querySelectorAll('.group\\/pane');

            if (elements.length > 1) {
              alert(
                'Please display a single sections image that you wish to export. You can do this by double-clicking on the viewport with the section you wish to select.'
              );
              return;
            }
            // Get the active image from the viewport
            const canvas = getActiveCanvas(elements);
            console.log('Active Canvas:', canvas);
            if (!canvas) {
              alert('No canvas found for the active viewport.');
              return;
            }

            // Get the patient name and study date
            const { viewportGridService, displaySetService } = servicesManager.services;
            // Fetch the viewport ID
            const viewportId: string = viewportGridService.getActiveViewportId();
            // Retrieve displayset ID from viewport data
            const displaySetUID: string =
              viewportGridService.getViewportState(viewportId).displaySetInstanceUIDs[0];
            // Fetch display set data by retrieved display set ID
            const displaySet: any = displaySetService.getDisplaySetByUID(displaySetUID);
            console.log('Display Set:', displaySet);

            // Retrieve patient name and study date from display set
            const patientName: string =
              displaySet?.instance?.PatientName[0]?.Alphabetic ?? 'undefined';
            const studyDate: string = displaySet?.instance?.StudyDate ?? 'undefined';
            // Add image to zip (as base64)
            const jpegBase64 = canvas.toDataURL('image/jpeg');

            // create a zip file with metadata and image and trigger download
            exportZip(patientName, studyDate, jpegBase64);
          },
        },
      },
      defaultContext: 'ACTIVE_VIEWPORT::CORNERSTONE',
    };
  },
};
