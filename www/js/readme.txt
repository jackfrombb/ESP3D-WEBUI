Sample description of JS files

- dialogs
    Modal windows for updates, settings, confirmations, etc.

- language
    Stores strings for translation into other languages

- 0_page_events.js
    To combine all the events of the page in one place

- 1_dom_entities.js
    Temporary storage of classes, for thinking over the structure

- app.js
    It looks like it's a mix of UI initialization, information update and some helpers

- camera.js
    Save and read camera address, camera on page init

- commands.js
    Sends commands and processes the response. Custom commands

- config.js
    It looks like it's about the ESP configuration

- controls.js
    All about controlling the movement of the printer axes

- custom.js
    Functions to handle custom messages sent via serial.
    In gcode file, M118 can be used to send messages on serial.
    This allows the microcontroller to communicate with hosts.
    Example:
        M118 [esp3d]<your message>
          will send "esp3d:<your message>" over serial, which can be picked up by host
          to trigger certain actions.
        M118 [esp3d]<function call>
          will call the function, as long as a handler has been predefined to identify
          the call.

- dropmenu.js
    All about drop menu

- extruders.js
    Extruders panel i dash. Feedrate, Fans, Flowrate, Extrude

- files.js
    Files panel in dash

- grbl.js
     Grbl is a no-compromise, high performance, low cost alternative
       to parallel-port-based motion control for CNC milling.
       It will run on a vanilla Arduino (Duemillanove/Uno) as long as it sports an Atmega 328.

- http.js
    Work with http requests (send file and etc)

- icons.js
    For storing icons

- new_dash.js
    Temporary file for working out the design change

- printercmd.js
    To send a command to the printer

- settings.js
    Apparently for the settings tab

- smoothie.js
    A JavaScript Charting Library for Streaming Data
        Smoothie Charts - http://smoothiecharts.org/

- tabs.js
    To switch tabs

- temperatures.js
    For temperatures panel in dash

- themes.js
    To switch themes (Light/Dark)

- translate.js
    For implement the translation work

- wizard.js
    For open start setup dialog