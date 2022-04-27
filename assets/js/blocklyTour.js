/*************************************************************************************
 * 
 * 
 * Title: Blockly Tour
 * 
 * Version:
 * 
 * Path: /assets/js/blocklyTour.js
 * 
 * Authors: Basim Abdullah Tariq
 *          Muhammad Talha Sajjad
 * 
 * Description: This file contains a walkthrough tour of the app. This walkthrough is
 *              made using Shepherd.js library, and teaches the user how to navigate
 *              and use the app. To add or remove a step simply copy and paste or
 *              delete .addStep function.
 * 
 * Refrence(s): https://shepherdjs.dev/docs/
 * 
 * 
 *************************************************************************************/

const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true
      },
      classes: 'walkClass',
      scrollTo: { behavior: 'smooth', block: 'center' }
    }
  });
  
  tour.addStep({
    title: 'Hi! I am EduBot!',
    text: `Lets learn programming together!`,

    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ],
    id: 'creating'
  });
  tour.addStep({
    text: `Here you can use blocks to code the robot. Let's get started!`,
    attachTo: {
      element: '.blockBtn',
      on: 'bottom'
    },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ],
    id: 'creating'
  });
  tour.addStep({
    text: `Here you can use see the arduino code corresponding to the blockly code. (Note: Arduino is a little chip or microcontroller in your robot)`,
    attachTo: {
      element: '.arduinoBtn',
      on: 'bottom'
    },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ],
    id: 'creating'
  });
  tour.addStep({
    text: `You can run your code by pressing me ;)`,
    attachTo: {
      element: '.runBtn',
      on: 'bottom'
    },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ],
    id: 'creating'
  });
  tour.addStep({
    text: `press me to see the commands that are successfully sent to the robot`,
    attachTo: {
      element: '.showBtn',
      on: 'bottom'
    },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ],
    id: 'creating'
  });
  tour.addStep({
    text: `Blockly Workspace.`,
    attachTo: {
      element: '.blocklyClass',
      on: 'top'
    },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ],
    id: 'creating'
  });
  tour.addStep({
    text: `Toolbox.`,
    attachTo: {
      element: '.blocklyToolboxDiv',
      on: 'top'
    },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ],
    id: 'creating'
  });
  
  //tour.start();