# Yaware.TimeTracker extension for Gnome Shell

This is a companion extension for the [Yaware](https://yaware.com/) desktop time-tracking application. It acts as a bridge, allowing the main application to securely access information from the GNOME Shell desktop environment, which is necessary for accurate activity tracking.

This extension has no visible user interface and works in the background, responding to requests only from the Yaware client.

### Features
This extension provides a D-Bus service (org.gnome.Shell.Extensions.Yaware) that enables the following functionalities for the Yaware desktop client:

* List Windows: Provides a complete list of all currently open windows, including their titles, process IDs, and application classes.

* Identify Active Window: Determines which window is currently in focus to track active application usage accurately.

* Take Screenshots: Allows the Yaware client to request screenshots of the desktop for reporting purposes. The extension handles the screen capture securely and passes the resulting image path back to the client.
